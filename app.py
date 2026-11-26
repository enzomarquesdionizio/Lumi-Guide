"""Backend do Lumi Guide:

Rodar na pasta do projeto:
    uvicorn app:app --reload
Depois abra http://localhost:8000
"""

import json
import logging
import os
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

from prompt import FALLBACK_ANSWER, LUMI_SYSTEM_PROMPT, LUMI_JSON_SCHEMA


# Configuração da aplicação
load_dotenv(Path(__file__).with_name(".env"))

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("lumi")

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
MAX_HISTORY = 10
RATE_LIMIT = 5

app = FastAPI(title="Lumi Guide")
_hits: dict[str, deque] = defaultdict(deque)


# Modelos de entrada
class Msg(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatIn(BaseModel):
    messages: list[Msg] = Field(min_length=1, max_length=60)


# Controle de requisições
def rate_limited(ip: str) -> bool:
    q, now = _hits[ip], time.time()

    while q and now - q[0] > 60:
        q.popleft()

    if len(q) >= RATE_LIMIT:
        return True

    q.append(now)
    return False


# Endpoint de conversa
@app.post("/api/chat")
def chat(body: ChatIn, request: Request):
    ip = request.client.host if request.client else "?"

    if rate_limited(ip):
        raise HTTPException(429, "Muitas mensagens. Aguarde um instante.")

    api_key = (os.getenv("GROQ_API_KEY") or "").strip()
    if not api_key:
        raise HTTPException(
            503,
            "Configure GROQ_API_KEY no arquivo .env para ativar o Lumi Guide.",
        )

    msgs = [m.model_dump() for m in body.messages][-MAX_HISTORY:]

    while msgs and msgs[0]["role"] != "user":
        msgs.pop(0)

    if not msgs or msgs[-1]["role"] != "user":
        raise HTTPException(400, "A última mensagem deve ser do usuário.")

    try:
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        resp = client.chat.completions.create(
            model=MODEL,
            max_completion_tokens=2048,
            reasoning_effort="low",
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "lumi_response",
                    "strict": True,
                    "schema": LUMI_JSON_SCHEMA
                }
            },
            messages=[
                {"role": "system", "content": LUMI_SYSTEM_PROMPT},
                *msgs,
            ],
        )

        content = resp.choices[0].message.content or ""
        data = json.loads(content)
        answer = str(data.get("answer", "")).strip()
        followups = [str(f) for f in data.get("followups", [])][:3]

        if not answer:
            raise ValueError("resposta vazia")

        return {"answer": answer, "followups": followups}

    except Exception:
        log.exception("Falha ao consultar a API da Groq")
        return {"answer": FALLBACK_ANSWER, "followups": []}


# Arquivos estáticos do frontend
app.mount(
    "/",
    StaticFiles(directory=Path(__file__).parent / "static", html=True),
    name="static",
)
