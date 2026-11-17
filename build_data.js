const fs = require('fs');
const path = require('path');

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function resolveOptimizedPath(folder, filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const webpPath = path.join(folder, base + '.webp');
  if (fs.existsSync(webpPath)) {
    return folder.replace(/\\/g, '/') + '/' + base + '.webp';
  }
  const jpgPath = path.join(folder, base + '.jpg');
  if (fs.existsSync(jpgPath)) {
    return folder.replace(/\\/g, '/') + '/' + base + '.jpg';
  }
  return folder.replace(/\\/g, '/') + '/' + filename;
}

// 1. CARROSSEIS
const carrosseisMeta = {
  'CARROSSEL': {
    title: 'Mito ou Verdade — Nutrição & Saúde',
    client: 'Saúde & Performance',
    handle: '@saude.performance',
    type: 'Carrossel Educativo & Vendas',
    software: 'Photoshop • Illustrator',
    colors: ['#10B981', '#065F46', '#090A0F', '#F0FDF4'],
    desc: 'Carrossel com gancho visual disruptivo que quebra mitos comuns e converte leitores em clientes de consultoria.'
  },
  'CARROSSEL DRA. MARI 01': {
    title: 'Dra. Mariana — Procedimentos & Cuidados',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel de Autoridade Médica',
    software: 'Photoshop • Lightroom',
    colors: ['#D946EF', '#86198F', '#090A0F', '#FDF4FF'],
    desc: 'Estratégia visual refinada para dermatologia, gerando desejo em procedimentos faciais e confiança clínica.'
  },
  'CARROSSEL DRA. MARI 02': {
    title: 'Dra. Mariana — Guia de Skincare & Rotina',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel Passo a Passo',
    software: 'Photoshop • Lightroom',
    colors: ['#EC4899', '#9D174D', '#0F172A', '#FFF1F2'],
    desc: 'Guia prático com alta retenção de leitura e salvamentos no Instagram para fidelização de pacientes.'
  },
  'CARROSSEL DRA. MARI 03': {
    title: 'Dra. Mariana — Protocolos Injetáveis',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel de Conscientização',
    software: 'Photoshop • Lightroom',
    colors: ['#C084FC', '#6B21A8', '#090A0F', '#FAF5FF'],
    desc: 'Desmistificação de procedimentos estéticos com tom sóbrio, elegante e alta credibilidade.'
  },
  'CARROSSEL DRA. MARI 04': {
    title: 'Dra. Mariana — Harmonização & Naturalidade',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel Institucional & Casos',
    software: 'Photoshop • Lightroom',
    colors: ['#F472B6', '#831843', '#090A0F', '#FDF2F8'],
    desc: 'Demonstração de resultados refinados focando em naturalidade e sofisticação médica.'
  },
  'CARROSSEL DRA. MARI 05': {
    title: 'Dra. Mariana — Cuidados no Inverno',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel Sazonal',
    software: 'Photoshop • Lightroom',
    colors: ['#38BDF8', '#0369A1', '#090A0F', '#F0F9FF'],
    desc: 'Conteúdo sazonal direcionado que aqueceu o agendamento de consultas na clínica no período frio.'
  },
  'CARROSSEL DRA.MARI 06': {
    title: 'Dra. Mariana — Climatério & Saúde da Mulher',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel Narrativo & Empatia',
    software: 'Photoshop • Lightroom',
    colors: ['#FB7185', '#9F1239', '#090A0F', '#FFF1F2'],
    desc: 'Tema delicado abordado com acolhimento, alta carga de valor emocional e quebra de tabus.'
  },
  'CARROSSEL DRA.MARI 07': {
    title: 'Dra. Mariana — Beleza com Ciência',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Carrossel de Posicionamento',
    software: 'Photoshop • Lightroom',
    colors: ['#E879F9', '#701A75', '#090A0F', '#FDF4FF'],
    desc: 'Fortalecimento da marca pessoal da médica como referência regional e científica.'
  },
  'CARROSSEL IMUNOFOSFO': {
    title: 'Imunofosfo — Estresse & Suplementação',
    client: 'Imunofosfo Labs',
    handle: '@imunofosfo.oficial',
    type: 'Carrossel Nutracêutico & Conversão',
    software: 'Photoshop • Illustrator',
    colors: ['#3B82F6', '#1D4ED8', '#0F172A', '#EFF6FF'],
    desc: 'Design farmacêutico/nutracêutico com linguagem direta focada na dor do cliente e solução do produto.'
  },
  'CARROSSEL SELLER CHAT': {
    title: 'Seller Chat — IA para Automação de Vendas',
    client: 'Seller Chat AI',
    handle: '@sellerchat.ai',
    type: 'Carrossel SaaS & Tech',
    software: 'Photoshop • Figma',
    colors: ['#6366F1', '#4338CA', '#0B0F19', '#EEF2FF'],
    desc: 'Apresentação de benefícios de software inteligente para e-commerce, gerando leads qualificados no B2B.'
  },
  'CARROSSEL SMART GROW - 01': {
    title: 'Smart Grow — Alta Produtividade no Campo',
    client: 'Smart Grow Agrotech',
    handle: '@smartgrow.agrotech',
    type: 'Carrossel Agrotech & Soluções',
    software: 'Photoshop • Illustrator',
    colors: ['#22C55E', '#15803D', '#0B140E', '#F0FDF4'],
    desc: 'Comunicação moderna para o agro contemporâneo, unindo tecnologia de ponta, sustentabilidade e ROI.'
  },
  'CARROSSEL SMART GROW - 02': {
    title: 'Smart Grow — Nutrição Vegetal Avançada',
    client: 'Smart Grow Agrotech',
    handle: '@smartgrow.agrotech',
    type: 'Carrossel Técnico & Comercial',
    software: 'Photoshop • Illustrator',
    colors: ['#84CC16', '#4D7C0F', '#0D1708', '#F7FEE7'],
    desc: 'Explicação visual de formulações e defensivos de biofertilização para produtores de grande escala.'
  },
  'CARROSSEL 01': {
    title: 'Eu Passei Anos Tentando Escolher Uma Profissão',
    client: 'Branding Autoral',
    handle: '@marcos.designer',
    type: 'Storytelling & Branding Pessoal',
    software: 'Photoshop • Illustrator',
    colors: ['#FF6B00', '#7C3AED', '#0F0E17', '#FFF1E8'],
    desc: 'Narrativa autoral de forte conexão emocional e quebra de crenças sobre a percepção de valor no mercado criativo.'
  },
  'CARROSSEL 02': {
    title: 'Desaprendendo a Ser Designer',
    client: 'Branding Autoral',
    handle: '@marcos.designer',
    type: 'Carrossel Reflexivo & Autoral',
    software: 'Photoshop • Procreate',
    colors: ['#A855F7', '#6B21A8', '#0E0719', '#FAF5FF'],
    desc: 'Reflexão estética e filosófica sobre como esquecer fórmulas pré-fabricadas para criar designs autênticos e expressivos.'
  },
  'CARROSSEL 03': {
    title: 'Fazendo Coisas Que Eu Não Sei Fazer',
    client: 'Branding Autoral',
    handle: '@marcos.designer',
    type: 'Storytelling & Ensaio Autoral',
    software: 'Photoshop • Lightroom',
    colors: ['#F59E0B', '#0284C7', '#081726', '#FEF3C7'],
    desc: 'Ensaio visual sobre ousadia criativa, experimentação de novas linguagens e superação de zonas de conforto.'
  },
  'CARROSSEL 04 - 26-10': {
    title: 'A IA Executa. Você Dirige',
    client: 'Inteligência Artificial & Design',
    handle: '@marcos.designer',
    type: 'Tendências & Direção Criativa',
    software: 'Photoshop • Midjourney / AI Studio',
    colors: ['#10B981', '#F59E0B', '#091A14', '#ECFDF5'],
    desc: 'Análise estratégica sobre o papel do designer como diretor de criação na era da inteligência artificial generativa.'
  },
  'CARROSSEL 05 - 28-10': {
    title: 'Aprendendo Muito & Ficando Para Trás',
    client: 'Carreira & Evolução',
    handle: '@marcos.designer',
    type: 'Carrossel de Conexão & Carreira',
    software: 'Photoshop • After Effects',
    colors: ['#EC4899', '#8B5CF6', '#110A1F', '#FDF4FF'],
    desc: 'Abordagem visceral sobre a ansiedade e velocidade do ecossistema criativo moderno com estética cyberpunk impactante.'
  }
};

