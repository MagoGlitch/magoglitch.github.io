import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
  "COR DE INGREDIENTE - 27-10 - FEED.png": {
    "title": "Clique & Poesia — A Cor Também É um Ingrediente",
    "client": "Clique & Poesia (projeto próprio)",
    "handle": "@cliqueepoesia",
    "type": "Direção de Arte Gastronômica",
    "software": "Photoshop • Lightroom",
    "colors": [
      "#A19F9E",
      "#282727",
      "#101010",
      "#DDC7C0"
    ],
    "desc": "Composição com desaturação seletiva que usa a cor como ingrediente da foto.",
    "highlight": true
  },
  "SMART GROW ESTÁTICO.png": {
    "title": "Smart Grow Company — Seu Software É Bom",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Post de Feed",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#01203E",
      "#243450",
      "#00206E",
      "#3993BB"
    ],
    "desc": "Post para empresas de software: o produto é bom, mas não se vende sozinho.",
    "highlight": true
  },
  "[SP][PERP][E][01] BANNER GERAL story.jpg": {
    "title": "Conceber — 3º Simpósio Fertilidade Clínica",
    "client": "Certificação Conceber",
    "handle": "",
    "type": "Story de Evento",
    "software": "Photoshop • Figma",
    "colors": [
      "#001332",
      "#172F4B",
      "#8A8183"
    ],
    "desc": "Story de divulgação do simpósio online de fertilidade clínica para médicos e nutricionistas.",
    "highlight": false
  },
  "11-04---DRA.MARI.png": {
    "title": "Dra. Mari Araujo — Protocolo de Emagrecimento",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Post de Oferta",
    "software": "Photoshop • Lightroom",
    "colors": [
      "#130D11",
      "#745E73",
      "#644F62",
      "#3E2F3B"
    ],
    "desc": "Post apresentando o protocolo de emagrecimento e o que está incluído.",
    "highlight": true
  },
  "11-06-DRA.png": {
    "title": "Dra. Mari Araujo — Mulher, 40+",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Post de Conteúdo",
    "software": "Photoshop • Lightroom",
    "colors": [
      "#206172",
      "#488292",
      "#97AEB3",
      "#ABC9CF"
    ],
    "desc": "Post sobre cuidado com a saúde da mulher depois dos 40.",
    "highlight": false
  },
  "20-10 - ERP - SMART GROW.png": {
    "title": "Smart Grow Company — ERP Não É Tudo Igual",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Post de Feed",
    "software": "Figma • Photoshop",
    "colors": [
      "#000E29",
      "#00010B",
      "#232342",
      "#687084"
    ],
    "desc": "Post para empresas de ERP sobre competir por valor, e não por preço.",
    "highlight": true
  },
  "CRIATIVO 01 - 03-11.png": {
    "title": "Sou Vitória — Secretária com IA",
    "client": "Sou Vitória",
    "handle": "",
    "type": "Anúncio de Produto",
    "software": "Photoshop • Figma",
    "colors": [
      "#0B0A31",
      "#000003",
      "#1D194D",
      "#35387A"
    ],
    "desc": "Anúncio da IA que agenda pacientes enquanto a secretária da clínica dorme.",
    "highlight": false
  },
  "CRIATIVO 01 - BOARDING GROUP - 09-01.png": {
    "title": "Boarding Group — Executivo, Você Tem Milhas?",
    "client": "Boarding Group",
    "handle": "",
    "type": "Anúncio de Tráfego Pago",
    "software": "Photoshop • Figma",
    "colors": [
      "#030B18",
      "#876450",
      "#694026",
      "#392F2B"
    ],
    "desc": "Anúncio para executivos que acumulam milhas e não têm tempo de usá-las.",
    "highlight": true
  },
  "CRIATIVO 01.png": {
    "title": "Unidas — Não Compre, Alugue",
    "client": "Unidas Aluguel de Carros",
    "handle": "",
    "type": "Anúncio de Produto",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#0067B4",
      "#004896",
      "#052768",
      "#DFD28A"
    ],
    "desc": "Anúncio de aluguel de carros com tipografia de impacto.",
    "highlight": false
  },
  "CRIATIVO 02 - BOARDING GROUP - 09-01.png": {
    "title": "Boarding Group — Seu Tempo É Valioso",
    "client": "Boarding Group",
    "handle": "",
    "type": "Anúncio de Tráfego Pago",
    "software": "Photoshop • Figma",
    "colors": [
      "#000412",
      "#002448",
      "#00152F",
      "#334D66"
    ],
    "desc": "Anúncio sobre deixar a estratégia de milhas com quem entende do assunto.",
    "highlight": false
  },
  "CRIATIVO 02 STORIES - 23-05.png": {
    "title": "Smart Grow Company — 6 Reuniões por Dia",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Story de Anúncio",
    "software": "Photoshop • Figma",
    "colors": [
      "#151F28",
      "#557E8F",
      "#175570",
      "#25333E"
    ],
    "desc": "Story para empresas de software sobre agendamento automático de reuniões.",
    "highlight": false
  },
  "CRIATIVO 02.png": {
    "title": "Unidas — Por Que Comprar o Carro Inteiro?",
    "client": "Unidas Aluguel de Carros",
    "handle": "",
    "type": "Anúncio de Produto",
    "software": "Photoshop • Figma",
    "colors": [
      "#004DAB",
      "#0073D7",
      "#E9E4CC",
      "#091C42"
    ],
    "desc": "Anúncio de aluguel de carros para quem só quer dirigir, sem se preocupar com o resto.",
    "highlight": true
  },
  "CRIATIVO 03 - BOARDING GROUP - 09-01.png": {
    "title": "Boarding Group — CPF + SSN",
    "client": "Boarding Group",
    "handle": "",
    "type": "Anúncio de Tráfego Pago",
    "software": "Photoshop • Figma",
    "colors": [
      "#05213C",
      "#000A19",
      "#636E74"
    ],
    "desc": "Anúncio para brasileiros com CPF e SSN sobre emissões de milhas entre Brasil e EUA.",
    "highlight": false
  },
  "CRIATIVO 03.png": {
    "title": "Unidas Seminovos — R$ 1.200 e o Carro É Seu",
    "client": "Unidas Seminovos",
    "handle": "",
    "type": "Anúncio de Oferta",
    "software": "Photoshop • Figma",
    "colors": [
      "#D4575A",
      "#930104",
      "#5F4D4E",
      "#330607"
    ],
    "desc": "Anúncio de seminovos com entrada e parcelas em destaque.",
    "highlight": false
  },
  "CRIATIVO 04.png": {
    "title": "Unidas Seminovos — Polo Track por R$ 1.200",
    "client": "Unidas Seminovos",
    "handle": "",
    "type": "Anúncio de Oferta",
    "software": "Photoshop • Figma",
    "colors": [
      "#D70000",
      "#D0C8B5",
      "#500001",
      "#905B60"
    ],
    "desc": "Anúncio de oferta do Polo Track com entrada e parcelas.",
    "highlight": false
  },
  "CRIATIVO 05.png": {
    "title": "Unidas Seminovos — HB20 Comfort Plus",
    "client": "Unidas Seminovos",
    "handle": "",
    "type": "Anúncio de Oferta",
    "software": "Photoshop • Figma",
    "colors": [
      "#880001",
      "#030001",
      "#CC0002",
      "#AD9881"
    ],
    "desc": "Anúncio de oferta do HB20 com entrada e parcelas.",
    "highlight": false
  },
  "ESTÁTICO 02 FEED.png": {
    "title": "Conceber — Black Friday, Desconto Exclusivo",
    "client": "Certificação Conceber",
    "handle": "",
    "type": "Post de Oferta",
    "software": "Photoshop • Figma",
    "colors": [
      "#163A57",
      "#9A9FA9",
      "#1B2D3D",
      "#2C5677"
    ],
    "desc": "Post de Black Friday da Certificação Conceber.",
    "highlight": false
  },
  "ESTÁTICO 04 FEED.png": {
    "title": "Conceber — Black Friday",
    "client": "Certificação Conceber",
    "handle": "",
    "type": "Post de Oferta",
    "software": "Photoshop • Figma",
    "colors": [
      "#061422",
      "#172D3F",
      "#323F4E",
      "#90B686"
    ],
    "desc": "Post de aquecimento para a Black Friday da Certificação Conceber.",
    "highlight": false
  },
  "ESTÁTICOS-(3)--31-01.png": {
    "title": "Dra. Mari Araujo — Medicina de Precisão",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Story de Conteúdo",
    "software": "Photoshop • Figma",
    "colors": [
      "#3F3E3F",
      "#1C1D1F",
      "#0E0C0D",
      "#9DC294"
    ],
    "desc": "Story apresentando a medicina de precisão com chamada para consulta.",
    "highlight": false
  },
  "ESTÁTICOS-07-02-(-1-).png": {
    "title": "Dra. Mari Araujo — Emagrecimento Seguro",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Story de Conteúdo",
    "software": "Photoshop • Figma",
    "colors": [
      "#1D515F",
      "#35687C",
      "#D4D6D4",
      "#7F9CB5"
    ],
    "desc": "Story sobre um caminho seguro para emagrecer com medicina de precisão.",
    "highlight": false
  },
  "POST 1  Mudança de estação - 03-03.png": {
    "title": "Imunofosfo — Mudança de Estação",
    "client": "America Nutrition",
    "handle": "",
    "type": "Post de Feed",
    "software": "Photoshop • Figma",
    "colors": [
      "#00286C",
      "#00133F",
      "#01408D",
      "#DEDFE3"
    ],
    "desc": "Post que associa a mudança de estação ao cuidado redobrado com a saúde.",
    "highlight": false
  },
  "POST 2   Inspiracional - 03-03.png": {
    "title": "Imunofosfo — Todas as Fases da Vida",
    "client": "America Nutrition",
    "handle": "",
    "type": "Post de Feed",
    "software": "Photoshop • Figma",
    "colors": [
      "#D8EAED",
      "#004194",
      "#ACC0CE",
      "#837E89"
    ],
    "desc": "Post sobre cuidar da saúde em todas as fases da vida.",
    "highlight": false
  },
  "RONAN-PEDROZA-CRIATIVO-03.png": {
    "title": "Ronan Pedroza — Conecte-se com Seu Público",
    "client": "Ronan Pedroza",
    "handle": "@ronanpedroza",
    "type": "Anúncio de Curso",
    "software": "Photoshop • Figma",
    "colors": [
      "#C8AD8D",
      "#121110",
      "#AD9071",
      "#232120"
    ],
    "desc": "Anúncio do curso de carrosséis criativos para fotógrafos.",
    "highlight": false
  },
  "RONAN-PEDROZA-CRIATIVO-04.png": {
    "title": "Ronan Pedroza — Hey, Você, Fotógrafo!",
    "client": "Ronan Pedroza",
    "handle": "@ronanpedroza",
    "type": "Anúncio de Curso",
    "software": "Photoshop • Figma",
    "colors": [
      "#211F1F",
      "#040405",
      "#686361",
      "#403C3B"
    ],
    "desc": "Anúncio do curso de carrosséis criativos para fotógrafos.",
    "highlight": false
  },
  "RONAN-PEDROZA-CRIATIVO-05.png": {
    "title": "Ronan Pedroza — Conheça o Passo a Passo",
    "client": "Ronan Pedroza",
    "handle": "@ronanpedroza",
    "type": "Anúncio de Curso",
    "software": "Photoshop • Figma",
    "colors": [
      "#020102",
      "#856C5A",
      "#3C3532",
      "#BEB9AD"
    ],
    "desc": "Anúncio do curso de carrosséis criativos para fotógrafos.",
    "highlight": false
  },
  "RONAN-PEDROZA-CRIATIVO-06.png": {
    "title": "Ronan Pedroza — Carrosséis Que Levam Horas?",
    "client": "Ronan Pedroza",
    "handle": "@ronanpedroza",
    "type": "Anúncio de Curso",
    "software": "Photoshop • Figma",
    "colors": [
      "#2F5364",
      "#030202",
      "#432B23",
      "#7C8484"
    ],
    "desc": "Anúncio do curso de carrosséis criativos para fotógrafos.",
    "highlight": false
  },
  "RONAN-PEDROZA-CRIATIVO-08.png": {
    "title": "Ronan Pedroza — Descubra o Segredo",
    "client": "Ronan Pedroza",
    "handle": "@ronanpedroza",
    "type": "Anúncio de Curso",
    "software": "Photoshop • Figma",
    "colors": [
      "#030304",
      "#556B8F",
      "#36445B",
      "#090F1D"
    ],
    "desc": "Anúncio do curso de carrosséis criativos para fotógrafos.",
    "highlight": false
  },
  "SMART GROW COMPANY - 28-10.png": {
    "title": "Smart Grow Company — A Gente Enxerga o Crescimento",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Post de Feed",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#D0DAF4",
      "#474954",
      "#B1B8CE"
    ],
    "desc": "Post oferecendo diagnóstico gratuito para empresas de software.",
    "highlight": false
  },
  "PRATOS-ZENITAL_01.png": {
    "title": "Clique & Poesia — O Que É Foto Zenital?",
    "client": "Clique & Poesia (projeto próprio)",
    "handle": "@cliqueepoesia",
    "type": "Post Educativo",
    "software": "Photoshop • Lightroom",
    "colors": [
      "#1A181A",
      "#BFCDAD",
      "#0A0A0A",
      "#5B4B34"
    ],
    "desc": "Fotografia gastronômica em enquadramento zenital para explicar a técnica.",
    "highlight": true
  },
  "SEGUNDO LOTE DISPONIVEL.jpg": {
    "title": "Forró Piro 23° — Segundo Lote Disponível",
    "client": "Forró Piro",
    "handle": "",
    "type": "Story de Vendas",
    "software": "Photoshop",
    "colors": [
      "#552EA6",
      "#3D0D7D",
      "#BA60DC",
      "#6255B3"
    ],
    "desc": "Story de venda de ingressos do segundo lote, com condições de parcelamento.",
    "highlight": true
  },
  "1 ATRAÇÃO CONFIRMADA2.jpg": {
    "title": "Forró Piro 23° — Prontos Para Tremer?",
    "client": "Forró Piro",
    "handle": "",
    "type": "Story de Evento",
    "software": "Photoshop",
    "colors": [
      "#32113D",
      "#50385C",
      "#7A537B",
      "#AD8A98"
    ],
    "desc": "Story de divulgação da atração Pedro Sampaio.",
    "highlight": true
  },
  "ATRAÇÃO PEDRO SAMPAIO.jpg": {
    "title": "Forró Piro 23° — 1ª Atração Confirmada: Pedro Sampaio",
    "client": "Forró Piro",
    "handle": "",
    "type": "Flyer de Evento",
    "software": "Photoshop",
    "colors": [
      "#2A2B47",
      "#6A5ECB",
      "#B366DC",
      "#4E1F79"
    ],
    "desc": "Peça de feed anunciando a primeira atração do Forró Piro 23°, em Curvelo-MG.",
    "highlight": true
  },
  "TEUTO EM MOVIMENTO - 05-02 OPÇÃO 02.png": {
    "title": "Laboratório Teuto — Teuto em Movimento (76 Anos)",
    "client": "Laboratório Teuto",
    "handle": "@laboratorioteuto",
    "type": "Campanha Institucional & Esportiva",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#003366",
      "#0055A5",
      "#7CB342",
      "#FFFFFF"
    ],
    "desc": "Direção de arte institucional de forte peso tipográfico celebrando os 76 anos do Laboratório Teuto com a campanha Teuto em Movimento, valorizando saúde e qualidade de vida.",
    "highlight": true
  },
  "TEUTO - STORIES FARMARCAS.png": {
    "title": "Laboratório Teuto — Ibupril: Alívio Rápido para Seguir em Frente",
    "client": "Laboratório Teuto",
    "handle": "@laboratorioteuto",
    "type": "Story de Campanha / Farmarcas",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#00A896",
      "#028090",
      "#E31B23",
      "#F0FDF4"
    ],
    "desc": "Story vertical com visual limpo e tecnológico: ondas dinâmicas e moléculas sutis destacando embalagens em perspectiva e mensagem de continuidade.",
    "highlight": false
  },
  "TEUTO - IBUPRIL.png": {
    "title": "Laboratório Teuto — Ibupril: Seu Ciclo Sem Pausas",
    "client": "Laboratório Teuto",
    "handle": "@laboratorioteuto",
    "type": "Post de Feed / Criativo Feminino",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#D81B60",
      "#880E4F",
      "#F48FB1",
      "#FFFFFF"
    ],
    "desc": "Composição com direção de arte focada no público feminino, combinando tonalidade magenta vibrante e iluminação contemporânea com mensagem empática para o alívio das cólicas.",
    "highlight": true
  },
  "TEUTO - IBUPRIL 2.png": {
    "title": "Laboratório Teuto — Ibupril: Alívio Rápido da Dor e Febre",
    "client": "Laboratório Teuto",
    "handle": "@laboratorioteuto",
    "type": "Post de Feed / Criativo Farmacêutico",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#004B87",
      "#E31B23",
      "#002B49",
      "#FFFFFF"
    ],
    "desc": "Peça publicitária de alta performance com apelo esportivo e dinamismo visual: atleta em campo destacando a recuperação rápida do bem-estar com Ibupril 400mg.",
    "highlight": true
  },
  "TEUTO.png": {
    "title": "Laboratório Teuto — Conscientização: Vacinação Contra a Gripe",
    "client": "Laboratório Teuto",
    "handle": "@laboratorioteuto",
    "type": "Post Educativo & Conscientização",
    "software": "Photoshop • Illustrator",
    "colors": [
      "#0284C7",
      "#0369A1",
      "#0F172A",
      "#F0F9FF"
    ],
    "desc": "Composição editorial com cubos 3D flutuantes e cartela hospitalar limpa, orientando sobre a importância da vacinação e o fortalecimento da imunidade coletiva.",
    "highlight": false
  }
};

