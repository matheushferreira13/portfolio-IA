const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
];

const SYSTEM_PROMPT = 'Voce e Matheus Henrique Da Silva Ferreira e esta a responder no proprio portfolio. Escreva sempre em portugues do Brasil, com frases completas, naturais, bem conectadas e com boa fluidez. Nao diga que e um modelo de linguagem, IA generica ou assistente artificial. Responda em primeira pessoa quando falar da carreira do Matheus. Priorize fatos do CONTEXTO RECUPERADO e use o GUIA FACTUAL apenas como apoio, nunca como texto para copiar literalmente. Evite listas, markdown e texto robotico, a menos que o usuario peca links ou uma lista. Monte respostas com inicio, desenvolvimento e fechamento curto, soando como uma conversa real. Quando fizer sentido, cite projeto, stack ou impacto para sustentar a resposta.';

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function tokenize(text = '') {
  return normalizeText(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function joinNaturally(items = []) {
  const list = items.filter(Boolean);
  if (!list.length) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} e ${list[1]}`;
  return `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
}

function createDocument(title, content) {
  return {
    title,
    content: Array.isArray(content) ? content.join(' ') : String(content || '')
  };
}

function buildKnowledgeDocs(base) {
  const docs = [];
  const profile = base.profile || {};
  docs.push(createDocument('Perfil', [profile.name, profile.headline, profile.summary, profile.location].filter(Boolean).join(' | ')));
  docs.push(createDocument('Idiomas', (profile.languages || []).join(', ')));
  docs.push(createDocument('Preferencias de trabalho', (profile.workPreferences || []).join(', ')));
  (base.skills || []).forEach((skill) => docs.push(createDocument(`Skill: ${skill.name || 'Sem nome'}`, `${skill.level || ''} | ${skill.evidence || ''}`)));
  (base.projects || []).forEach((project) => docs.push(createDocument(`Projeto: ${project.name || 'Sem nome'}`, `${project.description || ''} | Objetivo: ${project.objective || ''} | Stack: ${(project.stack || []).join(', ')} | Impacto: ${project.impact || ''} | Repo: ${project.repo || ''}`)));
  (base.experience || []).forEach((experience) => docs.push(createDocument(`Experiencia: ${experience.title || ''}`, `${experience.company || ''} | ${experience.period || ''} | ${experience.description || ''}`)));
  (base.education || []).forEach((education) => docs.push(createDocument(`Formacao: ${education.course || ''}`, `${education.institution || ''} | ${education.status || ''} | ${education.expectedCompletion || ''} | ${education.focus || ''}`)));
  docs.push(createDocument('Diferenciais', (base.differentials || []).join(' | ')));
  docs.push(createDocument('Problemas de negocio', (base.businessProblems || []).join(' | ')));
  docs.push(createDocument('Casos notaveis', Object.values(base.notableCases || {}).join(' | ')));
  return docs.filter((doc) => doc.content.trim().length > 0);
}

function retrieveContext(question, docs, limit = 5) {
  const normalizedQuestion = normalizeText(question);
  const tokens = tokenize(question);

  return docs
    .map((doc) => {
      const normalizedDoc = normalizeText(`${doc.title} ${doc.content}`);
      let score = 0;
      for (const token of tokens) {
        if (normalizedDoc.includes(token)) score += 1;
      }
      if (normalizedQuestion.includes('projeto') && normalizedDoc.includes('projeto')) score += 3;
      if (normalizedQuestion.includes('formacao') && normalizedDoc.includes('formacao')) score += 3;
      if (normalizedQuestion.includes('habilidade') && normalizedDoc.includes('skill')) score += 3;
      if (normalizedQuestion.includes('experiencia') && normalizedDoc.includes('experiencia')) score += 3;
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item, index) => `[Fonte ${index + 1}] ${item.doc.title}: ${item.doc.content}`)
    .join('\n');
}

function recruiterGuide(question, base) {
  const text = normalizeText(question);
  const profile = base.profile || {};
  const differentials = base.differentials || [];
  const problems = base.businessProblems || [];
  const notableCases = base.notableCases || {};
  const education = base.education || [];

  if (text.includes('por que te contratar') || text.includes('por que contratar') || text.includes('porque voce') || text.includes('porque você')) {
    return 'Combinar maturidade de negocio com transicao pratica para front-end e IA, mostrando capacidade de resolver problemas reais de usabilidade, fluxo e eficiencia.';
  }
  if (text.includes('diferencial') || text.includes('diferenciais')) {
    return `Enfatizar diferenciais como ${joinNaturally(differentials.slice(0, 3))}.`;
  }
  if (text.includes('senioridade') || text.includes('nivel') || text.includes('nível')) {
    return `Posicionar como profissional junior com base academica em ${education[0]?.course || 'tecnologia'} e execucao pratica de projetos reais.`;
  }
  if (text.includes('transicao') || text.includes('transição')) {
    return 'Explicar que a migracao faz sentido porque a carreira anterior ja exigia analise, processo e resolucao de problema, agora convertidos em produto digital.';
  }
  if (text.includes('valor') || text.includes('o que voce oferece') || text.includes('o que você oferece')) {
    return `Mostrar que entrega valor em ${joinNaturally(problems.slice(0, 2)).toLowerCase()} e que ja validou isso em ${notableCases.mostConcreteResult || 'projetos reais'}.`;
  }
  if (text.includes('perfil')) {
    return `${profile.summary || 'Profissional em transicao para tecnologia.'} Valorizar maturidade operacional, execucao e evolucao tecnica.`;
  }
  return '';
}

function portfolioGuide(question, base) {
  const text = normalizeText(question);
  const profile = base.profile || {};
  const skills = base.skills || [];
  const projects = base.projects || [];
  const experience = base.experience || [];
  const education = base.education || [];

  if (text.includes('habilidade') || text.includes('tecnologia') || text.includes('stack')) {
    return `Skills principais: ${joinNaturally(skills.slice(0, 6).map((item) => item.name))}.`;
  }
  if (text.includes('formacao') || text.includes('faculdade') || text.includes('curso')) {
    const main = education[0];
    return main ? `Formacao atual: ${main.course} na ${main.institution}, ${main.status}, conclusao prevista em ${main.expectedCompletion}.` : '';
  }
  if (text.includes('experiencia') || text.includes('trajetoria')) {
    const current = experience[0];
    return current ? `Experiencia atual: ${current.title} na ${current.company}, com foco em suporte tecnico, analise e melhoria de processos.` : '';
  }
  if (text.includes('projeto') || text.includes('portfolio')) {
    return `Projetos mais fortes: ${(projects || []).slice(0, 3).map((item) => item.name).join(' | ')}.`;
  }
  if (text.includes('disponibilidade') || text.includes('remoto') || text.includes('hibrido') || text.includes('presencial')) {
    return `Disponibilidade: ${joinNaturally(profile.workPreferences || [])}, baseado em ${profile.location || 'Lavras/MG'}.`;
  }
  return '';
}

function deterministicAnswer(question, base) {
  const text = normalizeText(question);
  const profile = base.profile || {};
  const skills = base.skills || [];
  const projects = base.projects || [];
  const experience = base.experience || [];
  const education = base.education || [];

  if (text.includes('habilidade') || text.includes('tecnologia') || text.includes('stack')) {
    return 'Minhas habilidades principais estão concentradas no desenvolvimento front-end, especialmente com HTML, CSS e JavaScript. Além disso, também tenho base em SQL, Python, Power BI, Xano, n8n e integrações com APIs, o que me permite atuar tanto na interface quanto na conexão com serviços e dados.';
  }
  if (text.includes('formacao') || text.includes('faculdade') || text.includes('curso')) {
    const main = education[0];
    if (!main) return `${profile.summary || 'Estou em transição para tecnologia com foco em desenvolvimento.'}`;
    return `Atualmente curso ${main.course} na ${main.institution}, estou no ${main.status} e tenho previsão de conclusão em ${main.expectedCompletion}. Minha formação tem fortalecido principalmente minha base em ${main.focus}.`;
  }
  if (text.includes('experiencia') || text.includes('trajetoria')) {
    const current = experience[0];
    return `Minha experiência mais recente é como ${current?.title || 'profissional de suporte e gestão'}, com atuação em análise, suporte técnico e melhoria de processos. Antes da transição para tecnologia, construí uma base forte de operação e visão de negócio, o que hoje influencia bastante a forma como desenvolvo soluções.`;
  }
  if (text.includes('projeto') || text.includes('portfolio')) {
    const names = projects.slice(0, 3).map((item) => item.name).filter(Boolean);
    return `Os projetos que mais me representam hoje são ${joinNaturally(names)}. Eles mostram meu foco em front-end, experiência do usuário, responsividade e integração de funcionalidades reais em contextos diferentes.`;
  }
  return `${profile.summary || 'Sou um profissional em transição para tecnologia com foco em desenvolvimento.'} Hoje busco aplicar isso em projetos com mais impacto, especialmente em front-end, integrações e soluções orientadas a experiência do usuário.`;
}

function formatInstruction(question) {
  const text = normalizeText(question);
  const wantsDetails = ['detalhe', 'detalhes', 'explique', 'aprofunde', 'mais sobre', 'me fale mais', 'como funciona', 'conte mais'].some((term) => text.includes(term));
  return {
    instruction: wantsDetails
      ? 'Responda com no maximo 2 paragrafos curtos, detalhando um pouco mais, mas sempre concluindo o raciocinio.'
      : 'Responda com no maximo 2 paragrafos curtos ou 4 frases no total, sempre concluindo a ideia sem deixar a resposta aberta.',
    maxOutputTokens: wantsDetails ? 520 : 260
  };
}

function seemsIncomplete(text = '') {
  const trimmed = String(text).trim();
  if (!trimmed) return true;
  const noEnding = !/[.!?)]$/.test(trimmed);
  const hanging = /(\be\b|\bde\b|\bcom\b|\bpara\b|\bem\b|\bou\b|\bmas\b|\bo\b|\ba\b|\bos\b|\bas\b|\bque\b|\bdo\b|\bda\b)$/i.test(trimmed);
  const shortWord = (trimmed.split(/\s+/).pop() || '').length <= 2;
  const brokenHyphen = /[-–—]\s*$/.test(trimmed);
  const commonCut = /(front-$|alem disso,?$|alem do?$|com foco em?$|minhas habilidades principais se concentram no desenvolvimento$)/i.test(trimmed);
  const shortSentenceWithoutEnding = noEnding && trimmed.split(/\s+/).length < 18;
  return commonCut || shortSentenceWithoutEnding || (noEnding && (hanging || shortWord || brokenHyphen));
}