const carrosseis = fs.readdirSync('Carrosséis', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const p = path.join('Carrosséis', d.name);
    let searchDir = p;
    if (fs.existsSync(path.join(p, 'images'))) {
      searchDir = path.join(p, 'images');
    }
    const files = fs.readdirSync(searchDir)
      .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
      .sort(naturalSort);
    const slides = files.map(f => resolveOptimizedPath(searchDir, f));
    const meta = carrosseisMeta[d.name] || {
      title: d.name,
      client: 'Cliente',
      handle: '@portfolio',
      type: 'Carrossel Estratégico',
      software: 'Photoshop • Figma',
      colors: ['#3B82F6', '#1E40AF', '#090A0F', '#FFFFFF'],
      desc: 'Projeto visual estruturado para engajamento e retenção no Instagram.'
    };
    return {
      id: 'carrossel-' + d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      folderName: d.name,
      title: meta.title,
      client: meta.client,
      handle: meta.handle,
      type: meta.type,
      category: 'Carrosséis',
      cover: slides[0],
      slides: slides,
      slideCount: slides.length,
      software: meta.software,
      colors: meta.colors,
      description: meta.desc,
      highlight: true
    };
  });

// 2. IDENTIDADE VISUAL (Now each has a single continuous presentation image!)
const idVisualMeta = {
  'ID VISUAL CODIGO HOP': {
    title: 'CÓDIGO HOP - ROGÉRIO GRECO',
    client: 'Rogério Greco',
    handle: '@codigohop',
    type: 'ROGÉRIO GRECO',
    software: 'Illustrator • Photoshop',
    colors: ['#F59E0B', '#B45309', '#0A0A0B', '#FEF3C7'],
    desc: 'Sistema de marca robusto combinando o universo tech com a tradição cervejeira artesanal em apresentação contínua completa.'
  },
  'ID VISUAL PEDRO VIZIBELLI': {
    title: 'PEDRO VIZIBELLI - OFTAMOLOGISTA',
    client: 'Dr. Pedro Vizibelli',
    handle: '@pedrovizibelli.adv',
    type: 'OFTAMOLOGISTA',
    software: 'Illustrator • InDesign',
    colors: ['#D4AF37', '#854D0E', '#09090B', '#FAFAFA'],
    desc: 'Posicionamento sóbrio e imponente para advocacia empresarial de alto tíquete e autoridade em prancha contínua.'
  },
  'ID VISUAL TITA SUSPENSÕES': {
    title: 'TITA SUSPENSÕES - MECÂNICA AUTOMOTIVA',
    client: 'Tita Suspensões',
    handle: '@titasuspensoes',
    type: 'MECÂNICA AUTOMOTIVA',
    software: 'Illustrator • Photoshop',
    colors: ['#EF4444', '#991B1B', '#090A0F', '#F4F4F5'],
    desc: 'Identidade visual agressiva e técnica para oficina e preparação de suspensões de alta performance.'
  },
  'ID VISUAL CARIBENA': {
    title: 'CARIBEÑA - MODA SUSTENTÁVEL',
    client: 'Caribeña',
    handle: '@usecaribena',
    type: 'MODA SUSTENTÁVEL',
    software: 'Illustrator • Photoshop • Figma',
    colors: ['#06B6D4', '#0E7490', '#FDF8F0', '#1C1917'],
    desc: 'Construção completa de marca apresentada em prancha vertical contínua: tipografia, estamparia, tags e universo tropical sustentável.'
  },
  'ID VISUAL PULP CAST': {
    title: 'PULP CAST - PODCAST',
    client: 'Pulp Cast',
    handle: '@pulpcast',
    type: 'PODCAST',
    software: 'Illustrator • After Effects • Photoshop',
    colors: ['#EC4899', '#BE185D', '#0F172A', '#FCE7F3'],
    desc: 'Visual retrô-moderno com energia pop, desenvolvido para canal de podcast, vinhetas e redes sociais.'
  },
  'ID VISUAL BETHEL 360': {
    title: 'BETHEL 360° - SOFTWARE',
    client: 'Bethel 360°',
    handle: '@bethel360',
    type: 'SOFTWARE',
    software: 'InDesign • Illustrator',
    colors: ['#10B981', '#047857', '#0A0E1A', '#F0FDF4'],
    desc: 'Apresentação executiva completa de identidade institucional e aplicações para grandes empreendimentos em prancha contínua.'
  },
  'ID VISUAL DRAGON TEC': {
    title: 'DRAGONTEC - SOFTWARE',
    client: 'Dragon Tec',
    handle: '@dragontec.io',
    type: 'SOFTWARE',
    software: 'Illustrator • InDesign',
    colors: ['#8B5CF6', '#6D28D9', '#07080E', '#EDE9FE'],
    desc: 'Apresentação completa de marca tech com símbolo tecnológico, malha construtiva e aplicações digitais.'
  },
  'ID VISUAL 4 ESTAÇÕES': {
    title: '4 ESTAÇÕES - MODA',
    client: '4 Estações',
    handle: '@4estacoes.moda',
    type: 'MODA',
    software: 'Illustrator • Photoshop',
    colors: ['#F97316', '#C2410C', '#0C0A09', '#FFF7ED'],
    desc: 'Identidade visual elegante e acolhedora para marca autoral de moda em apresentação contínua.'
  },
  'ID VISUAL ESNEAKERS': {
    title: 'ESNEAKERS - LIFESTYLE',
    client: 'Esneakers',
    handle: '@esneakers.oficial',
    type: 'LIFESTYLE',
    software: 'Illustrator • Photoshop',
    colors: ['#3B82F6', '#1E40AF', '#090A0F', '#FFFFFF'],
    desc: 'Identidade visual urbana e contemporânea para marca de calçados e lifestyle streetwear.'
  }
};