const staticPriorityOrder = [
  "TEUTO EM MOVIMENTO - 05-02 OPÇÃO 02.png",
  "TEUTO - IBUPRIL 2.png",
  "TEUTO - IBUPRIL.png",
  "TEUTO - STORIES FARMARCAS.png",
  "TEUTO.png",
  "SMART GROW ESTÁTICO.png",
  "ATRAÇÃO PEDRO SAMPAIO.jpg",
  "[SP][PERP][E][01] BANNER GERAL story.jpg",
  "CRIATIVO 01 - BOARDING GROUP - 09-01.png",
  "11-04---DRA.MARI.png",
  "CRIATIVO 01 - 03-11.png",
  "COR DE INGREDIENTE - 27-10 - FEED.png",
  "20-10 - ERP - SMART GROW.png",
  "CRIATIVO 02.png",
  "CRIATIVO 03.png",
  "SEGUNDO LOTE DISPONIVEL.jpg",
  "1 ATRAÇÃO CONFIRMADA2.jpg",
  "POST 1  Mudança de estação - 03-03.png",
  "POST 2   Inspiracional - 03-03.png",
  "PRATOS-ZENITAL_01.png",
  "RONAN-PEDROZA-CRIATIVO-03.png",
  "RONAN-PEDROZA-CRIATIVO-04.png",
  "RONAN-PEDROZA-CRIATIVO-05.png",
  "RONAN-PEDROZA-CRIATIVO-06.png",
  "RONAN-PEDROZA-CRIATIVO-08.png",
  "SMART GROW COMPANY - 28-10.png",
  "CRIATIVO 02 STORIES - 23-05.png",
  "CRIATIVO 04.png",
  "CRIATIVO 05.png",
  "CRIATIVO 01.png",
  "CRIATIVO 02 - BOARDING GROUP - 09-01.png",
  "CRIATIVO 03 - BOARDING GROUP - 09-01.png",
  "ESTÁTICO 02 FEED.png",
  "ESTÁTICO 04 FEED.png",
  "11-06-DRA.png",
  "ESTÁTICOS-(3)--31-01.png",
  "ESTÁTICOS-07-02-(-1-).png"
];

