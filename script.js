/* ── Theme Toggle ───────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const langBadge = document.querySelector('.lang-badge');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const html = document.documentElement;

const copy = {
  pt: {
    docLang: 'pt-BR',
    title: 'Matheus | Portfólio',
    langBtn: 'Idioma',
    themeBtn: 'Tema',
    nav: ['Sobre', 'Habilidades', 'Projetos', 'Chat IA', 'Contato'],
    heroTitle: 'Olá, eu sou<br /><span class="highlight">Matheus</span>',
    heroSubtitle: 'Portfólio de desenvolvedor',
    heroDesc: 'Pergunte-me qualquer coisa sobre minhas habilidades, projetos e experiência',
    heroCta: 'Começar Conversa',
    skillsTitle: 'Tecnologias & Habilidades',
    skillsSubtitle: 'Ferramentas que domino para criar experiências incríveis',
    dbSkill: 'Banco de Dados',
    projectsTitle: 'Projetos em Destaque',
    projectsSubtitle: 'Projetos reais e acadêmicos desenvolvidos durante minha formação',
    project1Title: 'ArteAfeto - E-commerce de Confeitaria',
    project1Desc: 'Site completo para uma confeitaria artesanal em Lavras/MG. Inclui catálogo de produtos com seletor de sabores e tamanhos, carrinho funcional, integração com WhatsApp para envio de pedidos e painel administrativo. Imagens otimizadas em WebP e deploy via Cloudflare Workers.',
    project2Title: 'Operaflow - Gestão de Serviços e Pedidos',
    project2Desc: 'Aplicação web multi-página para controle de fluxo operacional, com telas dedicadas a serviços, pedidos e painel principal. Projeto em desenvolvimento contínuo, com foco em organização de interface e experiência do usuário.',
    project3Title: 'HDCs Host',
    project3Desc: 'Projeto desenvolvido para treinar HTML e CSS com uma estrutura limpa e objetiva, apresentando servicos de host para estabelecer um primeiro contacto com o cliente e suas alternativas de conexao. A responsividade foi trabalhada para garantir boa experiencia em mobile, tablet e desktop.',
    apiTag: 'Consumo de API',
    responsiveTag: 'Responsivo',
    chatTitle: 'Converse com meu <span>Assistente IA</span>',
    chatSubtitle: 'Pergunte qualquer coisa sobre minha experiência, projetos e habilidades',
    assistantDesc: 'Assistente de portfólio. Responde com contexto real dos meus projetos.',
    online: 'Online',
    welcome: 'Olá! Sou o assistente virtual do Matheus. Posso te contar sobre seus projetos, habilidades e trajetória acadêmica. Como posso te ajudar?',
    suggestionsHint: 'Atalhos de pergunta (opcional): você pode escrever qualquer pergunta no campo abaixo.',
    suggestion1: 'Quais projetos você tem?',
    suggestion2: 'Quais são suas habilidades?',
    suggestion3: 'Qual sua formação?',
    chatPlaceholder: 'Escreva sua pergunta livremente (ex.: experiencia, tecnologias, disponibilidade)',
    chatInputAria: 'Mensagem para o assistente',
    sendAria: 'Enviar',
    chatDisclaimer: 'Este chat utiliza a engine Google Gemini no backend, atualmente priorizando o modelo Gemini 2.5 Flash para respostas contextualizadas e seguras.',
    lightboxClose: 'Fechar visualização',
    contactTitle: 'Vamos Conversar?',
    contactSubtitle: 'Entre em contato e vamos criar algo incrível juntos',
    name: 'Nome',
    namePlaceholder: 'Seu nome',
    email: 'Email',
    message: 'Mensagem',
    messagePlaceholder: 'Descreva seu projeto ou dúvida...',
    submit: 'Enviar Mensagem',
    sent: 'Mensagem enviada! ✓',
    footer: '&copy; 2026 Matheus. Feito com 💜 e IA.',
    typingStates: ['A analisar o contexto', 'A preparar a resposta', 'A validar informacoes'],
    quickNoLimit: 'O chat nao usa mais um limite local de chamadas. O uso agora depende apenas da disponibilidade do backend e da API.',
    resetDone: 'Conversa reiniciada. Podes perguntar novamente.',
    cooldownBase: 'A IA esta temporariamente indisponivel, mas o backend continua ativo e deve normalizar em instantes.',
    cooldownWait: 'A API volta a tentar automaticamente em cerca de',
    cooldownSuffix: 's.',
    reposLabel: 'Repositorios:',
    providerText: 'Este chat utiliza a engine {provider} no backend, atualmente com o modelo {model}, mantendo as chaves fora do navegador.',
    connectError: 'Erro ao conectar com a IA, tente novamente.',
    rateLimit: 'Limite da API atingido no momento.',
    backendRetry: 'O backend vai tentar novamente em instantes.',
    fallbackRetry: 'Se quiser, posso tentar novamente pela IA em seguida.',
    backendDown: 'Nao consegui falar com o backend da IA. Verifica se o servidor Node esta em execucao e abre o site por http://localhost:3000, nao pelo arquivo index.html direto.',
    timeout: 'A IA demorou a responder. Tenta novamente.',
    carouselPrev: 'Imagem anterior',
    carouselNext: 'Proxima imagem',
    carouselDots: 'Selecionar imagem',
    carouselGoTo: 'Ir para imagem'
  },
  en: {
    docLang: 'en',
    title: 'Matheus | Portfolio',
    langBtn: 'Language',
    themeBtn: 'Theme',
    nav: ['About', 'Skills', 'Projects', 'AI Chat', 'Contact'],
    heroTitle: 'Hello, I am<br /><span class="highlight">Matheus</span>',
    heroSubtitle: 'Developer portfolio',
    heroDesc: 'Ask me anything about my skills, projects, and experience',
    heroCta: 'Start Conversation',
    skillsTitle: 'Technologies & Skills',
    skillsSubtitle: 'Tools I master to build remarkable experiences',
    dbSkill: 'Database',
    projectsTitle: 'Featured Projects',
    projectsSubtitle: 'Real and academic projects built throughout my journey',
    project1Title: 'ArteAfeto - Bakery E-commerce',
    project1Desc: 'Complete website for an artisan bakery in Lavras/MG. It includes a product catalog with flavor and size selectors, a functional cart, WhatsApp integration for order placement, and an admin panel. Images are optimized in WebP and deployment is done via Cloudflare Workers.',
    project2Title: 'Operaflow - Service and Order Management',
    project2Desc: 'Multi-page web application for operational flow control, with dedicated screens for services, orders, and the main dashboard. Ongoing project focused on interface organization and user experience.',
    project3Title: 'HDCs Host',
    project3Desc: 'Project developed to practice HTML and CSS with a clean and objective structure, presenting hosting services to establish a first contact with customers and their connection options. Responsiveness was designed to ensure a good experience on mobile, tablet, and desktop.',
    apiTag: 'API Consumption',
    responsiveTag: 'Responsive',
    chatTitle: 'Talk to my <span>AI Assistant</span>',
    chatSubtitle: 'Ask anything about my experience, projects, and skills',
    assistantDesc: 'Portfolio assistant. Answers with real context from my projects.',
    online: 'Online',
    welcome: 'Hello! I am Matheus\' virtual assistant. I can tell you about his projects, skills, and academic background. How can I help?',
    suggestionsHint: 'Question shortcuts (optional): you can type any question in the field below.',
    suggestion1: 'What projects do you have?',
    suggestion2: 'What are your main skills?',
    suggestion3: 'What is your education?',
    chatPlaceholder: 'Type your question freely (e.g. experience, technologies, availability)',
    chatInputAria: 'Message to the assistant',
    sendAria: 'Send',
    chatDisclaimer: 'This chat uses Google Gemini on the backend, currently prioritizing Gemini 2.5 Flash for contextual and secure responses.',
    lightboxClose: 'Close preview',
    contactTitle: 'Let\'s Talk?',
    contactSubtitle: 'Get in touch and let\'s build something amazing together',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    message: 'Message',
    messagePlaceholder: 'Describe your project or question...',
    submit: 'Send Message',
    sent: 'Message sent! ✓',
    footer: '&copy; 2026 Matheus. Built with 💜 and AI.',
    typingStates: ['Analyzing context', 'Preparing answer', 'Validating information'],
    quickNoLimit: 'The chat no longer uses a local call limit. Usage now depends only on backend and API availability.',
    resetDone: 'Conversation reset. You can ask again.',
    cooldownBase: 'AI is temporarily unavailable, but the backend is still online and should recover shortly.',
    cooldownWait: 'The API will retry automatically in about',
    cooldownSuffix: 's.',
    reposLabel: 'Repositories:',
    providerText: 'This chat uses the {provider} engine on the backend, currently with the {model} model, keeping keys out of the browser.',
    connectError: 'Error connecting to AI. Please try again.',
    rateLimit: 'API limit reached at the moment.',
    backendRetry: 'The backend will retry shortly.',
    fallbackRetry: 'If you want, I can try again with AI right away.',
    backendDown: 'I could not reach the AI backend. Make sure the Node server is running and open the site through http://localhost:3000 instead of opening index.html directly.',
    timeout: 'The AI took too long to respond. Please try again.',
    carouselPrev: 'Previous image',
    carouselNext: 'Next image',
    carouselDots: 'Select image',
    carouselGoTo: 'Go to image'
  }
};

let currentLanguage = localStorage.getItem('siteLanguage') === 'en' ? 'en' : 'pt';

function c() {
  return copy[currentLanguage] || copy.pt;
}

function applyLanguage(lang) {
  currentLanguage = lang === 'en' ? 'en' : 'pt';
  localStorage.setItem('siteLanguage', currentLanguage);

  const text = c();
  html.setAttribute('lang', text.docLang);
  document.title = text.title;

  if (langBadge) langBadge.textContent = currentLanguage.toUpperCase();
  if (langToggle) langToggle.setAttribute('title', text.langBtn);
  if (themeToggle) themeToggle.setAttribute('title', text.themeBtn);

  const nav = document.querySelectorAll('.nav-links a');
  nav.forEach((link, index) => {
    if (text.nav[index]) link.textContent = text.nav[index];
  });

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = text.heroTitle;
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) heroSubtitle.textContent = text.heroSubtitle;
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) heroDesc.textContent = text.heroDesc;
  const heroCta = document.querySelector('.hero .btn-primary');
  if (heroCta) heroCta.textContent = text.heroCta;

  const skillsTitle = document.querySelector('#skills .section-header h2');
  if (skillsTitle) skillsTitle.textContent = text.skillsTitle;
  const skillsSubtitle = document.querySelector('#skills .section-header p');
  if (skillsSubtitle) skillsSubtitle.textContent = text.skillsSubtitle;

  const skillLabels = document.querySelectorAll('#skills .skill-card span');
  if (skillLabels[5]) skillLabels[5].textContent = text.dbSkill;

  const projectsTitle = document.querySelector('#projects .section-header h2');
  if (projectsTitle) projectsTitle.textContent = text.projectsTitle;
  const projectsSubtitle = document.querySelector('#projects .section-header p');
  if (projectsSubtitle) projectsSubtitle.textContent = text.projectsSubtitle;

  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards[0]) {
    const title = projectCards[0].querySelector('h3');
    const desc = projectCards[0].querySelector('.project-info p');
    const tags = projectCards[0].querySelectorAll('.project-tags .tag');
    if (title) title.textContent = text.project1Title;
    if (desc) desc.textContent = text.project1Desc;
    if (tags[4]) tags[4].textContent = text.apiTag;
  }

  if (projectCards[1]) {
    const title = projectCards[1].querySelector('h3');
    const desc = projectCards[1].querySelector('.project-info p');
    if (title) title.textContent = text.project2Title;
    if (desc) desc.textContent = text.project2Desc;
  }

  if (projectCards[2]) {
    const title = projectCards[2].querySelector('h3');
    const desc = projectCards[2].querySelector('.project-info p');
    const tags = projectCards[2].querySelectorAll('.project-tags .tag');
    if (title) title.textContent = text.project3Title;
    if (desc) desc.textContent = text.project3Desc;
    if (tags[2]) tags[2].textContent = text.responsiveTag;
  }

  const chatTitle = document.querySelector('#chat .section-header h2');
  if (chatTitle) chatTitle.innerHTML = text.chatTitle;
  const chatSubtitle = document.querySelector('#chat .section-header p');
  if (chatSubtitle) chatSubtitle.textContent = text.chatSubtitle;
  const assistantDesc = document.querySelector('.chat-assistant-meta p');
  if (assistantDesc) assistantDesc.textContent = text.assistantDesc;
  const chatStatus = document.querySelector('.chat-status');
  if (chatStatus) chatStatus.textContent = text.online;

  const chatRows = document.querySelectorAll('.chat-messages .chat-msg');
  if (chatRows.length === 1) {
    const bubble = chatRows[0].querySelector('.chat-bubble');
    if (bubble) bubble.textContent = text.welcome;
  }

  const hint = document.querySelector('.chat-suggestions-hint');
  if (hint) hint.textContent = text.suggestionsHint;
  const suggestions = document.querySelectorAll('.chat-suggestion');
  if (suggestions[0]) suggestions[0].textContent = text.suggestion1;
  if (suggestions[1]) suggestions[1].textContent = text.suggestion2;
  if (suggestions[2]) suggestions[2].textContent = text.suggestion3;

  const input = document.getElementById('chatInput');
  if (input) {
    input.setAttribute('placeholder', text.chatPlaceholder);
    input.setAttribute('aria-label', text.chatInputAria);
  }

  const sendBtn = document.querySelector('.chat-send-btn');
  if (sendBtn) sendBtn.setAttribute('aria-label', text.sendAria);

  const disclaimer = document.querySelector('.chat-disclaimer');
  if (disclaimer && !disclaimer.dataset.dynamicProvider) {
    disclaimer.textContent = text.chatDisclaimer;
  }

  const lightboxClose = document.getElementById('mediaLightboxClose');
  if (lightboxClose) lightboxClose.setAttribute('aria-label', text.lightboxClose);

  const contactTitle = document.querySelector('#contact .section-header h2');
  if (contactTitle) contactTitle.textContent = text.contactTitle;
  const contactSubtitle = document.querySelector('#contact .section-header p');
  if (contactSubtitle) contactSubtitle.textContent = text.contactSubtitle;
  const nameLabel = document.querySelector('label[for="name"]');
  if (nameLabel) nameLabel.textContent = text.name;
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.setAttribute('placeholder', text.namePlaceholder);
  const emailLabel = document.querySelector('label[for="email"]');
  if (emailLabel) emailLabel.textContent = text.email;
  const messageLabel = document.querySelector('label[for="message"]');
  if (messageLabel) messageLabel.textContent = text.message;
  const messageInput = document.getElementById('message');
  if (messageInput) messageInput.setAttribute('placeholder', text.messagePlaceholder);
  const contactBtn = document.querySelector('#contact .btn-primary');
  if (contactBtn) contactBtn.textContent = text.submit;

  const footer = document.querySelector('.footer p');
  if (footer) footer.innerHTML = text.footer;

  document.querySelectorAll('.carousel-btn-prev').forEach((btn) => btn.setAttribute('aria-label', text.carouselPrev));
  document.querySelectorAll('.carousel-btn-next').forEach((btn) => btn.setAttribute('aria-label', text.carouselNext));
  document.querySelectorAll('.carousel-dots').forEach((dots) => dots.setAttribute('aria-label', text.carouselDots));
}

let isDark = html.getAttribute('data-theme') === 'dark';

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  moonIcon.style.display = isDark ? 'block' : 'none';
  sunIcon.style.display  = isDark ? 'none'  : 'block';
});

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLanguage(currentLanguage === 'pt' ? 'en' : 'pt');
  });
}

applyLanguage(currentLanguage);

/* ── Active nav link on scroll ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--purple-light)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── AI Chat ────────────────────────────────────────────────── */
const CHAT_API_ENDPOINT = '/api/chat';

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('input') || document.getElementById('chatInput');
const chatMessages = document.getElementById('messages') || document.getElementById('chatMessages');
const sendButton = document.querySelector('.chat-send-btn');
const chatDisclaimer = document.querySelector('.chat-disclaimer');
const mediaLightbox = document.getElementById('mediaLightbox');
const mediaLightboxContent = document.getElementById('mediaLightboxContent');
const mediaLightboxClose = document.getElementById('mediaLightboxClose');