async function callGemini({ question, history, context, factualGuide, apiKey }) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NAO_CONFIGURADA');
  }

  const { instruction, maxOutputTokens } = formatInstruction(question);
  const contents = [
    ...(history || []).slice(-10).map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }]
    })),
    { role: 'user', parts: [{ text: question }] }
  ];

  const body = {
    systemInstruction: {
      parts: [{ text: `${SYSTEM_PROMPT}\n${instruction}\n\nCONTEXTO RECUPERADO:\n${context}\n\nGUIA FACTUAL:\n${factualGuide || 'Sem guia adicional.'}` }]
    },
    contents,
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens
    }
  };

  let lastError = null;
  for (const endpoint of GEMINI_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Falha Gemini ${response.status}: ${errData?.error?.message || 'Erro sem detalhe'}`);
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map((part) => part?.text || '').join('').trim();
      if (!text) throw new Error('Resposta vazia da IA');
      return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Falha sem detalhe no Gemini');
}

async function completeIfNeeded({ question, partial, history, context, factualGuide, knowledge, apiKey }) {
  const current = String(partial || '').trim();
  if (!seemsIncomplete(current)) {
    return current;
  }

  try {
    const regenerated = await callGemini({
      question: `Responda novamente a pergunta a seguir, agora com a resposta completa, sem cortar no final e sem repetir trechos.\n\nPergunta: ${question}`,
      history,
      context,
      factualGuide,
      apiKey
    });

    const cleaned = String(regenerated || '').trim();
    if (!cleaned) {
      return deterministicAnswer(question, knowledge || {});
    }

    if (cleaned.length > current.length && !seemsIncomplete(cleaned)) {
      return cleaned;
    }

    return deterministicAnswer(question, knowledge || {});
  } catch {
    return deterministicAnswer(question, knowledge || {});
  }
}

function buildFallback(question, context) {
  const lines = String(context || '')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .slice(0, 3)
    .map((line) => line.replace(/^\[Fonte \d+\]\s*/, '').trim());

  if (!lines.length) {
    return 'Estou momentaneamente sem acesso a IA, mas posso compartilhar detalhes sobre projetos, formacao e stack do Matheus se voce reformular a pergunta.';
  }

  return `Estou com limite temporario da API agora, mas aqui vai um resumo com base no portfolio: ${lines.join(' | ')}`;
}

export async function onRequestPost(context) {
  let parsedBody = {};
  let question = '';

  try {
    parsedBody = await context.request.json();
    question = String(parsedBody?.question || '').trim();
    const history = Array.isArray(parsedBody?.history) ? parsedBody.history : [];
    if (!question) {
      return jsonResponse({ error: 'Pergunta obrigatoria.' }, 400);
    }

    const apiKey = context.env.GEMINI_API_KEY;
    const knowledgeUrl = new URL('/assets/data/portfolio-knowledge.json', context.request.url);
    const knowledgeResponse = await fetch(knowledgeUrl.toString(), { cf: { cacheTtl: 300 } });
    const knowledge = knowledgeResponse.ok ? await knowledgeResponse.json() : {};
    const docs = buildKnowledgeDocs(knowledge);
    const contextText = retrieveContext(question, docs, 5);
    const factualGuide = [recruiterGuide(question, knowledge), portfolioGuide(question, knowledge)].filter(Boolean).join('\n');

    let answer = await callGemini({ question, history, context: contextText, factualGuide, apiKey });
    answer = await completeIfNeeded({ question, partial: answer, history, context: contextText, factualGuide, knowledge, apiKey });

    return jsonResponse({ answer, model: 'gemini-2.5-flash', provider: 'Google Gemini' });
  } catch (error) {
    const detail = String(error?.message || '');

    if (detail.includes('GEMINI_API_KEY_NAO_CONFIGURADA')) {
      return jsonResponse({
        error: 'A chave GEMINI_API_KEY nao esta configurada no Cloudflare.',
        fallback: 'Configure a variavel GEMINI_API_KEY em Settings > Environment variables do projeto Pages e faca um novo deploy.'
      }, 503);
    }

    try {
      const knowledgeUrl = new URL('/assets/data/portfolio-knowledge.json', context.request.url);
      const knowledgeResponse = await fetch(knowledgeUrl.toString(), { cf: { cacheTtl: 300 } });
      const knowledge = knowledgeResponse.ok ? await knowledgeResponse.json() : {};
      const docs = buildKnowledgeDocs(knowledge);
      const questionForFallback = question || String(parsedBody?.question || '').trim();
      const contextText = retrieveContext(questionForFallback, docs, 5);

      if (detail.includes('429')) {
        return jsonResponse({ error: 'Limite temporario da API atingido.', fallback: buildFallback(questionForFallback, contextText) }, 429);
      }

      return jsonResponse({ error: 'Erro ao conectar com a IA no backend.', fallback: buildFallback(questionForFallback, contextText) }, 500);
    } catch {
      return jsonResponse({ error: 'Erro ao conectar com a IA no backend.' }, detail.includes('429') ? 429 : 500);
    }
  }
}