let sharp;
try {
  sharp = require('C:/Users/MARCOS/.gemini/antigravity/sharp_tool/node_modules/sharp');
} catch (e) {
  try { sharp = require('sharp'); } catch (e2) {}
}

const rawStaticFiles = fs.readdirSync('Estáticos')
  .filter(f => !f.endsWith('.txt') && !f.endsWith('.md') && !f.includes('verified') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')));

// Sort with priorityOrder first
const staticFilesList = [...rawStaticFiles].sort((a, b) => {
  const idxA = staticPriorityOrder.indexOf(a);
  const idxB = staticPriorityOrder.indexOf(b);
  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;
  return a.localeCompare(b);
});

const staticFiles = staticFilesList.map(f => {
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
  let format = '1080x1350';
  let aspectRatio = '4/5';
  let formatLabel = 'Feed • 4:5';
  if (f.toLowerCase().includes('stor') || f.startsWith('11-0') || f.startsWith('ESTÁTICOS-') || f.includes('SEGUNDO LOTE') || f.includes('1 ATRAÇÃO')) {
    format = '1080x1920';
    aspectRatio = '9/16';
    formatLabel = 'Story • 9:16';
  } else if (f.includes('FEED') && (f.includes('02') || f.includes('04'))) {
    format = '1080x1080';
    aspectRatio = '1/1';
    formatLabel = 'Post • 1:1';
  }
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
    highlight: meta.highlight || false,
    format,
    aspectRatio,
    formatLabel
  };
});

