const $ = s => document.querySelector(s), E = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const P = { plus: '<path d="M5 12h14"/><path d="M12 5v14"/>', wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>', rec: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>', shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>', spark: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>', trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>', buoy: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>', trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>', moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', chev: '<path d="m9 18 6-6-6-6"/>', up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>', copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>', tu: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>', td: '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>', check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', pen: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>', more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>', back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>', calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>', target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', game: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.55-.6-6.58-.69-7.26A4 4 0 0 0 17.32 5z"/>', comp: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z"/>', orbit: '<circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.94-15.42"/><path d="M13.5 2.1a10 10 0 0 0-9.84 15.42"/>', star: '<path d="M11.53 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.91l5.16-.75a2.12 2.12 0 0 0 1.6-1.16z"/>', hp: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>', chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>' };
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const orb = (s, d) => `<span class="orb" style="--s:${s}px"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="25" r="12.5" fill="url(#of)"/><circle cx="19.6" cy="24" r="2.05" fill="#04121F" opacity=".85"/><circle cx="28.4" cy="24" r="2.05" fill="#04121F" opacity=".85"/><path d="M19 30c1.6 1.4 3.3 2.1 5 2.1s3.4-.7 5-2.1" stroke="#04121F" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".75"/><path d="M24 2.4l1.45 5.15L30.6 9l-5.15 1.45L24 15.6l-1.45-5.15L17.4 9l5.15-1.45z" fill="#A7F3D0"/></svg>${d ? '<i class="dot"></i>' : ''}</span>`;
const SUG = [['wallet', 'Como organizar minhas finanças?'], ['rec', 'Como funciona o Pix?'], ['shield', 'Como identificar um golpe?'], ['spark', 'Quais funcionalidades o Lumi oferece?'], ['trend', 'Quero aprender sobre investimentos.']];
const RS = [['dash', 'Dashboard financeiro', 'Análise inteligente de gastos por categoria, com evolução mensal e comparações.'], ['rec', 'Controle de despesas', 'Registre e classifique despesas recorrentes para enxergar para onde o dinheiro vai.'], ['calc', 'Simulador de economia', 'Simule o cancelamento de uma despesa e veja quanto ela vira em 1, 5 e 10 anos.'], ['target', 'Metas e sonhos', 'Planeje objetivos com prazo, aporte mensal e acompanhamento do progresso.'], ['trend', 'Calculadora de investimentos', 'Compare aportes, prazos e taxas para entender o efeito dos juros compostos.'], ['chart', 'Indicadores econômicos', 'Selic, CDI, IPCA e dólar explicados em linguagem simples, com impacto no seu bolso.'], ['game', 'Jogos de educação financeira', 'Desafios rápidos para treinar decisões de orçamento e consumo consciente.'], ['comp', 'Personalidade financeira', 'Um teste que revela seu perfil de comportamento com dinheiro e como evoluir.'], ['orbit', 'Perfil Visionário', 'Jornadas de evolução financeira por objetivo de vida, do primeiro passo ao avançado.'], ['star', 'Conquistas e gamificação', 'Missões, medalhas e níveis que transformam hábitos financeiros em progresso visível.']];
const K = {
    golpe: { h: 'Proteja sua luz financeira', b: [['p', 'Identificar tentativas de fraude é o primeiro passo para manter sua órbita financeira segura. Fique atento a estes sinais de alerta:'], ['ul', [['Urgência excessiva', 'Golpistas tentam te pressionar a tomar decisões rápidas.'], ['Links suspeitos', 'Mensagens que pedem cliques em endereços estranhos via SMS ou e-mail.'], ['Solicitação de dados', 'Nunca compartilhe senhas, tokens ou códigos de autenticação.'], ['Ofertas irreais', 'Promoções muito vantajosas que parecem boas demais para ser verdade.']]], ['c', 'Dica Lumi', 'O Lumi Bank nunca solicita seus dados confidenciais por telefone, redes sociais ou links externos. Se desconfiar de qualquer comunicação, encerre o contato imediatamente e entre em contato conosco pelos canais oficiais dentro do aplicativo.'], ['p', 'Caso suspeite de algum golpe, bloqueie seu cartão pelo app, registre um Boletim de Ocorrência e reporte o ocorrido ao nosso time de segurança. Quer aprender mais sobre como se proteger no ambiente digital?']], k: ['O que fazer se eu cliquei em um link suspeito?', 'Como ativar a autenticação em duas etapas?'] },
    link: { h: 'Aja com rapidez e segurança', b: [['p', 'Se você clicou em um link suspeito, mantenha a calma, mas aja imediatamente para proteger sua conta e seus dados:'], ['ul', [['Desconecte-se', 'Saia da sua conta em todos os dispositivos e feche o navegador ou o aplicativo.'], ['Bloqueie o acesso', 'Acesse o app do Lumi Bank, vá até a seção de cartões e segurança para bloquear temporariamente seus cartões e alterar suas senhas de acesso.'], ['Verifique transações', 'Revise seu extrato em busca de movimentações que você não reconhece.'], ['Reporte o incidente', 'Entre em contato conosco pelos canais oficiais dentro do aplicativo para informar o ocorrido.'], ['Segurança extra', 'Se você inseriu senhas em sites de terceiros, altere essas credenciais imediatamente em outros serviços (e-mail, redes sociais, etc).']]], ['c', 'Atenção', 'Em casos de suspeita de fraude após clicar em um link, é recomendável registrar um Boletim de Ocorrência (BO) digital para se resguardar legalmente.'], ['p', 'Lembre-se: eu oriento sobre a prevenção, mas não tenho acesso à sua conta para realizar bloqueios. A agilidade nestes primeiros minutos é fundamental.']], k: ['Como alterar minha senha no app?', 'Como denunciar uma transação não reconhecida?', 'Quais as melhores práticas de segurança digital?'] },
    desp: { h: 'Domine seu orçamento com o Lumi', b: [['p', 'O nosso **controle inteligente de despesas** foi desenhado para organizar sua vida financeira automaticamente. Ele categoriza seus gastos em tempo real, permitindo que você visualize exatamente para onde seu dinheiro está indo, seja com lazer, moradia ou assinaturas.'], ['ul', [['Categorização Automática', 'O sistema identifica seus gastos e os agrupa por temas.'], ['Alertas de Limite', 'Você define metas para cada categoria e recebe um aviso ao chegar perto de excedê-la.'], ['Gráficos de Evolução', 'Acompanhe o comportamento dos seus gastos mês a mês através de gradientes claros.']]], ['c', 'Dica Lumi', 'Tente definir uma meta de gastos para a categoria ‘Delivery’. Ver o quanto você economiza ao cozinhar em casa é o primeiro passo para o sucesso financeiro.'], ['p', 'Para explorar todas essas ferramentas, incluindo nosso simulador de economia, acesse a nossa página dedicada: {r}.']], k: ['Como configurar metas de gasto?', 'O que é o simulador de economia?', 'Como funcionam as conquistas no Lumi?'] },
    dolar: { h: 'Acompanhando o Dólar no Lumi', b: [['p', 'Olá! A cotação do dólar oscila constantemente ao longo do dia devido a diversos fatores econômicos. Como sou um assistente, não apresento valores em tempo real para evitar desatualizações, mas você pode conferir a cotação oficial e a análise detalhada dos indicadores econômicos diretamente no nosso ecossistema.'], ['c', 'Dica Lumi', 'O monitoramento de indicadores como o dólar, Selic e CDI é fundamental para entender o cenário do seu patrimônio e ajustar seus investimentos.'], ['p', 'Para acessar esses dados e usar nossas ferramentas inteligentes, visite a nossa central de indicadores e simuladores:'], ['ul', [['', '{r}']]], ['p', 'Além de ver a cotação, você pode usar nossa calculadora para simular como a variação cambial impacta suas metas de longo prazo.']], k: ['Como funcionam os investimentos em dólar?', 'Onde vejo a rentabilidade da minha reserva?', 'Como a Selic afeta minha conta?'] },
    selic: { h: 'Entendendo o Impacto da Selic', b: [['p', 'A **Taxa Selic** é a taxa básica de juros da economia brasileira. Ela funciona como uma bússola para o mercado financeiro e afeta diretamente o seu bolso:'], ['ul', [['Rendimentos', 'Quando a Selic sobe, investimentos de renda fixa (como a sua conta remunerada ou CDBs atrelados ao CDI) tendem a render mais.'], ['Custo do crédito', 'Se a taxa está alta, empréstimos e financiamentos ficam mais caros, pois o custo do dinheiro aumenta para os bancos.'], ['Consumo', 'Juros altos ajudam a controlar a inflação, desestimulando o consumo imediato e favorecendo a poupança.']]], ['c', 'Exemplo prático', 'Se você mantém uma reserva de emergência em um produto atrelado ao CDI, um aumento na Selic fará com que o valor do seu saldo cresça um pouco mais rápido a cada mês.'], ['p', 'Para simular como essas mudanças afetam seus objetivos específicos, acesse nossa calculadora no link abaixo:'], ['p', '{r}']], k: ['A inflação afeta meus investimentos?', 'Onde encontro a reserva de emergência no app?', 'Como simular meus rendimentos mensais?'] },
    pix: { h: 'Pix sem mistério', b: [['p', 'O **Pix** é o sistema de pagamentos instantâneos do Banco Central: a transferência cai em poucos segundos, a qualquer hora, inclusive em feriados.'], ['ul', [['Chaves', 'Use CPF, e-mail, celular ou chave aleatória para receber.'], ['QR Code', 'Pague ou cobre lendo ou gerando um código.'], ['Limites', 'Defina limites diários e noturnos para aumentar a segurança.'], ['Comprovante', 'Guarde-o: ele mostra o status e os dados da transação.']]], ['c', 'Exemplo prático', 'Ao pagar uma conta por QR Code, confira o nome do recebedor e o valor na tela antes de confirmar. Depois de enviado, o Pix é imediato e, em geral, não pode ser desfeito.'], ['p', 'Lembre-se: eu explico como o Pix funciona, mas não executo transferências nem altero limites.']], k: ['Como definir limite do Pix?', 'O que fazer se fiz um Pix para a pessoa errada?', 'Como identificar um golpe?'] },
    org: { h: 'Organize sua órbita financeira', b: [['p', 'Um bom começo é enxergar para onde o dinheiro vai e dar um objetivo a cada real:'], ['ul', [['Registre', 'Anote receitas e despesas por alguns dias.'], ['Categorize', 'Separe gastos **essenciais**, lazer e metas.'], ['Reserve', 'Guarde primeiro uma parte fixa do que recebe.'], ['Revise', 'Uma vez por mês, compare o planejado com o realizado e ajuste.']]], ['c', 'Exemplo prático', 'Se você recebe R$ 3.000, separar 10% (**R$ 300**) logo no início do mês forma uma reserva de R$ 3.600 em um ano.'], ['p', 'Conheça as ferramentas que ajudam nisso em {r}.']], k: ['Como funciona controle de despesas no Lumi?', 'Como definir metas de gasto?', 'Quero aprender sobre investimentos.'] },
    func: { h: 'O que o Lumi oferece', b: [['p', 'O ecossistema Lumi reúne ferramentas para você entender e melhorar sua vida financeira:'], ['ul', [['Dashboard e controle de despesas', 'Gastos por categoria, evolução mensal e comparações.'], ['Simulador de economia', 'Veja quanto uma despesa cancelada vira em 1, 5 e 10 anos.'], ['Metas e sonhos', 'Objetivos com prazo, aporte mensal e progresso.'], ['Calculadora e indicadores', 'Juros compostos, Selic, CDI, IPCA e dólar explicados de forma simples.'], ['Jogos, perfil e conquistas', 'Educação financeira com missões e níveis.']]], ['c', 'Dica Lumi', 'Comece pelo controle de despesas: saber para onde o dinheiro vai é a base de qualquer plano.'], ['p', 'Veja todos os detalhes em {r}.']], k: ['Como funciona controle de despesas no Lumi?', 'O que é o simulador de economia?', 'Como funcionam as conquistas no Lumi?'] },
    inv: { h: 'Primeiros passos nos investimentos', b: [['p', 'Investir é fazer o dinheiro trabalhar por você. Antes de começar, vale entender três ideias:'], ['ul', [['Objetivo', 'Defina prazo e meta para cada valor.'], ['Risco e retorno', 'Quanto maior o potencial de ganho, maior costuma ser a oscilação.'], ['Diversificação', 'Distribuir o dinheiro reduz o impacto de imprevistos.']]], ['c', 'Exemplo prático', 'Aportar **R$ 200 por mês** com juros compostos rende mais do que o total depositado ao longo dos anos. Quanto mais cedo começar, maior o efeito.'], ['p', 'Antes de tudo, monte a reserva de emergência em um produto com liquidez diária. Para simular aportes e juros compostos, acesse {r}.']], k: ['Como a Selic afeta minha conta?', 'Como funcionam os investimentos em dólar?', 'Como simular meus rendimentos mensais?'] },
    x: { h: 'Meu foco é finanças e o Lumi', b: [['p', 'Posso ajudar com conta, Pix, orçamento, investimentos e segurança. Que tal começar por um destes temas?']], k: ['Como organizar minhas finanças?', 'Como funciona o Pix?', 'Quais funcionalidades o Lumi oferece?'] }
};
const R = [[/clique|link susp/, 'link'], [/golp|fraud/, 'golpe'], [/despesa|gasto/, 'desp'], [/dolar|cotac/, 'dolar'], [/selic|juros/, 'selic'], [/pix/, 'pix'], [/organiz|financas|orcament/, 'org'], [/funcionalidade|oferece|recurso/, 'func'], [/invest|aprender/, 'inv']];
const ans = q => { q = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); for (const [r, k] of R)
    if (r.test(q))
        return K[k]; return K.x; };