const idVisual = fs.readdirSync('Identidade Visual', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    let p = path.join('Identidade Visual', d.name);
    let files = fs.readdirSync(p).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')).sort(naturalSort);
    const continuousImg = files.length > 0 ? resolveOptimizedPath(p, files[0]) : '';

    const meta = idVisualMeta[d.name] || {
      title: d.name.replace(/^ID VISUAL\s*/, ''),
      client: 'Cliente',
      handle: '@branding',
      type: 'Identidade Visual Contínua',
      software: 'Illustrator • Photoshop',
      colors: ['#3B82F6', '#1E40AF', '#090A0F', '#FFFFFF'],
      desc: 'Projeto completo de marca e diretrizes visuais em apresentação contínua.'
    };

    return {
      id: 'id-visual-' + d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      folderName: d.name,
      title: meta.title,
      client: meta.client,
      handle: meta.handle,
      type: meta.type,
      category: 'Identidade Visual',
      cover: continuousImg,
      presentationImage: continuousImg,
      slides: [continuousImg],
      slideCount: 1,
      isContinuousBoard: true,
      vanteCover: fs.existsSync(path.join(p, 'vante_cover.webp')) ? ('Identidade Visual/' + d.name + '/vante_cover.webp').replace(/\\/g, '/') : continuousImg,
      software: meta.software,
      colors: meta.colors,
      description: meta.desc,
      highlight: true
    };
  });