let cooldownAte = 0;
let ultimoFallbackBackend = '';
const historicoConversa = [];

function criarAvatarBot() {
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar chat-avatar--profile';
  avatar.innerHTML = '<img src="assets/profile.jpg" alt="Matheus profile" loading="lazy" />';
  return avatar;
}

function adicionarMensagem(texto, papel = 'bot') {
  if (!chatMessages) return null;

  const linha = document.createElement('div');
  linha.className = `chat-msg chat-msg--${papel}`;

  if (papel === 'bot') {
    linha.appendChild(criarAvatarBot());
  }

  const bolha = document.createElement('div');
  bolha.className = 'chat-bubble';
  bolha.textContent = texto;
  linha.appendChild(bolha);

  chatMessages.appendChild(linha);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bolha;
}

function iniciarIndicadorDigitacao() {
  const bolha = adicionarMensagem(`${c().typingStates[0]}...`, 'bot');
  if (!bolha) {
    return {
      bolha: null,
      concluir: () => {}
    };
  }

  bolha.classList.add('chat-bubble--typing');
  bolha.setAttribute('aria-live', 'polite');

  const estados = c().typingStates;

  let segundos = 0;
  let indiceEstado = 0;

  const timer = setInterval(() => {
    segundos += 1;
    if (segundos % 3 === 0) {
      indiceEstado = (indiceEstado + 1) % estados.length;
    }

    const pontos = '.'.repeat((segundos % 3) + 1);
    bolha.textContent = `${estados[indiceEstado]}${pontos} ${segundos}s`;

    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 1000);

  return {
    bolha,
    concluir: (textoFinal) => {
      clearInterval(timer);
      bolha.classList.remove('chat-bubble--typing');
      bolha.textContent = textoFinal;
    }
  };
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function respostaRapida(pergunta) {
  const texto = normalizarTexto(pergunta);

  if (texto === '/reset' || texto.includes('limpar conversa') || texto.includes('clear chat')) {
    return '__RESET__';
  }

  if (texto.includes('chamadas restantes') || texto.includes('calls remaining')) {
    return c().quickNoLimit;
  }

  return null;
}

function anexarLinksProjetosSeNecessario(resposta, pergunta) {
  const textoPergunta = normalizarTexto(pergunta);
  const querLinks = textoPergunta.includes('repo') || textoPergunta.includes('repositorio') || textoPergunta.includes('github');
  if (!querLinks || /https?:\/\//i.test(resposta)) {
    return resposta;
  }

  const links = Array.from(document.querySelectorAll('.project-links a'))
    .slice(0, 3)
    .map((link) => `- ${link.closest('.project-card')?.querySelector('h3')?.textContent || 'Projeto'}: ${link.href}`);

  return links.length ? `${resposta}\n\n${c().reposLabel}\n${links.join('\n')}` : resposta;
}

async function chamarIA(perguntaAtual) {
  const response = await fetch(CHAT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question: perguntaAtual,
      history: historicoConversa
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error || 'Falha ao conectar com o backend da IA.');
    error.status = response.status;
    error.fallback = data?.fallback || '';
    throw error;
  }

  if (chatDisclaimer && data?.provider && data?.model) {
    chatDisclaimer.dataset.dynamicProvider = 'true';
    chatDisclaimer.textContent = c().providerText
      .replace('{provider}', data.provider)
      .replace('{model}', data.model);
  }

  return String(data?.answer || '').trim();
}

function abrirMediaLightbox(slide) {
  if (!mediaLightbox || !mediaLightboxContent || !slide) return;

  mediaLightboxContent.innerHTML = '';

  const clone = slide.cloneNode(true);
  clone.classList.remove('project-slide', 'is-active');
  clone.removeAttribute('style');

  if (clone.tagName === 'VIDEO') {
    clone.controls = true;
    clone.muted = false;
    clone.autoplay = true;
    clone.loop = true;
  }

  mediaLightboxContent.appendChild(clone);
  mediaLightbox.classList.add('is-open');
  mediaLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharMediaLightbox() {
  if (!mediaLightbox || !mediaLightboxContent) return;
  const media = mediaLightboxContent.querySelector('video');
  if (media) {
    media.pause();
  }
  mediaLightbox.classList.remove('is-open');
  mediaLightbox.setAttribute('aria-hidden', 'true');
  mediaLightboxContent.innerHTML = '';
  document.body.style.overflow = '';
}

async function enviar() {
  if (!chatInput || !chatMessages) return;

  const pergunta = chatInput.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, 'user');
  chatInput.value = '';

  historicoConversa.push({ role: 'user', content: perguntaAtualizar(pergunta) });

  function perguntaAtualizar(texto) {
    return texto.replace(/\s+/g, ' ').trim();
  }

  const respostaLocal = respostaRapida(pergunta);
  if (respostaLocal) {
    if (respostaLocal === '__RESET__') {
      historicoConversa.length = 0;
      adicionarMensagem(c().resetDone, 'bot');
      return;
    }

    adicionarMensagem(respostaLocal, 'bot');
    historicoConversa.push({ role: 'assistant', content: respostaLocal });
    return;
  }

  if (Date.now() < cooldownAte) {
    const segundosRestantes = Math.ceil((cooldownAte - Date.now()) / 1000);
    const fallbackBase = ultimoFallbackBackend || c().cooldownBase;
    const fallbackCooldown = `${fallbackBase}\n\n${c().cooldownWait} ${segundosRestantes}${c().cooldownSuffix}`;
    adicionarMensagem(fallbackCooldown, 'bot');
    historicoConversa.push({ role: 'assistant', content: fallbackCooldown });
    return;
  }

  const digitacao = iniciarIndicadorDigitacao();

  try {
    const respostaIA = await chamarIA(pergunta);
    const respostaFinal = anexarLinksProjetosSeNecessario(respostaIA, pergunta);

    if (digitacao.bolha) {
      digitacao.concluir(respostaFinal);
    } else {
      adicionarMensagem(respostaFinal, 'bot');
    }

    historicoConversa.push({ role: 'assistant', content: respostaFinal });
  } catch (error) {
    let erroMsg = c().connectError;
    const detalhe = String(error?.message || '');

    if (error?.status === 429) {
      cooldownAte = Date.now() + 60000;
      ultimoFallbackBackend = error.fallback || c().rateLimit;
      erroMsg = `${ultimoFallbackBackend}\n\n${c().backendRetry}`;
    } else if (error?.fallback) {
      ultimoFallbackBackend = error.fallback;
      erroMsg = `${error.fallback}\n\n${c().fallbackRetry}`;
    } else if (detalhe.includes('Failed to fetch') || detalhe.includes('backend da IA') || detalhe.includes('AI backend')) {
      erroMsg = c().backendDown;
    } else if (detalhe.toLowerCase().includes('abort')) {
      erroMsg = c().timeout;
    }

    console.error('Erro Gemini:', error);

    if (digitacao.bolha) {
      digitacao.concluir(erroMsg);
    } else {
      adicionarMensagem(erroMsg, 'bot');
    }

    historicoConversa.push({ role: 'assistant', content: erroMsg });
  } finally {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar();
  });
}

