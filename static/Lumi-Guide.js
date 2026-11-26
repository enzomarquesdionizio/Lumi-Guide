(() => {
    'use strict';

    // -----------------------------------------------------------------------
    // 1. Configurações e utilitários
    // -----------------------------------------------------------------------

    // Centraliza limites e tempos usados em diferentes partes da aplicação.
    const CONFIG = Object.freeze({
        STORAGE_KEY: 'lumi',
        CHAT_ENDPOINT: '/api/chat',
        CHAT_TIMEOUT_MS: 30_000,
        MAX_HISTORY_MESSAGES: 20,
        MAX_INPUT_HEIGHT: 180,
        TOAST_DURATION_MS: 2_200,
        HUMAN_REQUEST_DELAY_MS: 1_300,
        CONVERSATION_TITLE_MAX_LENGTH: 60,
    });

    // Mantém em um único lugar os seletores dos elementos exigidos pelo HTML.
    const SELECTORS = Object.freeze({
        brand: '#br',
        newConversation: '#nw',
        resourcesLink: '#lr',
        humanLink: '#lh',
        clearHistoryLink: '#lc',
        themeToggle: '#tl',
        information: '#inf',
        demoLabel: '#dm',
        suggestionsIcon: '#sg',
        sendButton: '#sd',
        conversationList: '#list',
        header: '#hd',
        chatView: '#view',
        scrollContainer: '#sc',
        modalOverlay: '#ov',
        contextMenu: '#mn',
        sidebar: '#side',
        messageInput: '#ta',
        resourcesView: '#rec',
        toast: '#ts',
    });

    // Atalho para consultar elementos no DOM, permitindo também definir um elemento raiz.
    const $ = (selector, root = document) => root.querySelector(selector);

    // Garante que um elemento essencial exista antes de a aplicação utilizá-lo.
    function requireElement(selector) {
        const element = $(selector);

        if (!element) {
            throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
        }

        return element;
    }

    // Converte caracteres especiais em entidades HTML para impedir que texto seja interpretado como marcação.
    function escapeHTML(value) {
        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };

        return String(value ?? '').replace(/[&<>"']/g, character => characters[character]);
    }

    // Padroniza textos para permitir comparações sem diferenciar maiúsculas ou acentos.
    function normalizeText(value) {
        return String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Valida destinos de links antes de inseri-los na interface.
    function sanitizeHref(value) {
        const href = String(value ?? '').trim();

        if (href === '/recursos') {
            return '#recursos';
        }

        // Aceita apenas protocolos conhecidos e caminhos relativos seguros.
        if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
            return href;
        }

        if (/^(#|\/(?!\/))/.test(href)) {
            return href;
        }

        return '#';
    }

    // Converte a pequena sintaxe Markdown utilizada pelo assistente em HTML seguro.
    function renderMarkdown(value) {
        return escapeHTML(value)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
                const safeHref = escapeHTML(sanitizeHref(href));
                return `<a href="${safeHref}">${label}</a>`;
            })
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\{r\}/g, '<a href="#recursos">Recursos Lumi</a>');
    }

    // Reúne os caminhos SVG reutilizados pelos ícones da interface.
    const ICON_PATHS = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    rec: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    spark: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    buoy: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    tu: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    td: '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pen: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    game: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.55-.6-6.58-.69-7.26A4 4 0 0 0 17.32 5z"/>',
    comp: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z"/>',
    orbit: '<circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.94-15.42"/><path d="M13.5 2.1a10 10 0 0 0-9.84 15.42"/>',
    star: '<path d="M11.53 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.91l5.16-.75a2.12 2.12 0 0 0 1.6-1.16z"/>',
    hp: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
    };

    // Gera o SVG correspondente a um ícone cadastrado.
    function icon(name, className = '') {
        const path = ICON_PATHS[name];

        if (!path) {
            return '';
        }

        return `
            <svg
                class="i ${escapeHTML(className)}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >${path}</svg>
        `;
    }

    // Monta o elemento visual do mascote e, opcionalmente, seu indicador de status.
    function mascot(size, showStatus = false) {
        return `
            <span class="orb" style="--s:${Number(size) || 30}px">
                <svg viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="25" r="12.5" fill="url(#of)" />
                    <circle cx="19.6" cy="24" r="2.05" fill="#04121F" opacity=".85" />
                    <circle cx="28.4" cy="24" r="2.05" fill="#04121F" opacity=".85" />
                    <path
                        d="M19 30c1.6 1.4 3.3 2.1 5 2.1s3.4-.7 5-2.1"
                        stroke="#04121F"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        fill="none"
                        opacity=".75"
                    />
                    <path
                        d="M24 2.4l1.45 5.15L30.6 9l-5.15 1.45L24 15.6l-1.45-5.15L17.4 9l5.15-1.45z"
                        fill="#A7F3D0"
                    />
                </svg>
                ${showStatus ? '<i class="dot"></i>' : ''}
            </span>
        `;
    }

    // -----------------------------------------------------------------------
    // 2. Conteúdo estático da aplicação
    // -----------------------------------------------------------------------

    // Perguntas prontas exibidas no iniciar.
    const SUGGESTIONS = [
        { icon: 'wallet', text: 'Como organizar minhas finanças?' },
        { icon: 'rec', text: 'Como funciona o Pix?' },
        { icon: 'shield', text: 'Como identificar um golpe?' },
        { icon: 'spark', text: 'Quais funcionalidades o Lumi oferece?' },
        { icon: 'trend', text: 'Quero aprender sobre investimentos.' },
    ];

    // Catálogo funcionalidades do Lumi.
    const RESOURCES = [
        {
            icon: 'dash',
            title: 'Dashboard financeiro',
            description: 'Análise inteligente de gastos por categoria, com evolução mensal e comparações.',
        },
        {
            icon: 'rec',
            title: 'Controle de despesas',
            description: 'Registre e classifique despesas recorrentes para enxergar para onde o dinheiro vai.',
        },
        {
            icon: 'calc',
            title: 'Simulador de economia',
            description: 'Simule o cancelamento de uma despesa e veja quanto ela vira em 1, 5 e 10 anos.',
        },
        {
            icon: 'target',
            title: 'Metas e sonhos',
            description: 'Planeje objetivos com prazo, aporte mensal e acompanhamento do progresso.',
        },
        {
            icon: 'trend',
            title: 'Calculadora de investimentos',
            description: 'Compare aportes, prazos e taxas para entender o efeito dos juros compostos.',
        },
        {
            icon: 'chart',
            title: 'Indicadores econômicos',
            description: 'Selic, CDI, IPCA e dólar explicados em linguagem simples, com impacto no seu bolso.',
        },
        {
            icon: 'game',
            title: 'Jogos de educação financeira',
            description: 'Desafios rápidos para treinar decisões de orçamento e consumo consciente.',
        },
        {
            icon: 'comp',
            title: 'Personalidade financeira',
            description: 'Um teste que revela seu perfil de comportamento com dinheiro e como evoluir.',
        },
        {
            icon: 'orbit',
            title: 'Perfil Visionário',
            description: 'Jornadas de evolução financeira por objetivo de vida, do primeiro passo ao avançado.',
        },
        {
            icon: 'star',
            title: 'Conquistas e gamificação',
            description: 'Missões, medalhas e níveis que transformam hábitos financeiros em progresso visível.',
        },
    ];

    // Os construtores deixam o formato das respostas consistente e legível.
    // Cria um bloco de parágrafo no formato interno padronizado.
    const paragraph = text => ({ type: 'paragraph', text });

    // Cria uma lista de itens com rótulo e descrição.
    const list = items => ({
        type: 'list',
        items: items.map(([label, text]) => ({ label, text })),
    });

    // Cria um bloco de destaque para dicas e avisos.
    const callout = (label, text) => ({ type: 'callout', label, text });

    // Agrupa título, conteúdo e perguntas relacionadas em uma resposta.
    const answer = (title, blocks, followUps = []) => ({
        h: title,
        b: blocks,
        k: followUps,
    });

    // Respostas locais para assuntos frequentes, disponíveis mesmo sem consultar a API.
    const KNOWLEDGE_BASE = {
        golpe: answer(
            'Proteja sua luz financeira',
            [
                paragraph(
                    'Identificar tentativas de fraude é o primeiro passo para manter sua órbita financeira segura. Fique atento a estes sinais de alerta:'
                ),
                list([
                    ['Urgência excessiva', 'Golpistas tentam te pressionar a tomar decisões rápidas.'],
                    ['Links suspeitos', 'Mensagens que pedem cliques em endereços estranhos via SMS ou e-mail.'],
                    ['Solicitação de dados', 'Nunca compartilhe senhas, tokens ou códigos de autenticação.'],
                    ['Ofertas irreais', 'Promoções muito vantajosas que parecem boas demais para ser verdade.'],
                ]),
                callout(
                    'Dica Lumi',
                    'O Lumi Bank nunca solicita seus dados confidenciais por telefone, redes sociais ou links externos. Se desconfiar de qualquer comunicação, encerre o contato imediatamente e entre em contato conosco pelos canais oficiais dentro do aplicativo.'
                ),
                paragraph(
                    'Caso suspeite de algum golpe, bloqueie seu cartão pelo app, registre um Boletim de Ocorrência e reporte o ocorrido ao nosso time de segurança. Quer aprender mais sobre como se proteger no ambiente digital?'
                ),
            ],
            [
                'O que fazer se eu cliquei em um link suspeito?',
                'Como ativar a autenticação em duas etapas?',
            ]
        ),

        link: answer(
            'Aja com rapidez e segurança',
            [
                paragraph(
                    'Se você clicou em um link suspeito, mantenha a calma, mas aja imediatamente para proteger sua conta e seus dados:'
                ),
                list([
                    ['Desconecte-se', 'Saia da sua conta em todos os dispositivos e feche o navegador ou o aplicativo.'],
                    ['Bloqueie o acesso', 'Acesse o app do Lumi Bank, vá até a seção de cartões e segurança para bloquear temporariamente seus cartões e alterar suas senhas de acesso.'],
                    ['Verifique transações', 'Revise seu extrato em busca de movimentações que você não reconhece.'],
                    ['Reporte o incidente', 'Entre em contato conosco pelos canais oficiais dentro do aplicativo para informar o ocorrido.'],
                    ['Segurança extra', 'Se você inseriu senhas em sites de terceiros, altere essas credenciais imediatamente em outros serviços (e-mail, redes sociais, etc).'],
                ]),
                callout(
                    'Atenção',
                    'Em casos de suspeita de fraude após clicar em um link, é recomendável registrar um Boletim de Ocorrência (BO) digital para se resguardar legalmente.'
                ),
                paragraph(
                    'Lembre-se: eu oriento sobre a prevenção, mas não tenho acesso à sua conta para realizar bloqueios. A agilidade nestes primeiros minutos é fundamental.'
                ),
            ],
            [
                'Como alterar minha senha no app?',
                'Como denunciar uma transação não reconhecida?',
                'Quais as melhores práticas de segurança digital?',
            ]
        ),

        desp: answer(
            'Domine seu orçamento com o Lumi',
            [
                paragraph(
                    'O nosso **controle inteligente de despesas** foi desenhado para organizar sua vida financeira automaticamente. Ele categoriza seus gastos em tempo real, permitindo que você visualize exatamente para onde seu dinheiro está indo, seja com lazer, moradia ou assinaturas.'
                ),
                list([
                    ['Categorização Automática', 'O sistema identifica seus gastos e os agrupa por temas.'],
                    ['Alertas de Limite', 'Você define metas para cada categoria e recebe um aviso ao chegar perto de excedê-la.'],
                    ['Gráficos de Evolução', 'Acompanhe o comportamento dos seus gastos mês a mês através de gradientes claros.'],
                ]),
                callout(
                    'Dica Lumi',
                    'Tente definir uma meta de gastos para a categoria ‘Delivery’. Ver o quanto você economiza ao cozinhar em casa é o primeiro passo para o sucesso financeiro.'
                ),
                paragraph(
                    'Para explorar todas essas ferramentas, incluindo nosso simulador de economia, acesse a nossa página dedicada: {r}.'
                ),
            ],
            [
                'Como configurar metas de gasto?',
                'O que é o simulador de economia?',
                'Como funcionam as conquistas no Lumi?',
            ]
        ),

        dolar: answer(
            'Acompanhando o Dólar no Lumi',
            [
                paragraph(
                    'Olá! A cotação do dólar oscila constantemente ao longo do dia devido a diversos fatores econômicos. Como sou um assistente, não apresento valores em tempo real para evitar desatualizações, mas você pode conferir a cotação oficial e a análise detalhada dos indicadores econômicos diretamente no nosso ecossistema.'
                ),
                callout(
                    'Dica Lumi',
                    'O monitoramento de indicadores como o dólar, Selic e CDI é fundamental para entender o cenário do seu patrimônio e ajustar seus investimentos.'
                ),
                paragraph(
                    'Para acessar esses dados e usar nossas ferramentas inteligentes, visite a nossa central de indicadores e simuladores:'
                ),
                list([['', '{r}']]),
                paragraph(
                    'Além de ver a cotação, você pode usar nossa calculadora para simular como a variação cambial impacta suas metas de longo prazo.'
                ),
            ],
            [
                'Como funcionam os investimentos em dólar?',
                'Onde vejo a rentabilidade da minha reserva?',
                'Como a Selic afeta minha conta?',
            ]
        ),

        selic: answer(
            'Entendendo o Impacto da Selic',
            [
                paragraph(
                    'A **Taxa Selic** é a taxa básica de juros da economia brasileira. Ela funciona como uma bússola para o mercado financeiro e afeta diretamente o seu bolso:'
                ),
                list([
                    ['Rendimentos', 'Quando a Selic sobe, investimentos de renda fixa (como a sua conta remunerada ou CDBs atrelados ao CDI) tendem a render mais.'],
                    ['Custo do crédito', 'Se a taxa está alta, empréstimos e financiamentos ficam mais caros, pois o custo do dinheiro aumenta para os bancos.'],
                    ['Consumo', 'Juros altos ajudam a controlar a inflação, desestimulando o consumo imediato e favorecendo a poupança.'],
                ]),
                callout(
                    'Exemplo prático',
                    'Se você mantém uma reserva de emergência em um produto atrelado ao CDI, um aumento na Selic fará com que o valor do seu saldo cresça um pouco mais rápido a cada mês.'
                ),
                paragraph(
                    'Para simular como essas mudanças afetam seus objetivos específicos, acesse nossa calculadora no link abaixo:'
                ),
                paragraph('{r}'),
            ],
            [
                'A inflação afeta meus investimentos?',
                'Onde encontro a reserva de emergência no app?',
                'Como simular meus rendimentos mensais?',
            ]
        ),

        pix: answer(
            'Pix sem mistério',
            [
                paragraph(
                    'O **Pix** é o sistema de pagamentos instantâneos do Banco Central: a transferência cai em poucos segundos, a qualquer hora, inclusive em feriados.'
                ),
                list([
                    ['Chaves', 'Use CPF, e-mail, celular ou chave aleatória para receber.'],
                    ['QR Code', 'Pague ou cobre lendo ou gerando um código.'],
                    ['Limites', 'Defina limites diários e noturnos para aumentar a segurança.'],
                    ['Comprovante', 'Guarde-o: ele mostra o status e os dados da transação.'],
                ]),
                callout(
                    'Exemplo prático',
                    'Ao pagar uma conta por QR Code, confira o nome do recebedor e o valor na tela antes de confirmar. Depois de enviado, o Pix é imediato e, em geral, não pode ser desfeito.'
                ),
                paragraph(
                    'Lembre-se: eu explico como o Pix funciona, mas não executo transferências nem altero limites.'
                ),
            ],
            [
                'Como definir limite do Pix?',
                'O que fazer se fiz um Pix para a pessoa errada?',
                'Como identificar um golpe?',
            ]
        ),

        org: answer(
            'Organize sua órbita financeira',
            [
                paragraph(
                    'Um bom começo é enxergar para onde o dinheiro vai e dar um objetivo a cada real:'
                ),
                list([
                    ['Registre', 'Anote receitas e despesas por alguns dias.'],
                    ['Categorize', 'Separe gastos **essenciais**, lazer e metas.'],
                    ['Reserve', 'Guarde primeiro uma parte fixa do que recebe.'],
                    ['Revise', 'Uma vez por mês, compare o planejado com o realizado e ajuste.'],
                ]),
                callout(
                    'Exemplo prático',
                    'Se você recebe R$ 3.000, separar 10% (**R$ 300**) logo no início do mês forma uma reserva de R$ 3.600 em um ano.'
                ),
                paragraph('Conheça as ferramentas que ajudam nisso em {r}.'),
            ],
            [
                'Como funciona controle de despesas no Lumi?',
                'Como definir metas de gasto?',
                'Quero aprender sobre investimentos.',
            ]
        ),

        func: answer(
            'O que o Lumi oferece',
            [
                paragraph(
                    'O ecossistema Lumi reúne ferramentas para você entender e melhorar sua vida financeira:'
                ),
                list([
                    ['Dashboard e controle de despesas', 'Gastos por categoria, evolução mensal e comparações.'],
                    ['Simulador de economia', 'Veja quanto uma despesa cancelada vira em 1, 5 e 10 anos.'],
                    ['Metas e sonhos', 'Objetivos com prazo, aporte mensal e progresso.'],
                    ['Calculadora e indicadores', 'Juros compostos, Selic, CDI, IPCA e dólar explicados de forma simples.'],
                    ['Jogos, perfil e conquistas', 'Educação financeira com missões e níveis.'],
                ]),
                callout(
                    'Dica Lumi',
                    'Comece pelo controle de despesas: saber para onde o dinheiro vai é a base de qualquer plano.'
                ),
                paragraph('Veja todos os detalhes em {r}.'),
            ],
            [
                'Como funciona controle de despesas no Lumi?',
                'O que é o simulador de economia?',
                'Como funcionam as conquistas no Lumi?',
            ]
        ),

        inv: answer(
            'Primeiros passos nos investimentos',
            [
                paragraph(
                    'Investir é fazer o dinheiro trabalhar por você. Antes de começar, vale entender três ideias:'
                ),
                list([
                    ['Objetivo', 'Defina prazo e meta para cada valor.'],
                    ['Risco e retorno', 'Quanto maior o potencial de ganho, maior costuma ser a oscilação.'],
                    ['Diversificação', 'Distribuir o dinheiro reduz o impacto de imprevistos.'],
                ]),
                callout(
                    'Exemplo prático',
                    'Aportar **R$ 200 por mês** com juros compostos rende mais do que o total depositado ao longo dos anos. Quanto mais cedo começar, maior o efeito.'
                ),
                paragraph(
                    'Antes de tudo, monte a reserva de emergência em um produto com liquidez diária. Para simular aportes e juros compostos, acesse {r}.'
                ),
            ],
            [
                'Como a Selic afeta minha conta?',
                'Como funcionam os investimentos em dólar?',
                'Como simular meus rendimentos mensais?',
            ]
        ),

        x: answer(
            'Meu foco é finanças e o Lumi',
            [
                paragraph(
                    'Posso ajudar com conta, Pix, orçamento, investimentos e segurança. Que tal começar por um destes temas?'
                ),
            ],
            [
                'Como organizar minhas finanças?',
                'Como funciona o Pix?',
                'Quais funcionalidades o Lumi oferece?',
            ]
        ),
    };

    // Relaciona palavras-chave a respostas locais; a ordem define a prioridade.
    const INTENT_RULES = [
        { pattern: /clique|link susp/, answerKey: 'link' },
        { pattern: /golp|fraud/, answerKey: 'golpe' },
        { pattern: /despesa|gasto/, answerKey: 'desp' },
        { pattern: /dolar|cotac/, answerKey: 'dolar' },
        { pattern: /selic|juros/, answerKey: 'selic' },
        { pattern: /pix/, answerKey: 'pix' },
        { pattern: /organiz|financas|orcament/, answerKey: 'org' },
        { pattern: /funcionalidade|oferece|recurso/, answerKey: 'func' },
        { pattern: /invest|aprender/, answerKey: 'inv' },
    ];

    // -----------------------------------------------------------------------
    // 3. Conversão e compatibilidade dos dados
    // -----------------------------------------------------------------------

    const LABEL_PATTERN = /^\*\*(.+?):?\*\*:?[ \t]*(.*)$/;

    function normalizeContentBlock(block) {

        if (Array.isArray(block)) {
            const [legacyType, firstValue, secondValue] = block;

            if (legacyType === 'p') {
                return { type: 'paragraph', text: String(firstValue ?? '') };
            }

            if (legacyType === 'ul') {
                return {
                    type: 'list',
                    items: (Array.isArray(firstValue) ? firstValue : []).map(item => ({
                        label: String(item?.[0] ?? ''),
                        text: String(item?.[1] ?? ''),
                    })),
                };
            }

            if (legacyType === 'c') {
                return {
                    type: 'callout',
                    label: String(firstValue ?? ''),
                    text: String(secondValue ?? ''),
                };
            }

            return null;
        }

        if (!block || typeof block !== 'object') {
            return null;
        }

        if (block.type === 'paragraph') {
            return { type: 'paragraph', text: String(block.text ?? '') };
        }

        if (block.type === 'list') {
            return {
                type: 'list',
                items: (Array.isArray(block.items) ? block.items : []).map(item => ({
                    label: String(item?.label ?? ''),
                    text: String(item?.text ?? ''),
                })),
            };
        }

        if (block.type === 'callout') {
            return {
                type: 'callout',
                label: String(block.label ?? ''),
                text: String(block.text ?? ''),
            };
        }

        return null;
    }

    // Validação e padronização do conteúdo de uma resposta do assistente.
    function normalizeAnswerData(data) {
        if (!data || typeof data !== 'object') {
            return answer('Lumi Guide', []);
        }

        const blocks = Array.isArray(data.b)
            ? data.b.map(normalizeContentBlock).filter(Boolean)
            : [];

        const followUps = Array.isArray(data.k)
            ? data.k.filter(item => typeof item === 'string').slice(0, 10)
            : [];

        return answer(String(data.h || 'Lumi Guide'), blocks, followUps);
    }

    // Interpreta títulos, parágrafos, listas e citações da resposta em Markdown.
    function parseAssistantResponse(markdown, followUps = []) {
        const lines = String(markdown ?? '').split(/\r?\n/);
        const blocks = [];

        let heading = 'Lumi Guide';
        let paragraphLines = [];
        let listItems = null;
        let quoteLines = null;

        function flushParagraph() {
            if (paragraphLines.length === 0) {
                return;
            }

            blocks.push({
                type: 'paragraph',
                text: paragraphLines.join(' '),
            });
            paragraphLines = [];
        }

        function flushList() {
            if (!listItems) {
                return;
            }

            blocks.push({ type: 'list', items: listItems });
            listItems = null;
        }

        function flushQuote() {
            if (!quoteLines) {
                return;
            }

            const quote = quoteLines.join(' ');
            const match = quote.match(LABEL_PATTERN);

            blocks.push({
                type: 'callout',
                label: match ? match[1] : '',
                text: match ? match[2] : quote,
            });
            quoteLines = null;
        }

        for (const rawLine of lines) {
            const line = rawLine.trim();
            let match;

            if ((match = line.match(/^#{1,4}\s+(.*)/))) {
                flushParagraph();
                flushList();
                flushQuote();
                heading = match[1].replace(/\*\*/g, '');
                continue;
            }

            if ((match = line.match(/^(?:[-*]|\d+\.)\s+(.*)/))) {
                flushParagraph();
                flushQuote();

                const itemMatch = match[1].match(LABEL_PATTERN);
                if (!listItems) {
                    listItems = [];
                }

                listItems.push({
                    label: itemMatch ? itemMatch[1] : '',
                    text: itemMatch ? itemMatch[2] : match[1],
                });
                continue;
            }

            if ((match = line.match(/^>\s?(.*)/))) {
                flushParagraph();
                flushList();

                if (!quoteLines) {
                    quoteLines = [];
                }

                quoteLines.push(match[1]);
                continue;
            }

            if (!line) {
                flushParagraph();
                flushList();
                flushQuote();
                continue;
            }

            flushList();
            flushQuote();
            paragraphLines.push(line);
        }

        flushParagraph();
        flushList();
        flushQuote();

        const safeFollowUps = Array.isArray(followUps)
            ? followUps.filter(item => typeof item === 'string').slice(0, 10)
            : [];

        return answer(heading, blocks, safeFollowUps);
    }

    // Seleciona a resposta local mais adequada às palavras-chave da pergunta.
    function findLocalAnswer(question) {
        const normalizedQuestion = normalizeText(question);
        const matchingRule = INTENT_RULES.find(({ pattern }) => pattern.test(normalizedQuestion));

        return KNOWLEDGE_BASE[matchingRule?.answerKey || 'x'];
    }

    // Verifica se existe uma resposta local para evitar uma chamada desnecessária à API.
    function isLocalAnswerAvailable(question) {
        const normalizedQuestion = normalizeText(question);
        return INTENT_RULES.some(({ pattern }) => pattern.test(normalizedQuestion));
    }

    // -----------------------------------------------------------------------
    // 4. Estado e persistência
    // -----------------------------------------------------------------------

    // Valida uma mensagem recuperada do armazenamento local.
    function normalizeMessage(message) {
        if (!message || typeof message !== 'object') {
            return null;
        }

        if (message.r === 'u' && typeof message.t === 'string') {
            return { r: 'u', t: message.t };
        }

        if (message.r === 'b') {
            const rawResponse = typeof message.raw === 'string' ? message.raw : '';
            const normalizedAnswer = message.d
                ? normalizeAnswerData(message.d)
                : parseAssistantResponse(rawResponse);

            return {
                r: 'b',
                ...(rawResponse ? { raw: rawResponse } : {}),
                d: normalizedAnswer,
            };
        }

        return null;
    }

    // Valida e padroniza uma conversa recuperada do armazenamento local.
    function normalizeConversation(conversation) {
        if (!conversation || typeof conversation !== 'object' || conversation.id == null) {
            return null;
        }

        const messages = Array.isArray(conversation.m)
            ? conversation.m.map(normalizeMessage).filter(Boolean)
            : [];

        const timestamp = Number(conversation.ts);

        return {
            id: String(conversation.id),
            title: String(conversation.title || 'Nova conversa'),
            last: String(conversation.last || conversation.title || 'Nova conversa'),
            ts: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : Date.now(),
            m: messages,
        };
    }

    // Recupera o estado salvo e aplica valores padrão quando os dados são inválidos.
    function loadState() {
        const initialState = {
            conversations: [],
            activeConversationId: null,
            theme: 'dark',
        };

        try {
            const savedValue = localStorage.getItem(CONFIG.STORAGE_KEY);

            if (!savedValue) {
                return initialState;
            }

            const savedState = JSON.parse(savedValue);
            if (!savedState || typeof savedState !== 'object') {
                return initialState;
            }

            const conversations = Array.isArray(savedState.c)
                ? savedState.c.map(normalizeConversation).filter(Boolean)
                : [];

            const activeId = savedState.a == null ? null : String(savedState.a);
            const activeConversationExists = conversations.some(item => item.id === activeId);

            return {
                conversations,
                activeConversationId: activeConversationExists ? activeId : null,
                theme: savedState.th === 'light' ? 'light' : 'dark',
            };
        } catch (error) {
            console.warn('Não foi possível carregar o histórico local do Lumi:', error);
            return initialState;
        }
    }

    // Estado em memória da aplicação, inicializado com os dados persistidos.
    let state = loadState();
    // Impede envios simultâneos e identifica a conversa que aguarda resposta.
    let pendingConversationId = null;
    // Guarda o temporizador para que notificações anteriores sejam substituídas.
    let toastTimeoutId = null;
    // Referências aos elementos do DOM, preenchidas durante a inicialização.
    let elements = null;

    // Persiste conversas e tema usando as chaves legadas para manter compatibilidade.
    function saveState() {
        try {
            // Mantém os nomes antigos das propriedades para compatibilidade dos dados salvos.
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                c: state.conversations,
                a: state.activeConversationId,
                th: state.theme,
            }));
        } catch (error) {
            console.warn('Não foi possível salvar o histórico local do Lumi:', error);
        }
    }

    // Retorna a conversa selecionada ou null quando nenhuma está ativa.
    function getActiveConversation() {
        return state.conversations.find(
            conversation => conversation.id === state.activeConversationId
        ) || null;
    }

    // Localiza uma conversa pelo identificador.
    function findConversation(conversationId) {
        return state.conversations.find(
            conversation => conversation.id === String(conversationId)
        ) || null;
    }

    // Identificador único para uma nova conversa.
    function createConversationId() {
        if (globalThis.crypto?.randomUUID) {
            return globalThis.crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function createConversation(title) {
        const conversation = {
            id: createConversationId(),
            title: String(title || 'Nova conversa').slice(0, CONFIG.CONVERSATION_TITLE_MAX_LENGTH),
            last: String(title || 'Nova conversa'),
            ts: Date.now(),
            m: [],
        };

        state.conversations.unshift(conversation);
        state.activeConversationId = conversation.id;

        return conversation;
    }

    // Horário da conversa.
    function formatRelativeTime(timestamp) {
        const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));

        if (elapsedMinutes < 1) {
            return 'há instantes';
        }

        if (elapsedMinutes < 60) {
            return `há ${elapsedMinutes} min`;
        }

        const elapsedHours = Math.floor(elapsedMinutes / 60);
        if (elapsedHours < 24) {
            return `há ${elapsedHours} h`;
        }

        const elapsedDays = Math.floor(elapsedHours / 24);
        return elapsedDays === 1 ? 'há 1 dia' : `há ${elapsedDays} dias`;
    }

    // -----------------------------------------------------------------------
    // 5. Renderização da interface
    // -----------------------------------------------------------------------

    // Botões com perguntas sugeridas na tela inicial.
    function renderSuggestionButtons() {
        return SUGGESTIONS.map(suggestion => `
            <button class="sb" data-q="${escapeHTML(suggestion.text)}">
                <span class="ch">${icon(suggestion.icon)}</span>
                <span>${escapeHTML(suggestion.text)}</span>
                ${icon('chev', 'cv')}
            </button>
        `).join('');
    }

    function renderWelcomeView() {
        return `
            <div class="wl">
                <div class="fl">
                    <span class="pr"></span>
                    ${mascot(84)}
                </div>
                <h1>Olá! Eu sou o Lumi Guide ✨</h1>
                <p>Seu guia inteligente. Como posso iluminar sua jornada financeira hoje?</p>
                <div class="sg">${renderSuggestionButtons()}</div>
                <a class="ex" href="#recursos">
                    ${icon('book')}
                    Explorar as funcionalidades do Lumi
                </a>
            </div>
        `;
    }

    function renderContentBlock(block) {
        switch (block.type) {
            case 'paragraph':
                return `<p>${renderMarkdown(block.text)}</p>`;

            case 'list':
                return `
                    <ul>
                        ${block.items.map(item => `
                            <li>
                                ${item.label ? `<strong>${escapeHTML(item.label)}:</strong> ` : ''}
                                ${renderMarkdown(item.text)}
                            </li>
                        `).join('')}
                    </ul>
                `;

            case 'callout':
                return `
                    <div class="cl">
                        <em>${icon('spark')}Saiba mais</em>
                        ${block.label ? `<strong>${escapeHTML(block.label)}:</strong> ` : ''}
                        ${renderMarkdown(block.text)}
                    </div>
                `;

            default:
                return '';
        }
    }

    // Mensagem do assistente, incluindo conteúdo, sugestões e feedback.
    function renderAssistantMessage(data) {
        const normalizedData = normalizeAnswerData(data);

        return `
            <div class="b">
                ${mascot(30)}
                <div class="bb">
                    <div class="bc">
                        <h3>${escapeHTML(normalizedData.h)}</h3>
                        ${normalizedData.b.map(renderContentBlock).join('')}
                    </div>

                    <div class="ck">
                        ${normalizedData.k.map(question => `
                            <button class="cc" data-q="${escapeHTML(question)}">
                                ${escapeHTML(question)}${icon('chev')}
                            </button>
                        `).join('')}
                    </div>

                    <div class="ac">
                        <button data-cp="1">${icon('copy')}Copiar</button>
                        <button data-f aria-label="Gostei">${icon('tu')}</button>
                        <button data-f aria-label="Não gostei">${icon('td')}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderConversationMessage(message) {
        if (message.r === 'u') {
            return `
                <div class="u">
                    <div class="ub">${escapeHTML(message.t)}</div>
                    <button class="cp" data-uc aria-label="Copiar">${icon('copy')}</button>
                </div>
            `;
        }

        return renderAssistantMessage(message.d);
    }

    function renderConversationList() {
        if (state.conversations.length === 0) {
            return `
                <p class="empty">
                    Nenhuma conversa ainda.<br>
                    Sua primeira pergunta começa aqui.
                </p>
            `;
        }

        return `
            <p class="lab">HOJE</p>
            ${state.conversations.map(conversation => `
                <div
                    class="it${conversation.id === state.activeConversationId ? ' on' : ''}"
                    data-id="${escapeHTML(conversation.id)}"
                    role="button"
                    tabindex="0"
                >
                    <b>${escapeHTML(conversation.title)}</b>
                    <small>
                        ${escapeHTML(conversation.last || conversation.title)}
                        · ${formatRelativeTime(conversation.ts)}
                    </small>
                    <button
                        class="mo"
                        data-m="${escapeHTML(conversation.id)}"
                        aria-label="Opções"
                    >${icon('more')}</button>
                </div>
            `).join('')}
        `;
    }

    function renderHeader(conversation) {
        return `
            <button class="mb" data-a="menu" aria-label="Menu">
                ${mascot(34, true)}
            </button>
            <div class="t">
                <p class="n">${conversation ? escapeHTML(conversation.title) : 'Lumi Guide'}</p>
                <p class="s"><b>●</b> Assistente financeiro · online</p>
            </div>
            <button class="mb" data-a="new" aria-label="Nova conversa">
                ${icon('plus')}
            </button>
            <button class="pill" data-a="human">
                ${icon('buoy')}
                <span>Atendimento humano</span>
            </button>
        `;
    }

    function renderChatView(conversation) {
        if (!conversation) {
            return renderWelcomeView();
        }

        const messages = conversation.m.map(renderConversationMessage).join('');
        const typingIndicator = pendingConversationId === conversation.id
            ? `
                <div class="ty">
                    ${mascot(30)}
                    <div class="tb"><i></i><i></i><i></i>Lumi Guide está digitando…</div>
                </div>
            `
            : '';

        return `<div class="wrap">${messages}${typingIndicator}</div>`;
    }

    // Atualiza o estado do botão de envio conforme o texto e a requisição pendente.
    function updateSendButton() {
        if (!elements) {
            return;
        }

        elements.sendButton.disabled = !elements.messageInput.value.trim()
            || Boolean(pendingConversationId);
    }

    // Atualiza os componentes da interface.
    function render() {
        const conversation = getActiveConversation();

        document.documentElement.dataset.theme = state.theme;

        elements.brand.innerHTML = `
            ${mascot(34, true)}
            <div>
                <div class="bt">Lumi Guide</div>
                <div class="bs">Lumi Bank</div>
            </div>
        `;
        elements.newConversation.innerHTML = `${icon('plus')}Nova conversa`;
        elements.resourcesLink.innerHTML = `${icon('book')}Recursos Lumi`;
        elements.humanLink.innerHTML = `${icon('buoy')}Atendimento humano`;
        elements.clearHistoryLink.innerHTML = `${icon('trash')}Limpar histórico`;
        elements.themeToggle.innerHTML = `
            ${icon(state.theme === 'dark' ? 'sun' : 'moon')}
            ${state.theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        `;
        elements.information.innerHTML = `
            <i>${icon('spark')}</i>
            <span>Acesso livre, sem login. Seu histórico fica salvo neste navegador.</span>
        `;
        elements.demoLabel.innerHTML = `${icon('spark')}Ambiente demonstrativo`;
        elements.suggestionsIcon.innerHTML = icon('spark');
        elements.conversationList.innerHTML = renderConversationList();
        elements.header.innerHTML = renderHeader(conversation);
        elements.chatView.innerHTML = renderChatView(conversation);

        updateSendButton();
    }

    // Recursos Lumi.
    function renderResources() {
        elements.resourcesView.innerHTML = `
            <div class="rw">
                <div class="rh">
                    <a class="bk" href="#" data-x aria-label="Voltar">
                        ${icon('back')}
                    </a>
                    ${mascot(34)}
                    <div>
                        <b>Recursos Lumi</b>
                        <small>O que o ecossistema Lumi faz por você</small>
                    </div>
                </div>

                <h1 class="rt">
                    Conheça cada recurso — e peça ao
                    <span>Lumi Guide</span> para explicar melhor.
                </h1>

                <div class="rg">
                    ${RESOURCES.map(resource => `
                        <div class="rc">
                            <div class="ch">${icon(resource.icon)}</div>
                            <h3>${escapeHTML(resource.title)}</h3>
                            <p>${escapeHTML(resource.description)}</p>
                            <button
                                class="ask"
                                data-r="Como funciona ${escapeHTML(resource.title.toLowerCase())} no Lumi?"
                            >
                                ${icon('msg')}Perguntar ao Guide
                            </button>
                        </div>
                    `).join('')}
                </div>

                <p class="rf">Ambiente demonstrativo · sem movimentação real de valores</p>
            </div>
        `;
    }

    // Desloca a área de conversa até a última mensagem ou resposta.
    function scrollToLatestMessage(target = 'bottom') {
        if (target === 'assistant') {
            const latestAssistantMessage = [...document.querySelectorAll('.b')].at(-1);

            if (latestAssistantMessage) {
                latestAssistantMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }

            return;
        }

        elements.scrollContainer.scrollTo({
            top: elements.scrollContainer.scrollHeight,
            behavior: 'smooth',
        });
    }

    // -----------------------------------------------------------------------
    // 6. Conversa e comunicação com a API
    // -----------------------------------------------------------------------

    // Prepara o histórico recente no formato esperado pelo endpoint de chat.
    function buildConversationHistory(conversation) {
        return conversation.m
            .map(message => {
                if (message.r === 'u') {
                    return { role: 'user', content: message.t };
                }

                return {
                    role: 'assistant',
                    content: message.raw || message.d.h,
                };
            })
            .slice(-CONFIG.MAX_HISTORY_MESSAGES);
    }

    async function requestAssistantResponse(conversation) {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            CONFIG.CHAT_TIMEOUT_MS
        );

        try {
            const response = await fetch(CONFIG.CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: buildConversationHistory(conversation),
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Falha na API de chat (HTTP ${response.status}).`);
            }

            const payload = await response.json();

            if (!payload || typeof payload.answer !== 'string' || !payload.answer.trim()) {
                throw new Error('A API retornou uma resposta vazia ou inválida.');
            }

            return {
                r: 'b',
                raw: payload.answer,
                d: parseAssistantResponse(payload.answer, payload.followups),
            };
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function generateAssistantMessage(conversation, question) {
        if (isLocalAnswerAvailable(question)) {
            return {
                r: 'b',
                d: findLocalAnswer(question),
            };
        }

        return requestAssistantResponse(conversation);
    }

    async function replyToMessage(conversation, question) {
        let assistantMessage;

        try {
            assistantMessage = await generateAssistantMessage(conversation, question);
        } catch (error) {
            console.error('Falha ao consultar o Lumi Guide:', error);
            assistantMessage = {
                r: 'b',
                d: findLocalAnswer(question),
            };
        }

        if (pendingConversationId !== conversation.id || !findConversation(conversation.id)) {
            return;
        }

        conversation.m.push(assistantMessage);
        pendingConversationId = null;

        saveState();
        render();

        if (state.activeConversationId === conversation.id) {
            scrollToLatestMessage('assistant');
        }
    }

    // Valida a pergunta, registra a mensagem e inicia o processamento da resposta.
    function sendMessage(value) {
        const question = String(value ?? '').trim();

        if (!question || pendingConversationId) {
            return;
        }

        const conversation = getActiveConversation() || createConversation(question);

        conversation.m.push({ r: 'u', t: question });
        conversation.last = question;
        conversation.ts = Date.now();
        pendingConversationId = conversation.id;

        saveState();
        render();
        scrollToLatestMessage();
        elements.sidebar.classList.remove('on');

        void replyToMessage(conversation, question);
    }

    // -----------------------------------------------------------------------
    // 7. Modais, menus, notificações e ações auxiliares
    // -----------------------------------------------------------------------

    // Exibe uma notificação temporária de sucesso ou falha.
    function showToast(message, success = true) {
        if (!elements?.toast) {
            return;
        }

        elements.toast.innerHTML = `${icon(success ? 'check' : 'x')}${escapeHTML(message)}`;
        elements.toast.classList.add('on');

        clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => {
            elements.toast.classList.remove('on');
        }, CONFIG.TOAST_DURATION_MS);
    }

    async function copyText(value) {
        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error('A API de área de transferência não está disponível neste navegador.');
            }

            await navigator.clipboard.writeText(String(value ?? ''));
            showToast('Texto copiado.');
        } catch (error) {
            console.error('Não foi possível copiar o texto:', error);
            showToast('Não foi possível copiar o texto.', false);
        }
    }

    // Abre uma janela modal com o conteúdo fornecido.
    function showModal(content, width) {
        const widthStyle = Number.isFinite(width)
            ? ` style="width:min(100%, ${width}px)"`
            : '';

        elements.modalOverlay.innerHTML = `
            <div class="dg"${widthStyle} role="dialog" aria-modal="true">
                ${content}
            </div>
        `;
        elements.modalOverlay.classList.add('on');
    }

    // Fecha a janela modal atualmente aberta.
    function closeModal() {
        elements.modalOverlay.classList.remove('on');
    }

    // Permite editar o título de uma conversa e salvar a alteração.
    function renameConversation(conversationId) {
        const conversation = findConversation(conversationId);
        if (!conversation) {
            return;
        }

        showModal(`
            <button class="x" data-x aria-label="Fechar">${icon('x')}</button>
            <h2>Renomear conversa</h2>
            <input
                class="ipt"
                id="ri"
                maxlength="${CONFIG.CONVERSATION_TITLE_MAX_LENGTH}"
                placeholder="Nome da conversa"
                value="${escapeHTML(conversation.title)}"
            >
            <div class="btns">
                <button class="bt2" data-x>Cancelar</button>
                <button class="bt2 bp" id="rs">Salvar</button>
            </div>
        `);

        const input = $('#ri', elements.modalOverlay);
        const saveButton = $('#rs', elements.modalOverlay);

        input.focus();
        input.select();
        saveButton.disabled = !input.value.trim();

        input.addEventListener('input', () => {
            saveButton.disabled = !input.value.trim();
        });

        const saveTitle = () => {
            const title = input.value.trim();
            if (!title) {
                return;
            }

            conversation.title = title.slice(0, CONFIG.CONVERSATION_TITLE_MAX_LENGTH);
            saveState();
            closeModal();
            render();
        };

        saveButton.addEventListener('click', saveTitle);
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                saveTitle();
            }
        });
    }

    // Remove uma conversa do histórico.
    function deleteConversation(conversationId) {
        const conversation = findConversation(conversationId);
        if (!conversation) {
            return;
        }

        showModal(`
            <h2>Excluir esta conversa?</h2>
            <p>As mensagens de “${escapeHTML(conversation.title)}” serão removidas do seu histórico.</p>
            <div class="btns">
                <button class="bt2" data-x>Cancelar</button>
                <button class="bt2 bp" id="ok">Excluir</button>
            </div>
        `);

        $('#ok', elements.modalOverlay).addEventListener('click', () => {
            state.conversations = state.conversations.filter(
                item => item.id !== String(conversationId)
            );

            if (state.activeConversationId === String(conversationId)) {
                state.activeConversationId = null;
            }

            if (pendingConversationId === String(conversationId)) {
                pendingConversationId = null;
            }

            saveState();
            closeModal();
            render();
        });
    }

    // Limpa todas as conversa do histórico.
    function clearConversationHistory() {
        showModal(`
            <h2>Limpar histórico?</h2>
            <p>Todas as conversas serão removidas deste navegador.</p>
            <div class="btns">
                <button class="bt2" data-x>Cancelar</button>
                <button class="bt2 bp" id="ok">Limpar</button>
            </div>
        `);

        $('#ok', elements.modalOverlay).addEventListener('click', () => {
            state.conversations = [];
            state.activeConversationId = null;
            pendingConversationId = null;

            saveState();
            closeModal();
            render();
        });
    }

    // canais demonstrativos de atendimento humano.
    function requestHumanSupport() {
        const channels = [
            ['Chat com especialista', 'Seg a sex, 8h às 20h', 'Fila estimada: 2 minutos'],
            ['Central de ajuda', 'Artigos e tutoriais do Lumi Bank', 'Respostas imediatas'],
            ['Denúncia de fraude', 'Canal prioritário 24 horas', 'Atendimento imediato'],
        ];

        showModal(`
            <button class="x" data-x aria-label="Fechar">${icon('x')}</button>
            <h2>${icon('hp')}Atendimento humano</h2>
            <p>Se preferir falar com uma pessoa da equipe Lumi Bank, escolha um canal abaixo.</p>

            ${channels.map(([title, description, status]) => `
                <div class="ro">
                    <div>
                        <b>${escapeHTML(title)}</b>
                        <small>${escapeHTML(description)}</small>
                    </div>
                    <span>${escapeHTML(status)}</span>
                </div>
            `).join('')}

            <div class="nt">
                ${icon('shield')}
                <span>Ambiente demonstrativo: o encaminhamento é registrado apenas nesta conversa e não abre um atendimento real.</span>
            </div>

            <button class="full" id="hs">
                ${icon('hp')}Solicitar atendimento
            </button>
        `, 440);

        $('#hs', elements.modalOverlay).addEventListener('click', event => {
            const button = event.currentTarget;
            button.disabled = true;
            button.innerHTML = `${icon('check')}Solicitação registrada`;

            setTimeout(() => {
                closeModal();

                const conversation = getActiveConversation()
                    || createConversation('Atendimento humano');

                conversation.m.push({
                    r: 'b',
                    d: answer(
                        'Atendimento humano solicitado',
                        [
                            paragraph(
                                'Registre sua solicitação nesta conversa com um resumo do que falamos até aqui.'
                            ),
                            callout(
                                '',
                                'Ambiente demonstrativo: nenhum atendimento real foi aberto. Em caso de suspeita de fraude, priorize os canais oficiais do Lumi Bank.'
                            ),
                        ]
                    ),
                });

                saveState();
                render();
                scrollToLatestMessage('assistant');
            }, CONFIG.HUMAN_REQUEST_DELAY_MS);
        });
    }

    // Posiciona e exibe o menu de ações próximo ao elemento acionador.
    function showContextMenu(anchor, content, openAbove = false) {
        const menu = elements.contextMenu;
        const anchorRect = anchor.getBoundingClientRect();

        menu.innerHTML = content;
        menu.classList.add('on');

        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const horizontalPosition = Math.max(
            8,
            Math.min(window.innerWidth - menuWidth - 8, anchorRect.left)
        );
        const preferredTop = openAbove
            ? anchorRect.top - menuHeight - 8
            : anchorRect.bottom + 6;
        const verticalPosition = Math.max(
            8,
            Math.min(window.innerHeight - menuHeight - 8, preferredTop)
        );

        menu.style.left = `${horizontalPosition}px`;
        menu.style.top = `${verticalPosition}px`;
    }

    // Oculta o menu contextual.
    function hideContextMenu() {
        elements.contextMenu.classList.remove('on');
    }

    // Executa a ação associada ao controle acionado pelo usuário.
    function handleConversationAction(event, target) {
        const { dataset } = target;

        if (dataset.x !== undefined) {
            closeModal();
            return;
        }

        if (dataset.q !== undefined) {
            sendMessage(dataset.q);
            return;
        }

        if (dataset.m) {
            event.stopPropagation();
            const conversationId = dataset.m;

            showContextMenu(target, `
                <button class="mi" data-mi="r:${escapeHTML(conversationId)}">
                    ${icon('pen')}Renomear
                </button>
                <button class="mi d" data-mi="d:${escapeHTML(conversationId)}">
                    ${icon('trash')}Excluir
                </button>
            `);
            return;
        }

        if (dataset.mi) {
            hideContextMenu();
            const [action, conversationId] = dataset.mi.split(':');

            if (action === 'r') {
                renameConversation(conversationId);
            } else if (action === 'd') {
                deleteConversation(conversationId);
            }
            return;
        }

        if (dataset.id) {
            state.activeConversationId = dataset.id;
            saveState();
            render();
            scrollToLatestMessage();
            elements.sidebar.classList.remove('on');
            return;
        }

        if (dataset.cp !== undefined) {
            const messageContent = target.closest('.bb')?.querySelector('.bc');
            if (messageContent) {
                void copyText(messageContent.innerText);
            }
            return;
        }

        if (dataset.uc !== undefined) {
            const userMessage = target.previousElementSibling;
            if (userMessage) {
                void copyText(userMessage.textContent);
            }
            return;
        }

        if (dataset.f !== undefined) {
            const feedbackContainer = target.parentElement;

            feedbackContainer.querySelectorAll('[data-f]').forEach(button => {
                if (button !== target) {
                    button.classList.remove('on');
                }
            });

            target.classList.toggle('on');
            return;
        }

        if (dataset.r) {
            location.hash = '';
            updateRoute();
            state.activeConversationId = null;
            sendMessage(dataset.r);
            return;
        }

        switch (dataset.a) {
            case 'new':
                state.activeConversationId = null;
                render();
                elements.sidebar.classList.remove('on');
                elements.messageInput.focus();
                break;

            case 'menu':
                elements.sidebar.classList.toggle('on');
                break;

            case 'th':
                state.theme = state.theme === 'dark' ? 'light' : 'dark';
                saveState();
                render();
                break;

            case 'human':
                requestHumanSupport();
                break;

            case 'clear':
                clearConversationHistory();
                break;

            case 'sug':
                event.stopPropagation();
                showContextMenu(
                    target,
                    SUGGESTIONS.map(suggestion => `
                        <button class="mi" data-q="${escapeHTML(suggestion.text)}">
                            ${icon(suggestion.icon)}${escapeHTML(suggestion.text)}
                        </button>
                    `).join(''),
                    true
                );
                break;

            default:
                break;
        }
    }

    // Centraliza o tratamento dos cliques usando delegação de eventos.
    function handleDocumentClick(event) {
        const eventTarget = event.target instanceof Element ? event.target : null;

        if (eventTarget?.id === 'ov') {
            closeModal();
            return;
        }

        const target = eventTarget?.closest(
            '[data-a], [data-q], [data-id], [data-m], [data-cp], [data-uc], [data-f], [data-x], [data-r], [data-mi]'
        );

        if (!target || (
            target.dataset.m === undefined
            && target.dataset.mi === undefined
            && target.dataset.a === undefined
        )) {
            hideContextMenu();
        }

        if (!target) {
            if (!eventTarget?.closest('#side')) {
                elements.sidebar.classList.remove('on');
            }
            return;
        }

        handleConversationAction(event, target);
    }

    // Trata atalhos de teclado e acessibilidade dos controles.
    function handleDocumentKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
            hideContextMenu();
            return;
        }

        if (
            (event.key === 'Enter' || event.key === ' ')
            && event.target?.dataset?.id
        ) {
            event.preventDefault();
            event.target.click();
        }
    }

    // Sincroniza a tela visível com a rota indicada no fragmento da URL.
    function updateRoute() {
        const isResourcesPage = location.hash === '#recursos';
        document.body.dataset.v = isResourcesPage ? 'rec' : 'chat';

        if (isResourcesPage) {
            elements.resourcesView.scrollTop = 0;
        }
    }

    // Ajusta a altura do campo de mensagem e atualiza o botão de envio.
    function handleInputChange() {
        elements.messageInput.style.height = '24px';
        elements.messageInput.style.height = `${Math.min(
            elements.messageInput.scrollHeight,
            CONFIG.MAX_INPUT_HEIGHT
        )}px`;

        updateSendButton();
    }

    // Lê o campo de texto, limpa-o e envia a mensagem.
    function submitMessageFromInput() {
        const message = elements.messageInput.value;

        if (!message.trim() || pendingConversationId) {
            return;
        }

        elements.messageInput.value = '';
        elements.messageInput.style.height = '24px';
        updateSendButton();
        sendMessage(message);
    }

    // Registra os eventos globais e os eventos do campo de mensagem.
    function registerEventListeners() {
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('keydown', handleDocumentKeydown);
        window.addEventListener('hashchange', updateRoute);

        elements.messageInput.addEventListener('input', handleInputChange);
        elements.messageInput.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessageFromInput();
            }
        });

        elements.sendButton.addEventListener('click', submitMessageFromInput);
    }

    // Localiza e armazena referências aos elementos usados frequentemente.
    function cacheElements() {
        return Object.fromEntries(
            Object.entries(SELECTORS).map(([key, selector]) => [
                key,
                requireElement(selector),
            ])
        );
    }

    // Prepara os elementos, renderiza as telas e conecta os eventos da aplicação.
    function initializeApp() {
        elements = cacheElements();

        renderResources();
        registerEventListeners();
        updateRoute();
        render();
        updateSendButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
    } else {
        initializeApp();
    }
})();