const md = t => E(t).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, a, u) => `<a href="${u == '/recursos' ? '#recursos' : u}">${a}</a>`).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\{r\}/g, '<a href="#recursos">Recursos Lumi</a>');
let S = { c: [], a: null, th: 'dark' }, busy = null;
try {
    Object.assign(S, JSON.parse(localStorage.getItem('lumi') || '{}'));
}
catch (e) { }
const save = () => { try {
    localStorage.setItem('lumi', JSON.stringify(S));
}
catch (e) { } };
const cur = () => S.c.find(x => x.id == S.a), ago = t => { const m = Math.floor((Date.now() - t) / 6e4); return m < 1 ? 'há instantes' : m < 60 ? `há ${m} min` : `há ${Math.floor(m / 60)} h`; };
const mk = t => { const c = { id: Date.now() + '', title: t, ts: Date.now(), m: [] }; S.c.unshift(c); S.a = c.id; return c; };
function toast(t) { const o = $('#ts'); o.innerHTML = ic('check', '') + t; o.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => o.classList.remove('on'), 2200); }
function botH(d, i) { return `<div class="b">${orb(30)}<div class="bb"><div class="bc"><h3>${d.h}</h3>${d.b.map(x => x[0] == 'p' ? `<p>${md(x[1])}</p>` : x[0] == 'ul' ? `<ul>${x[1].map(y => `<li>${y[0] ? `<strong>${y[0]}:</strong> ` : ''}${md(y[1])}</li>`).join('')}</ul>` : `<div class="cl"><em>${ic('spark')}Saiba mais</em>${x[1] ? `<strong>${x[1]}:</strong> ` : ''}${md(x[2])}</div>`).join('')}</div><div class="ck">${(d.k || []).map(k => `<button class="cc" data-q="${E(k)}">${E(k)}${ic('chev')}</button>`).join('')}</div><div class="ac"><button data-cp="1">${ic('copy')}Copiar</button><button data-f aria-label="Gostei">${ic('tu')}</button><button data-f aria-label="Não gostei">${ic('td')}</button></div></div></div>`; }
function render() {
    const r = document.documentElement;
    r.dataset.theme = S.th;
    const c = cur();
    $('#br').innerHTML = orb(34, 1) + '<div><div class="bt">Lumi Guide</div><div class="bs">Lumi Bank</div></div>';
    $('#nw').innerHTML = ic('plus') + 'Nova conversa';
    $('#lr').innerHTML = ic('book') + 'Recursos Lumi';
    $('#lh').innerHTML = ic('buoy') + 'Atendimento humano';
    $('#lc').innerHTML = ic('trash') + 'Limpar histórico';
    $('#tl').innerHTML = ic(S.th == 'dark' ? 'sun' : 'moon') + (S.th == 'dark' ? 'Tema claro' : 'Tema escuro');
    $('#inf').innerHTML = `<i>${ic('spark')}</i><span>Acesso livre, sem login. Seu histórico fica salvo neste navegador.</span>`;
    $('#dm').innerHTML = ic('spark') + 'Ambiente demonstrativo';
    $('#sg').innerHTML = ic('spark');
    $('#sd').innerHTML = ic('up', '');
    $('#list').innerHTML = S.c.length ? '<p class="lab">HOJE</p>' + S.c.map(x => `<div class="it${x.id == S.a ? ' on' : ''}" data-id="${x.id}" role="button" tabindex="0"><b>${E(x.title)}</b><small>${E(x.last || x.title)} · ${ago(x.ts)}</small><button class="mo" data-m="${x.id}" aria-label="Opções">${ic('more')}</button></div>`).join('') : '<p class="empty">Nenhuma conversa ainda.<br>Sua primeira pergunta começa aqui.</p>';
    $('#hd').innerHTML = `<button class="mb" data-a="menu" aria-label="Menu">${orb(34, 1)}</button><div class="t"><p class="n">${c ? E(c.title) : 'Lumi Guide'}</p><p class="s"><b>●</b> Assistente financeiro · online</p></div><button class="mb" data-a="new" aria-label="Nova conversa">${ic('plus')}</button><button class="pill" data-a="human">${ic('buoy')}<span>Atendimento humano</span></button>`;
    $('#view').innerHTML = !c ? `<div class="wl"><div class="fl"><span class="pr"></span>${orb(84)}</div><h1>Olá! Eu sou o Lumi Guide ✨</h1><p>Seu guia inteligente. Como posso iluminar sua jornada financeira hoje?</p><div class="sg">${SUG.map(s => `<button class="sb" data-q="${E(s[1])}"><span class="ch">${ic(s[0])}</span><span>${s[1]}</span>${ic('chev', 'cv')}</button>`).join('')}</div><a class="ex" href="#recursos">${ic('book')}Explorar as funcionalidades do Lumi</a></div>`
        : `<div class="wrap">${c.m.map(m => m.r == 'u' ? `<div class="u"><div class="ub">${E(m.t)}</div><button class="cp" data-uc aria-label="Copiar">${ic('copy')}</button></div>` : botH(m.d)).join('')}${busy == c.id ? `<div class="ty">${orb(30)}<div class="tb"><i></i><i></i><i></i>Lumi Guide está digitando…</div></div>` : ''}</div>`;
}
function scr(m) { const s = $('#sc'); if (m == 'b') {
    const b = [...document.querySelectorAll('.b')].pop();
    b ? b.scrollIntoView({ behavior: 'smooth', block: 'start' }) : 0;
}
else
    s.scrollTo({ top: s.scrollHeight }); }