// Dados conferidos peça a peça (títulos, clientes e cores reais). Prevalecem sobre os metadados acima.
const VERIFIED_META = {
  "ZENITTAL CARROSSEL 25-10": {
    "title": "Clique & Poesia — O Que É Foto Zenital?",
    "client": "Clique & Poesia (projeto próprio)",
    "handle": "@cliqueepoesia",
    "type": "Carrossel Educativo",
    "desc": "Carrossel panorâmico de fotografia gastronômica zenital: os pratos continuam de um slide para o outro.",
    "colors": [
      "#1A181A",
      "#BFCDAD",
      "#0A0A0A",
      "#5B4B34"
    ],
    "externalUrl": "https://www.cliqueepoesia.com.br/#portfolio",
    "externalLabel": "Ver o portfólio de fotografia da Clique & Poesia"
  },
  "CARROSSEL": {
    "title": "Imunofosfo — Mitos ou Verdade",
    "client": "America Nutrition",
    "handle": "",
    "type": "Carrossel Educativo",
    "desc": "Carrossel no formato mitos ou verdade com três curiosidades sobre o suplemento Imunofosfo.",
    "colors": [
      "#FFFFFF",
      "#2F5493",
      "#D2DAE2"
    ]
  },
  "CARROSSEL DRA. MARI 01": {
    "title": "Dra. Mari Araujo — Pequenos Hábitos",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre como pequenos hábitos consistentes levam a grandes resultados na saúde.",
    "colors": [
      "#663523",
      "#974D30",
      "#B65E3B",
      "#EDB998"
    ]
  },
  "CARROSSEL PANDA ENGLISH": {
    "title": "Panda English — Não Tenha Medo de Errar",
    "client": "Panda English School",
    "handle": "@pandaenglish",
    "type": "Carrossel Educativo",
    "desc": "Carrossel motivacional sobre o medo de errar ao aprender inglês, com o mascote 3D da escola.",
    "colors": [
      "#FFFFFF",
      "#020203",
      "#7BABC5",
      "#2A3D5D"
    ]
  },
  "CARROSSEL SMART GROW - 01": {
    "title": "Smart Grow Company — Diagnóstico de Marketing e Vendas",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Carrossel de Captação",
    "desc": "Carrossel que explica por que uma empresa precisa de um diagnóstico gratuito de marketing e vendas.",
    "colors": [
      "#602D31",
      "#251F28",
      "#0B2C3E",
      "#0A1A27"
    ]
  },
  "CARROSSEL DRA. MARI 02": {
    "title": "Dra. Mari Araujo — Suplementos na Menopausa",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel Educativo",
    "desc": "Carrossel com três suplementos para sintomas da menopausa, em linguagem editorial e clara.",
    "colors": [
      "#FDFDFD",
      "#4A4249",
      "#2E292F",
      "#927A4F"
    ]
  },
  "CARROSSEL 01": {
    "title": "Eu Passei Anos Tentando Escolher uma Profissão",
    "client": "Umcaracaramelo",
    "handle": "",
    "type": "Carrossel de Storytelling",
    "desc": "Carrossel em primeira pessoa sobre a busca por uma profissão e a percepção de valor no trabalho criativo.",
    "colors": [
      "#ED7659",
      "#4B2B26",
      "#AB5D74",
      "#9E3B29"
    ]
  },
  "CARROSSEL SELLER CHAT": {
    "title": "Seller Chat — O Teto de Vidro do Atendimento",
    "client": "Seller Chat",
    "handle": "",
    "type": "Carrossel de Produto",
    "desc": "Carrossel para vendedores do Mercado Livre sobre os limites do atendimento manual e a solução da Seller Chat.",
    "colors": [
      "#6A737C",
      "#05284A",
      "#13202C",
      "#4D535C"
    ]
  },
  "CARROSSEL DRA. MARI 03": {
    "title": "Dra. Mari Araujo — Segredo Revelado",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel Educativo",
    "desc": "Carrossel sobre emagrecimento com gancho direto e visual leve.",
    "colors": [
      "#FFFFFF",
      "#FF9C1A",
      "#A47F3B",
      "#DECDAD"
    ]
  },
  "CARROSSEL INGLÊS OQUE É": {
    "title": "Panda English — Focado em Melhorar o Seu Inglês?",
    "client": "Panda English School",
    "handle": "@pandaenglish",
    "type": "Carrossel Institucional",
    "desc": "Carrossel sobre a importância do inglês como língua global e a proposta da escola.",
    "colors": [
      "#5E6B5F",
      "#F3EBDE",
      "#1A2221",
      "#1F3437"
    ]
  },
  "CARROSSEL 04 - 26-10": {
    "title": "A IA Executa. Você Dirige",
    "client": "Umcaracaramelo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre o papel do designer como diretor de criação na era da IA.",
    "colors": [
      "#9082C0",
      "#695622",
      "#D5A0A6",
      "#3D4A23"
    ]
  },
  "CARROSSEL DRA. MARI 04": {
    "title": "Dra. Mari Araujo — Você Está Cansada?",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre cansaço e saúde da mulher, com retrato editorial da médica.",
    "colors": [
      "#2E140A",
      "#823A1F",
      "#4F1A0B",
      "#6B2811"
    ]
  },
  "CARROSSEL 02": {
    "title": "Desaprendendo a Ser Designer",
    "client": "Umcaracaramelo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre largar fórmulas prontas para criar com mais autenticidade.",
    "colors": [
      "#AE56D8",
      "#570C7C",
      "#E5C2F1",
      "#721D9F"
    ]
  },
  "CARROSSEL IMUNOFOSFO": {
    "title": "Imunofosfo — Estresse e Suplementação",
    "client": "America Nutrition",
    "handle": "",
    "type": "Carrossel de Produto",
    "desc": "Carrossel sobre estresse e suplementação, com linguagem direta sobre o problema e o produto.",
    "colors": [
      "#FFFFFF",
      "#EAEBEC",
      "#676D6E",
      "#ADB5B9"
    ]
  },
  "CARROSSEL DRA. MARI 05": {
    "title": "Dra. Mari Araujo — Os Sinais do Seu Corpo",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel que convida a não ignorar os sinais que o corpo dá.",
    "colors": [
      "#453F43",
      "#9C6764",
      "#732654",
      "#A01765"
    ]
  },
  "CARROSSEL PANDA ENGLISH 02": {
    "title": "Panda English — Panda's Birthday & St. Patrick's Day",
    "client": "Panda English School",
    "handle": "@pandaenglish",
    "type": "Carrossel de Evento",
    "desc": "Carrossel festivo para o aniversário da escola no St. Patrick's Day, com moedas douradas e o mascote 3D.",
    "colors": [
      "#FFFFFF",
      "#070705",
      "#3D3320",
      "#E3ECC9"
    ]
  },
  "CARROSSEL SMART GROW - 02": {
    "title": "Smart Grow Company — Seu SaaS Ainda Depende do Boca a Boca?",
    "client": "Smart Grow Company",
    "handle": "",
    "type": "Carrossel de Captação",
    "desc": "Carrossel para empresas de software sobre depender só da indicação para crescer.",
    "colors": [
      "#000716",
      "#1B3C56",
      "#00192F",
      "#7E9BAE"
    ]
  },
  "CARROSSEL DRA.MARI 06": {
    "title": "Dra. Mari Araujo — O Que Não Te Contaram Sobre Climatério",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel Educativo",
    "desc": "Carrossel sobre climatério com abordagem acolhedora.",
    "colors": [
      "#F4F4F4",
      "#E0DEDA",
      "#3D3F3D",
      "#C6B7AD"
    ]
  },
  "CARROSSEL 03": {
    "title": "Fazendo Coisas Que Eu Não Sei Fazer",
    "client": "Umcaracaramelo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre experimentar novas linguagens e sair da zona de conforto.",
    "colors": [
      "#104058",
      "#2E5E73",
      "#E4B274",
      "#B08C61"
    ]
  },
  "CARROSSEL 05 - 28-10": {
    "title": "Aprendendo Muito e Ficando Para Trás",
    "client": "Umcaracaramelo",
    "handle": "",
    "type": "Carrossel de Conteúdo",
    "desc": "Carrossel sobre a sensação de aprender muito e ainda assim ficar para trás no mercado criativo.",
    "colors": [
      "#1A032C",
      "#511D44",
      "#A6686A",
      "#3C0B43"
    ]
  },
  "CARROSSEL DRA.MARI 07": {
    "title": "Dra. Mari Araujo — Hormônios Desregulados?",
    "client": "Dra. Mari Araujo",
    "handle": "",
    "type": "Carrossel Interativo",
    "desc": "Carrossel em formato de perguntas para a mulher avaliar sinais de desregulação hormonal.",
    "colors": [
      "#A5B6C9",
      "#344B6A",
      "#5A718D",
      "#3D6282"
    ]
  },
  "ID VISUAL CODIGO HOP": {
    "title": "CÓDIGO HOP — PROF. ROGÉRIO GRECO E PROF. LEONARDO NOVO",
    "client": "Código Hop",
    "handle": "",
    "type": "EDUCAÇÃO",
    "desc": "Identidade visual do Código Hop, com os professores Rogério Greco e Leonardo Novo, apresentada em prancha contínua.",
    "colors": [
      "#CECFD1",
      "#EFEFF1",
      "#6D1110",
      "#BE968F"
    ]
  },
  "ID VISUAL PEDRO VIZIBELLI": {
    "title": "PEDRO VIZIBELLI — OFTALMOLOGISTA",
    "client": "Dr. Pedro Vizibelli",
    "handle": "",
    "type": "OFTALMOLOGISTA",
    "desc": "Identidade visual para oftalmologista, com símbolo construído a partir do olho, apresentada em prancha contínua.",
    "colors": [
      "#34456F",
      "#23325A",
      "#4B5B83"
    ]
  },
  "ID VISUAL TITA SUSPENSÕES": {
    "title": "TITA SUSPENSÕES — MECÂNICA AUTOMOTIVA",
    "client": "Tita Suspensões",
    "handle": "",
    "type": "MECÂNICA AUTOMOTIVA",
    "desc": "Identidade visual para oficina de suspensões, aplicada em uniforme e materiais da marca.",
    "colors": [
      "#FB4B07",
      "#FFFFFF",
      "#0F1010",
      "#7A2E1B"
    ]
  },
  "ID VISUAL CARIBENA": {
    "title": "CARIBEÑA — MODA",
    "client": "Caribeña",
    "handle": "",
    "type": "MODA",
    "desc": "Identidade visual com universo tropical, apresentada em prancha contínua: tipografia, padrões e aplicações.",
    "colors": [
      "#FFFFFF",
      "#AE8260",
      "#5E3328",
      "#C9C5BB"
    ]
  },
  "ID VISUAL PULP CAST": {
    "title": "PULP CAST — PODCAST",
    "client": "Pulp Cast",
    "handle": "",
    "type": "PODCAST",
    "desc": "Identidade visual para podcast, com aplicações em produtos e redes sociais.",
    "colors": [
      "#F6AA2E",
      "#F5F5F5",
      "#2A2927",
      "#796A4F"
    ]
  },
  "ID VISUAL BETHEL 360": {
    "title": "BETHEL 360° — EVENTOS",
    "client": "Bethel 360°",
    "handle": "",
    "type": "EVENTOS",
    "desc": "Identidade visual aplicada em palco, telão e materiais do evento, apresentada em prancha contínua.",
    "colors": [
      "#7A6DB1",
      "#010105",
      "#1E153D",
      "#313475"
    ]
  },
  "ID VISUAL DRAGON TEC": {
    "title": "DRAGONTEC — SOFTWARE",
    "client": "Dragontec",
    "handle": "",
    "type": "SOFTWARE",
    "desc": "Identidade visual de marca de tecnologia, com símbolo do dragão e aplicações digitais.",
    "colors": [
      "#151414",
      "#403D3D",
      "#76706C",
      "#2A2625"
    ]
  },
  "ID VISUAL 4 ESTAÇÕES": {
    "title": "4 ESTAÇÕES — MODA",
    "client": "4 Estações",
    "handle": "",
    "type": "MODA",
    "desc": "Identidade visual com lettering autoral, apresentada em prancha contínua.",
    "colors": [
      "#3E1A04",
      "#231204",
      "#894D2F"
    ]
  },
  "ID VISUAL ESNEAKERS": {
    "title": "ESNEAKERS — LIFESTYLE",
    "client": "Esneakers",
    "handle": "",
    "type": "LIFESTYLE",
    "desc": "Identidade visual urbana aplicada em bonés, embalagens e produtos.",
    "colors": [
      "#DCDB01",
      "#3F2E73",
      "#969B84",
      "#E8E655"
    ]
  }
};

