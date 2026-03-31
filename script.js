/* ── Theme Toggle ───────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const html = document.documentElement;

let isDark = html.getAttribute('data-theme') === 'dark';

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  moonIcon.style.display = isDark ? 'block' : 'none';
  sunIcon.style.display  = isDark ? 'none'  : 'block';
});

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
  avatar.innerHTML = '<img src="assets/profile.jpg" alt="Foto de Matheus" loading="lazy" />';
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
  const bolha = adicionarMensagem('A analisar o contexto...', 'bot');
  if (!bolha) {
    return {
      bolha: null,
      concluir: () => {}
    };
  }

  bolha.classList.add('chat-bubble--typing');
  bolha.setAttribute('aria-live', 'polite');

  const estados = [
    'A analisar o contexto',
    'A preparar a resposta',
    'A validar informacoes'
  ];

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

  if (texto === '/reset' || texto.includes('limpar conversa')) {
    return '__RESET__';
  }

  if (texto.includes('chamadas restantes')) {
    return 'O chat nao usa mais um limite local de chamadas. O uso agora depende apenas da disponibilidade do backend e da API.';
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

  return links.length ? `${resposta}\n\nRepositorios:\n${links.join('\n')}` : resposta;
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
    chatDisclaimer.textContent = `Este chat utiliza a engine ${data.provider} no backend, atualmente com o modelo ${data.model}, mantendo as chaves fora do navegador.`;
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
      adicionarMensagem('Conversa reiniciada. Podes perguntar novamente.', 'bot');
      return;
    }

    adicionarMensagem(respostaLocal, 'bot');
    historicoConversa.push({ role: 'assistant', content: respostaLocal });
    return;
  }

  if (Date.now() < cooldownAte) {
    const segundosRestantes = Math.ceil((cooldownAte - Date.now()) / 1000);
    const fallbackBase = ultimoFallbackBackend || 'A IA esta temporariamente indisponivel, mas o backend continua ativo e deve normalizar em instantes.';
    const fallbackCooldown = `${fallbackBase}\n\nA API volta a tentar automaticamente em cerca de ${segundosRestantes}s.`;
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
    let erroMsg = 'Erro ao conectar com a IA, tente novamente.';
    const detalhe = String(error?.message || '');

    if (error?.status === 429) {
      cooldownAte = Date.now() + 60000;
      ultimoFallbackBackend = error.fallback || 'Limite da API atingido no momento.';
      erroMsg = `${ultimoFallbackBackend}\n\nO backend vai tentar novamente em instantes.`;
    } else if (error?.fallback) {
      ultimoFallbackBackend = error.fallback;
      erroMsg = `${error.fallback}\n\nSe quiser, posso tentar novamente pela IA em seguida.`;
    } else if (detalhe.includes('Failed to fetch') || detalhe.includes('backend da IA')) {
      erroMsg = 'Nao consegui falar com o backend da IA. Verifica se o servidor Node esta em execucao e abre o site por http://localhost:3000, nao pelo arquivo index.html direto.';
    } else if (detalhe.toLowerCase().includes('abort')) {
      erroMsg = 'A IA demorou a responder. Tenta novamente.';
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
  btn.textContent = 'Mensagem enviada! ✓';
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.textContent = 'Enviar Mensagem';
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
      dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
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