const LAB = /^\*\*(.+?):?\*\*:?\s*(.*)$/;
function parse(a, fu) {
    const L = a.split('\n'), b = [];
    let h = 'Lumi Guide', p = [], u = null, q = null;
    const fp = () => { if (p.length) {
        b.push(['p', p.join(' ')]);
        p = [];
    } }, fu2 = () => { if (u) {
        b.push(['ul', u]);
        u = null;
    } }, fq = () => { if (q) {
        const m = q.join(' ').match(LAB);
        b.push(['c', m ? E(m[1]) : '', m ? m[2] : q.join(' ')]);
        q = null;
    } };
    for (const raw of L) {
        const l = raw.trim();
        let m;
        if (m = l.match(/^#{1,4}\s+(.*)/)) {
            fp();
            fu2();
            fq();
            h = E(m[1].replace(/\*\*/g, ''));
        }
        else if (m = l.match(/^(?:[-*]|\d+\.)\s+(.*)/)) {
            fp();
            fq();
            (u = u || []).push((x => x ? [E(x[1]), x[2]] : ['', m[1]])(m[1].match(LAB)));
        }
        else if (m = l.match(/^>\s?(.*)/)) {
            fp();
            fu2();
            (q = q || []).push(m[1]);
        }
        else if (!l) {
            fp();
            fu2();
            fq();
        }
        else {
            fu2();
            fq();
            p.push(l);
        }
    }
    fp();
    fu2();
    fq();
    return { h, b, k: fu || [] };
}
const hist = c => c.m.map(m => m.r == 'u' ? { role: 'user', content: m.t } : { role: 'assistant', content: m.raw || m.d.h }).slice(-20);
async function reply(c, t) {
    let m;
    const normalized = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const hasOfflineAnswer = R.some(([pattern]) => pattern.test(normalized));
    if (hasOfflineAnswer) {
        m = { r: 'b', d: ans(t) };
    }
    else {
        try {
            const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: hist(c) }) });
            if (!r.ok)
                throw new Error('HTTP ' + r.status);
            const j = await r.json();
            if (!j.answer)
                throw new Error('Resposta vazia');
            m = { r: 'b', raw: j.answer, d: parse(j.answer, j.followups) };
        }
        catch (e) {
            console.error('Falha ao consultar o Lumi Guide:', e);
            m = { r: 'b', d: ans(t) };
        }
    }
    c.m.push(m);
    busy = null;
    save();
    render();
    scr('b');
}
function send(t) {
    t = t.trim();
    if (!t || busy)
        return;
    let c = cur() || mk(t);
    c.m.push({ r: 'u', t });
    c.last = t;
    c.ts = Date.now();
    busy = c.id;
    save();
    render();
    scr();
    $('#side').classList.remove('on');
    reply(c, t);
}
function dlg(h, w) { const o = $('#ov'); o.innerHTML = `<div class="dg" ${w ? `style="width:min(100%,${w}px)"` : ''} role="dialog" aria-modal="true">${h}</div>`; o.classList.add('on'); }
const cl = () => $('#ov').classList.remove('on');
function ren(id) { const c = S.c.find(x => x.id == id); dlg(`<button class="x" data-x aria-label="Fechar">${ic('x')}</button><h2>Renomear conversa</h2><input class="ipt" id="ri" maxlength="60" placeholder="Nome da conversa" value="${E(c.title)}"><div class="btns"><button class="bt2" data-x>Cancelar</button><button class="bt2 bp" id="rs">Salvar</button></div>`); const i = $('#ri'), s = $('#rs'); i.focus(); i.select(); i.oninput = () => s.disabled = !i.value.trim(); const go = () => { if (i.value.trim()) {
    c.title = i.value.trim();
    save();
    cl();
    render();
} }; s.onclick = go; i.onkeydown = e => e.key == 'Enter' && go(); }
function del(id) { const c = S.c.find(x => x.id == id); dlg(`<h2>Excluir esta conversa?</h2><p>As mensagens de “${E(c.title)}” serão removidas do seu histórico.</p><div class="btns"><button class="bt2" data-x>Cancelar</button><button class="bt2 bp" id="ok">Excluir</button></div>`); $('#ok').onclick = () => { S.c = S.c.filter(x => x.id != id); if (S.a == id)
    S.a = null; save(); cl(); render(); }; }