const applyVerified = (p) => {
  const v = VERIFIED_META[p.folderName];
  if (!v) return p;
  const extra = v.externalUrl ? { externalUrl: v.externalUrl, externalLabel: v.externalLabel } : {};
  return { ...p, title: v.title, client: v.client, handle: v.handle, type: v.type, description: v.desc, colors: v.colors, ...extra };
};
const fixNames = (p) => JSON.parse(JSON.stringify(p).replace(/Araujo/g, 'Araujo'));

// Ordem de exibição: espalha peças do mesmo cliente para não ficarem lado a lado
// (nos Estáticos também evita a mesma marca logo acima/abaixo, já que as colunas usam índice % 3).
function clientKey(p) {
  return String(p.client || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/^dr[a]?\.\s*/, '')
    .replace(/^laboratorio\s+/, '')
    .split(/[\s(]/)[0];
}
function spreadByClient(list, { firstId = null, window: win = 3 } = {}) {
  const remaining = list.map((p, i) => ({ p, i, k: clientKey(p) }));
  const out = [];
  if (firstId) {
    const fi = remaining.findIndex(r => r.p.id === firstId || r.p.folderName === firstId);
    if (fi >= 0) out.push(remaining.splice(fi, 1)[0]);
  }
  while (remaining.length) {
    const counts = {};
    remaining.forEach(r => { counts[r.k] = (counts[r.k] || 0) + 1; });
    let pick = -1;
    for (let w = win; w >= 0 && pick < 0; w--) {
      const recent = new Set(out.slice(Math.max(0, out.length - w)).map(r => r.k));
      let best = -1;
      remaining.forEach((r, idx) => {
        if (recent.has(r.k)) return;
        if (best < 0 || counts[r.k] > counts[remaining[best].k] || (counts[r.k] === counts[remaining[best].k] && r.i < remaining[best].i)) best = idx;
      });
      pick = best;
    }
    out.push(remaining.splice(pick, 1)[0]);
  }
  return out.map(r => r.p);
}

const carrosseisOrdered = spreadByClient(carrosseis.map(applyVerified).map(fixNames), { firstId: 'CARROSSEL SMART GROW - 01', window: 2 });
const idVisualVerified = idVisual.map(applyVerified).map(fixNames);
const staticOrdered = spreadByClient(staticFiles.map(fixNames), { window: 3 });
const allProjects = [...carrosseisOrdered, ...idVisualVerified, ...staticOrdered];
console.log('Total projects compiled:', allProjects.length);
console.log(' - Carrosseis:', carrosseis.length);
console.log(' - Identidade Visual:', idVisual.length);
console.log(' - Estáticos:', staticFiles.length);

const output = 'window.PORTFOLIO_PROJECTS = ' + JSON.stringify(allProjects, null, 2) + ';\nvar PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS;\n';
fs.writeFileSync('projects-data.js', output, 'utf8');
console.log('projects-data.js successfully written!');