// 3. ESTATICOS
const staticMeta = {
  'SMART GROW ESTÁTICO.png': {
    title: 'Smart Grow — Soluções para Produtividade Agro',
    client: 'Smart Grow Agrotech',
    handle: '@smartgrow.agrotech',
    type: 'Post Feed Estático',
    software: 'Photoshop • Illustrator',
    colors: ['#22C55E', '#15803D', '#0B140E', '#F0FDF4'],
    desc: 'Design de alta densidade visual com iluminação dramática e destaque para a tecnologia do insumo agrícola.',
    highlight: true
  },
  'CRIATIVO 01 - BOARDING GROUP - 09-01.png': {
    title: 'Boarding Group — Aviação Executiva & Conforto',
    client: 'Boarding Group Aero',
    handle: '@boardinggroup.aero',
    type: 'Criativo de Alta Performance (Tráfego Pago)',
    software: 'Photoshop • Figma',
    colors: ['#007AFF', '#1E40AF', '#090A0F', '#E2E8F0'],
    desc: 'Criativo para tráfego pago focado em empresários e executivos com alto CTR e taxa de clique.',
    highlight: true
  },
  'CRIATIVO 02 - BOARDING GROUP - 09-01.png': {
    title: 'Boarding Group — Fretamento de Jatos Privados',
    client: 'Boarding Group Aero',
    handle: '@boardinggroup.aero',
    type: 'Criativo de Tráfego Pago',
    software: 'Photoshop • Figma',
    colors: ['#38BDF8', '#0284C7', '#0A0E17', '#F0F9FF'],
    desc: 'Anúncio voltado para conversão direta de reservas com estética de luxo e tipografia imponente.',
    highlight: false
  },
  'CRIATIVO 03 - BOARDING GROUP - 09-01.png': {
    title: 'Boarding Group — Experiência de Voo Exclusiva',
    client: 'Boarding Group Aero',
    handle: '@boardinggroup.aero',
    type: 'Criativo de Performance',
    software: 'Photoshop • Figma',
    colors: ['#60A5FA', '#1D4ED8', '#090A0F', '#EFF6FF'],
    desc: 'Destaque para o cockpit e cabine premium com composição fotográfica de impacto.',
    highlight: false
  },
  '11-04---DRA.MARI.png': {
    title: 'Dra. Mariana — Harmonização Facial & Confiança',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Post Feed Autoral & Branding',
    software: 'Photoshop • Lightroom',
    colors: ['#AF52DE', '#701A75', '#18181B', '#FDF4FF'],
    desc: 'Composição editorial sofisticada que transmite elegância, segurança e técnica refinada.',
    highlight: true
  },
  '11-06-DRA.png': {
    title: 'Dra. Mariana — Estética com Naturalidade',
    client: 'Dra. Mariana Dermato',
    handle: '@dra.marianadermato',
    type: 'Post Feed Estético',
    software: 'Photoshop • Lightroom',
    colors: ['#E879F9', '#86198F', '#18181B', '#FDF4FF'],
    desc: 'Design minimalista focado na expressão e bem-estar da paciente.',
    highlight: false
  },
  '20-10 - ERP - SMART GROW.png': {
    title: 'Smart Grow ERP — Plataforma de Gestão Agrícola',
    client: 'Smart Grow Tech',
    handle: '@smartgrow.tech',
    type: 'Interface UI & Apresentação de Produto',
    software: 'Figma • Photoshop',
    colors: ['#00C7BE', '#0E7490', '#0B132B', '#ECFEFF'],
    desc: 'Mockup 3D em perspectiva para apresentação de software SaaS corporativo com painéis e métricas.',
    highlight: true
  },
  'RONAN-PEDROZA-CRIATIVO 01.png': {
    title: 'Ronan Pedroza — Posicionamento de Negócios 01',
    client: 'Ronan Pedroza Oficial',
    handle: '@ronanpedroza.oficial',
    type: 'Criativo de Conteúdo & Conversão',
    software: 'Photoshop • Figma',
    colors: ['#FF9500', '#C2410C', '#0C0A09', '#FAFAF9'],
    desc: 'Composição de alto contraste para infoproduto e mentoria de negócios.',
    highlight: true
  },
  'CRIATIVO 01.png': {
    title: 'Criativo Comercial — Lançamento & Vendas',
    client: 'Campanha Digital',
    handle: '@performance.ads',
    type: 'Criativo Publicitário',
    software: 'Photoshop • Illustrator',
    colors: ['#EF4444', '#B91C1C', '#090A0F', '#FEF2F2'],
    desc: 'Peça publicitária criada para maximizar taxa de cliques em canais de mídia paga.',
    highlight: false
  },
  'CRIATIVO 02.png': {
    title: 'Seller Chat — IA Conversacional em Tempo Real',
    client: 'Seller Chat AI',
    handle: '@sellerchat.ai',
    type: 'Criativo de Lançamento Tech',
    software: 'Photoshop • Figma',
    colors: ['#6366F1', '#4338CA', '#0F172A', '#EEF2FF'],
    desc: 'Visual moderno com elementos de inteligência artificial e interface conversacional.',
    highlight: true
  },
  'SMART GROW COMPANY - 28-10.png': {
    title: 'Smart Grow — Inovação Contínua no Campo',
    client: 'Smart Grow Agrotech',
    handle: '@smartgrow.agrotech',
    type: 'Post Institucional Feed',
    software: 'Photoshop • Illustrator',
    colors: ['#16A34A', '#14532D', '#0A120B', '#DCFCE7'],
    desc: 'Material institucional comemorativo e reforço de branding do ecossistema Smart Grow.',
    highlight: false
  },
  'PRATOS-ZENITAL_01.png': {
    title: 'Clique & Poesia — O que é Foto Zenital?',
    client: 'Clique & Poesia Fotografia',
    handle: '@cliqueeposia',
    type: 'Post Educativo Gastronômico',
    software: 'Photoshop • Lightroom',
    colors: ['#84CC16', '#D97706', '#0A0A0A', '#FFFFFF'],
    desc: 'Fotografia gastronômica autoral com enquadramento zenital de alta precisão e iluminação direcionada.',
    highlight: true
  },
  'COR DE INGREDIENTE - 27-10 - FEED.png': {
    title: 'Clique & Poesia — A Cor Também é um Ingrediente',
    client: 'Clique & Poesia Fotografia',
    handle: '@cliqueeposia',
    type: 'Direção de Arte & Food Styling',
    software: 'Photoshop • Lightroom',
    colors: ['#EF4444', '#15803D', '#18181B', '#FFFBEB'],
    desc: 'Composição com recorte e desaturação seletiva evidenciando a cor como vetor primário de apetite appeal e sofisticação gastronômica.',
    highlight: true
  }
};