function clr() { dlg(`<h2>Limpar histórico?</h2><p>Todas as conversas serão removidas deste navegador.</p><div class="btns"><button class="bt2" data-x>Cancelar</button><button class="bt2 bp" id="ok">Limpar</button></div>`); $('#ok').onclick = () => { S.c = []; S.a = null; save(); cl(); render(); }; }
function human() {
    dlg(`<button class="x" data-x aria-label="Fechar">${ic('x')}</button><h2>${ic('hp')}Atendimento humano</h2><p>Se preferir falar com uma pessoa da equipe Lumi Bank, escolha um canal abaixo.</p>${[['Chat com especialista', 'Seg a sex, 8h às 20h', 'Fila estimada: 2 minutos'], ['Central de ajuda', 'Artigos e tutoriais do Lumi Bank', 'Respostas imediatas'], ['Denúncia de fraude', 'Canal prioritário 24 horas', 'Atendimento imediato']].map(r => `<div class="ro"><div><b>${r[0]}</b><small>${r[1]}</small></div><span>${r[2]}</span></div>`).join('')}<div class="nt">${ic('shield')}<span>Ambiente demonstrativo: o encaminhamento é registrado apenas nesta conversa e não abre um atendimento real.</span></div><button class="full" id="hs">${ic('hp')}Solicitar atendimento</button>`, 440);
    $('#hs').onclick = e => { const b = e.currentTarget; b.disabled = true; b.innerHTML = ic('check') + 'Solicitação registrada'; setTimeout(() => { cl(); const c = cur() || mk('Atendimento humano'); c.m.push({ r: 'b', d: { h: 'Atendimento humano solicitado', b: [['p', 'Registre sua solicitação nesta conversa com um resumo do que falamos até aqui.'], ['c', '', 'Ambiente demonstrativo: nenhum atendimento real foi aberto. Em caso de suspeita de fraude, priorize os canais oficiais do Lumi Bank.']] } }); save(); render(); scr('b'); }, 1300); };
}
function pop(el, h, up) { const m = $('#mn'), r = el.getBoundingClientRect(); m.innerHTML = h; m.classList.add('on'); const w = m.offsetWidth, hh = m.offsetHeight; m.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left)) + 'px'; m.style.top = (up ? r.top - hh - 8 : r.bottom + 6) + 'px'; }
const hide = () => $('#mn').classList.remove('on');
async function copy(t) { try {
    await navigator.clipboard.writeText(t);
}
catch (e) { } toast('Resposta copiada'); }
document.addEventListener('click', e => {
    const t = e.target.closest('[data-a],[data-q],[data-id],[data-m],[data-cp],[data-uc],[data-f],[data-x],[data-r],[data-mi],a[href="#recursos"]');
    if (e.target.id == 'ov') {
        cl();
        return;
    }
    if (!t || !t.dataset.m && !t.dataset.mi && !t.dataset.a)
        hide();
    if (!t) {
        if (!e.target.closest('#side'))
            $('#side').classList.remove('on');
        return;
    }
    const d = t.dataset;
    if (d.x !== undefined)
        cl();
    else if (d.q) {
        send(d.q);
    }
    else if (d.m) {
        e.stopPropagation();
        const id = d.m;
        pop(t, `<button class="mi" data-mi="r:${id}">${ic('pen')}Renomear</button><button class="mi d" data-mi="d:${id}">${ic('trash')}Excluir</button>`);
    }
    else if (d.mi) {
        hide();
        const [k, id] = d.mi.split(':');
        k == 'r' ? ren(id) : del(id);
    }
    else if (d.id) {
        S.a = d.id;
        render();
        scr();
        $('#side').classList.remove('on');
    }
    else if (d.cp)
        copy(t.closest('.bb').querySelector('.bc').innerText);
    else if (d.uc)
        copy(t.previousElementSibling.textContent);
    else if (d.f !== undefined) {
        const p = t.parentElement;
        [...p.querySelectorAll('[data-f]')].forEach(b => b !== t && b.classList.remove('on'));
        t.classList.toggle('on');
    }
    else if (d.r) {
        location.hash = '';
        route();
        S.a = null;
        send(d.r);
    }
    else if (d.a == 'new') {
        S.a = null;
        render();
        $('#side').classList.remove('on');
        $('#ta').focus();
    }
    else if (d.a == 'menu')
        $('#side').classList.toggle('on');
    else if (d.a == 'th') {
        S.th = S.th == 'dark' ? 'light' : 'dark';
        save();
        render();
    }
    else if (d.a == 'human')
        human();
    else if (d.a == 'clear')
        clr();
    else if (d.a == 'sug') {
        e.stopPropagation();
        pop(t, SUG.map(s => `<button class="mi" data-q="${E(s[1])}">${ic(s[0])}${s[1]}</button>`).join(''), 1);
    }
});
document.addEventListener('keydown', e => { if (e.key == 'Escape') {
    cl();
    hide();
} if (e.key == 'Enter' && e.target.dataset?.id)
    e.target.click(); });