if (sendButton) {
  sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    enviar();
  });
}

window.enviar = enviar;

window.sendSuggestion = (btn) => {
  if (!chatInput || !btn) return;
  chatInput.value = btn.textContent.trim();
  enviar();
};

if (mediaLightboxClose) {
  mediaLightboxClose.addEventListener('click', fecharMediaLightbox);
}

if (mediaLightbox) {
  mediaLightbox.addEventListener('click', (event) => {
    if (event.target === mediaLightbox) {
      fecharMediaLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    fecharMediaLightbox();
  }
});

/* ── Contact form ───────────────────────────────────────────── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.btn-primary');
  btn.textContent = c().sent;
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.textContent = c().submit;
    btn.style.background = '';
    form.reset();
  }, 3000);
});

/* ── Scroll-reveal for cards ────────────────────────────────── */
const revealCards = document.querySelectorAll('.skill-card, .project-card');

const style = document.createElement('style');
style.textContent = `
  .card-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .card-visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

revealCards.forEach(card => card.classList.add('card-hidden'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('card-visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealCards.forEach(card => revealObserver.observe(card));

/* ── Project carousels ─────────────────────────────────────── */
const projectCarousels = document.querySelectorAll('[data-carousel]');

projectCarousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('.project-slide'));
  const prevBtn = carousel.querySelector('.carousel-btn-prev');
  const nextBtn = carousel.querySelector('.carousel-btn-next');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  let current = slides.findIndex((s) => s.classList.contains('is-active'));
  if (current < 0) current = 0;

  function syncActiveMedia() {
    slides.forEach((slide, index) => {
      if (slide.tagName === 'VIDEO') {
        if (index === current) {
          slide.currentTime = slide.currentTime || 0;
          slide.play().catch(() => {});
        } else {
          slide.pause();
          slide.currentTime = 0;
        }
      }
    });
  }

  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    syncActiveMedia();
  } else {
    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${index === current ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `${c().carouselGoTo} ${index + 1}`);
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      syncActiveMedia();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
  }

  syncActiveMedia();

  slides.forEach((slide) => {
    slide.addEventListener('click', () => abrirMediaLightbox(slide));
  });
});