const staticFiles = fs.readdirSync('Estáticos')
  .filter(f => !f.endsWith('.txt') && !f.endsWith('.md') && !f.includes('verified') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')))
  .map(f => {
    const meta = staticMeta[f] || {
      title: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      client: 'Design Autoral',
      handle: '@design.portfolio',
      type: 'Criativo & Post Social Media',
      software: 'Photoshop • Figma',
      colors: ['#007AFF', '#1E40AF', '#090A0F', '#FFFFFF'],
      desc: 'Peça gráfica desenvolvida com foco em identidade visual marcante e engajamento.',
      highlight: false
    };
    const optPath = resolveOptimizedPath('Estáticos', f);
    return {
      id: 'static-' + f.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: meta.title,
      client: meta.client,
      handle: meta.handle,
      type: meta.type,
      category: 'Estáticos',
      cover: optPath,
      slides: [optPath],
      slideCount: 1,
      software: meta.software,
      colors: meta.colors,
      description: meta.desc,
      highlight: meta.highlight || false
    };
  });

const allProjects = [...carrosseis, ...idVisual, ...staticFiles];
console.log('Total projects compiled:', allProjects.length);
console.log(' - Carrosseis:', carrosseis.length);
console.log(' - Identidade Visual:', idVisual.length);
console.log(' - Estáticos:', staticFiles.length);

const output = 'window.PORTFOLIO_PROJECTS = ' + JSON.stringify(allProjects, null, 2) + ';\nvar PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS;\n';
fs.writeFileSync('projects-data.js', output, 'utf8');
console.log('projects-data.js successfully written!');