const ta = $('#ta'), sd = $('#sd');
ta.addEventListener('input', () => { ta.style.height = '24px'; ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'; sd.disabled = !ta.value.trim(); });
ta.addEventListener('keydown', e => { if (e.key == 'Enter' && !e.shiftKey) {
    e.preventDefault();
    go();
} });
sd.onclick = go;
function go() { const v = ta.value; if (!v.trim())
    return; ta.value = ''; ta.style.height = '24px'; sd.disabled = true; send(v); }
$('#rec').innerHTML = `<div class="rw"><div class="rh"><a class="bk" href="#" data-x aria-label="Voltar">${ic('back')}</a>${orb(34)}<div><b>Recursos Lumi</b><small>O que o ecossistema Lumi faz por você</small></div></div><h1 class="rt">Conheça cada recurso — e peça ao <span>Lumi Guide</span> para explicar melhor.</h1><div class="rg">${RS.map(r => `<div class="rc"><div class="ch">${ic(r[0])}</div><h3>${r[1]}</h3><p>${r[2]}</p><button class="ask" data-r="Como funciona ${r[1].toLowerCase()} no Lumi?">${ic('msg')}Perguntar ao Guide</button></div>`).join('')}</div><p class="rf">Ambiente demonstrativo · sem movimentação real de valores</p></div>`;
$('#rec').querySelector('.bk').addEventListener('click', e => { e.preventDefault(); location.hash = ''; route(); });
function route() { document.body.dataset.v = location.hash == '#recursos' ? 'rec' : 'chat'; if (location.hash == '#recursos')
    $('#rec').scrollTop = 0; }
addEventListener('hashchange', route);
route();
render();
