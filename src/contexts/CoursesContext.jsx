import { createContext, useContext, useState, useEffect } from 'react'

const CoursesContext = createContext(null)

const COURSES_KEY  = 'edulivre_courses_v2'
const PROGRESS_KEY = 'edulivre_progress_v1'

export const DEMO_COURSES = [
  {
    id: 'c1', title: 'React do Zero ao Avançado',
    description: 'Aprenda React, hooks, context, roteamento e muito mais com projetos práticos.',
    category: 'Programação', thumbnail: '⚛️', color: '#8b5cf6',
    teacherId: 'demo-teacher', teacherName: 'Prof. Carlos Mendes',
    workload: '40h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lessons: [
      { id: 'l1', title: 'Introdução ao React', duration: '18min', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', pdfUrl: '', description: 'Conceitos fundamentais do React.' },
      { id: 'l2', title: 'Componentes e Props', duration: '24min', videoUrl: 'https://www.youtube.com/embed/35lXWvCuM8o', pdfUrl: '', description: 'Criando componentes reutilizáveis.' },
      { id: 'l3', title: 'State e Hooks', duration: '31min', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', pdfUrl: '', description: 'useState, useEffect e hooks personalizados.' },
    ],
  },
  {
    id: 'c2', title: 'JavaScript Moderno ES2024',
    description: 'Domine JavaScript moderno com async/await, módulos, classes e as novidades do ES2024.',
    category: 'Programação', thumbnail: '⚡', color: '#10b981',
    teacherId: 'demo-teacher', teacherName: 'Prof. Demo',
    workload: '30h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lessons: [
      { id: 'l4', title: 'Fundamentos do JavaScript', duration: '22min', videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c', pdfUrl: '', description: 'Variáveis, tipos e operadores.' },
      { id: 'l5', title: 'Funções e Closures', duration: '28min', videoUrl: 'https://www.youtube.com/embed/aAXMLzS3T0w', pdfUrl: '', description: 'Escopo, closures e arrow functions.' },
    ],
  },
  {
    id: 'c3', title: 'UI/UX Design com Figma',
    description: 'Crie interfaces modernas e profissionais usando o Figma do básico ao avançado.',
    category: 'Design', thumbnail: '🎨', color: '#f59e0b',
    teacherId: 'demo-teacher', teacherName: 'Profa. Ana Figueredo',
    workload: '25h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lessons: [
      { id: 'l6', title: 'Introdução ao Figma', duration: '15min', videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8', pdfUrl: '', description: 'Interface e ferramentas básicas.' },
      { id: 'l7', title: 'Componentes e Auto Layout', duration: '35min', videoUrl: 'https://www.youtube.com/embed/TaPH4J1Mhpg', pdfUrl: '', description: 'Criando sistemas de design escaláveis.' },
      { id: 'l8', title: 'Prototipação', duration: '27min', videoUrl: 'https://www.youtube.com/embed/X5W-4Uy0Ipc', pdfUrl: '', description: 'Criando protótipos interativos.' },
    ],
  },
  {
    id: 'c4', title: 'Python para Iniciantes',
    description: 'Aprenda programação com Python do zero, incluindo estruturas de dados e orientação a objetos.',
    category: 'Programação', thumbnail: '🐍', color: '#0ea5e9',
    teacherId: 'demo-teacher', teacherName: 'Prof. Roberto Lima',
    workload: '45h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lessons: [
      { id: 'l9',  title: 'Introdução ao Python',  duration: '20min', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', pdfUrl: '', description: 'Instalação e primeiros passos.' },
      { id: 'l10', title: 'Variáveis e Tipos',     duration: '25min', videoUrl: 'https://www.youtube.com/embed/cQT33yu9pY8', pdfUrl: '', description: 'Tipos de dados e operações.' },
      { id: 'l11', title: 'Listas e Dicionários',  duration: '30min', videoUrl: 'https://www.youtube.com/embed/W8KRzm-HUcc', pdfUrl: '', description: 'Estruturas de dados em Python.' },
      { id: 'l12', title: 'Funções e Módulos',     duration: '35min', videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I', pdfUrl: '', description: 'Funções, lambdas e módulos.' },
      { id: 'l13', title: 'POO com Python',        duration: '40min', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0', pdfUrl: '', description: 'Classes, herança e polimorfismo.' },
      { id: 'l14', title: 'Projeto Final Python',  duration: '50min', videoUrl: 'https://www.youtube.com/embed/MrjoV14KQ7g', pdfUrl: '', description: 'Aplicação completa em Python.' },
    ],
  },
  {
    id: 'c5', title: 'Banco de Dados com SQL',
    description: 'Domine consultas SQL, modelagem de dados, joins complexos e boas práticas de banco de dados.',
    category: 'Programação', thumbnail: '🗄️', color: '#14b8a6',
    teacherId: 'demo-teacher', teacherName: 'Prof. Marcelo Santos',
    workload: '35h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    lessons: [
      { id: 'l15', title: 'Introdução ao SQL',      duration: '22min', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', pdfUrl: '', description: 'SELECT, INSERT, UPDATE, DELETE.' },
      { id: 'l16', title: 'Joins e Relacionamentos', duration: '35min', videoUrl: 'https://www.youtube.com/embed/9yeOJ0ZMUYw', pdfUrl: '', description: 'INNER JOIN, LEFT JOIN e relações.' },
      { id: 'l17', title: 'Funções de Agregação',   duration: '28min', videoUrl: 'https://www.youtube.com/embed/Yl4NfalHn2Q', pdfUrl: '', description: 'GROUP BY, HAVING, COUNT, SUM.' },
      { id: 'l18', title: 'Modelagem de Dados',     duration: '32min', videoUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc', pdfUrl: '', description: 'Normalização e diagramas ER.' },
    ],
  },
  {
    id: 'c6', title: 'Inteligência Artificial e Machine Learning',
    description: 'Introdução à IA, redes neurais, aprendizado de máquina supervisionado e não-supervisionado.',
    category: 'IA & Machine Learning', thumbnail: '🤖', color: '#a855f7',
    teacherId: 'demo-teacher', teacherName: 'Profa. Juliana Ferreira',
    workload: '50h', level: 'Avançado',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lessons: [
      { id: 'l19', title: 'O que é IA?',                  duration: '18min', videoUrl: 'https://www.youtube.com/embed/2ePf9rue1Ao', pdfUrl: '', description: 'História e conceitos fundamentais.' },
      { id: 'l20', title: 'Machine Learning com Python',  duration: '40min', videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0', pdfUrl: '', description: 'Scikit-learn e primeiros modelos.' },
      { id: 'l21', title: 'Redes Neurais',                duration: '45min', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', pdfUrl: '', description: 'Como funcionam as redes neurais.' },
      { id: 'l22', title: 'Deep Learning',                duration: '50min', videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk', pdfUrl: '', description: 'Modelos de deep learning com TensorFlow.' },
      { id: 'l23', title: 'NLP',                          duration: '42min', videoUrl: 'https://www.youtube.com/embed/X2vAabgKiWM', pdfUrl: '', description: 'Processamento de Linguagem Natural.' },
      { id: 'l24', title: 'Projeto de IA',                duration: '60min', videoUrl: 'https://www.youtube.com/embed/XJ7HLz9VYz0', pdfUrl: '', description: 'Projeto de IA do zero.' },
    ],
  },
  {
    id: 'c7', title: 'Excel e Análise de Dados',
    description: 'Domine o Excel avançado, tabelas dinâmicas, macros VBA e análise de dados empresariais.',
    category: 'Administração', thumbnail: '📊', color: '#f97316',
    teacherId: 'demo-teacher', teacherName: 'Prof. Fernando Oliveira',
    workload: '30h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    lessons: [
      { id: 'l25', title: 'Excel do Zero',        duration: '20min', videoUrl: 'https://www.youtube.com/embed/Vl0H-qTclOg', pdfUrl: '', description: 'Interface e funções básicas.' },
      { id: 'l26', title: 'Fórmulas Avançadas',   duration: '30min', videoUrl: 'https://www.youtube.com/embed/edX_AP7_Pn0', pdfUrl: '', description: 'VLOOKUP, INDEX, MATCH e mais.' },
      { id: 'l27', title: 'Tabelas Dinâmicas',    duration: '35min', videoUrl: 'https://www.youtube.com/embed/9NUjHBNWe9M', pdfUrl: '', description: 'Análise com pivot tables.' },
      { id: 'l28', title: 'Dashboards',           duration: '40min', videoUrl: 'https://www.youtube.com/embed/PSNXoAs2ATE', pdfUrl: '', description: 'Visualizações profissionais.' },
    ],
  },
  {
    id: 'c8', title: 'Inglês para Tecnologia',
    description: 'Aprenda o inglês técnico essencial para TI: documentação, termos técnicos e comunicação.',
    category: 'Idiomas', thumbnail: '🇺🇸', color: '#3b82f6',
    teacherId: 'demo-teacher', teacherName: 'Profa. Camila Rodrigues',
    workload: '40h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lessons: [
      { id: 'l29', title: 'Inglês Técnico Básico',    duration: '25min', videoUrl: 'https://www.youtube.com/embed/4fKeSf9Z2cU', pdfUrl: '', description: 'Vocabulário essencial de TI.' },
      { id: 'l30', title: 'Leitura de Documentação', duration: '30min', videoUrl: 'https://www.youtube.com/embed/8QCKxRqRs8c', pdfUrl: '', description: 'Compreender documentação técnica.' },
      { id: 'l31', title: 'Comunicação em Reuniões', duration: '35min', videoUrl: 'https://www.youtube.com/embed/O4-RmfL8Y8E', pdfUrl: '', description: 'Expressões para meetings.' },
      { id: 'l32', title: 'Emails Profissionais',    duration: '28min', videoUrl: 'https://www.youtube.com/embed/MH_tN-aFXgQ', pdfUrl: '', description: 'Emails em inglês.' },
      { id: 'l33', title: 'LinkedIn em Inglês',      duration: '22min', videoUrl: 'https://www.youtube.com/embed/BcZLeDCNj6I', pdfUrl: '', description: 'Perfil e networking internacional.' },
    ],
  },
  {
    id: 'c9', title: 'Redes de Computadores',
    description: 'Fundamentos de redes, protocolos TCP/IP, segurança, configuração de roteadores e switches.',
    category: 'Infraestrutura', thumbnail: '🌐', color: '#6366f1',
    teacherId: 'demo-teacher', teacherName: 'Prof. André Pereira',
    workload: '38h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    lessons: [
      { id: 'l34', title: 'Fundamentos de Redes', duration: '25min', videoUrl: 'https://www.youtube.com/embed/3QhU9jd03a0', pdfUrl: '', description: 'Modelo OSI, TCP/IP e protocolos.' },
      { id: 'l35', title: 'Endereçamento IP',     duration: '30min', videoUrl: 'https://www.youtube.com/embed/s_gy0B5AKN8', pdfUrl: '', description: 'IPv4, IPv6, sub-redes e CIDR.' },
      { id: 'l36', title: 'Segurança de Redes',  duration: '35min', videoUrl: 'https://www.youtube.com/embed/GvtNyOzGogc', pdfUrl: '', description: 'Firewalls, VPN e proteção.' },
    ],
  },
  {
    id: 'c10', title: 'Marketing Digital',
    description: 'Estratégias de marketing digital, SEO, mídia paga, redes sociais e análise de métricas.',
    category: 'Marketing', thumbnail: '📱', color: '#e11d48',
    teacherId: 'demo-teacher', teacherName: 'Profa. Beatriz Almeida',
    workload: '32h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    lessons: [
      { id: 'l37', title: 'Intro ao Marketing Digital', duration: '20min', videoUrl: 'https://www.youtube.com/embed/e6GlkNq-d4k', pdfUrl: '', description: 'Conceitos e estratégias.' },
      { id: 'l38', title: 'SEO e Conteúdo',             duration: '35min', videoUrl: 'https://www.youtube.com/embed/N8lsFZsOTis', pdfUrl: '', description: 'Otimização para buscadores.' },
      { id: 'l39', title: 'Redes Sociais',              duration: '28min', videoUrl: 'https://www.youtube.com/embed/MmUmVfM3bUw', pdfUrl: '', description: 'Instagram, TikTok e LinkedIn.' },
      { id: 'l40', title: 'Google Ads',                 duration: '32min', videoUrl: 'https://www.youtube.com/embed/ceSsiuNEOSA', pdfUrl: '', description: 'Campanhas pagas e ROI.' },
      { id: 'l41', title: 'Analytics e Métricas',       duration: '25min', videoUrl: 'https://www.youtube.com/embed/gM9-KDl4oaw', pdfUrl: '', description: 'Google Analytics na prática.' },
    ],
  },
  {
    id: 'c11', title: 'Empreendedorismo Digital',
    description: 'Como criar e escalar um negócio digital: validação de ideia, MVP, monetização e crescimento.',
    category: 'Negócios', thumbnail: '🚀', color: '#84cc16',
    teacherId: 'demo-teacher', teacherName: 'Prof. Gustavo Nascimento',
    workload: '28h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    lessons: [
      { id: 'l42', title: 'Mindset Empreendedor',    duration: '18min', videoUrl: 'https://www.youtube.com/embed/Rb9eiMUJyRI', pdfUrl: '', description: 'Mentalidade empreendedora.' },
      { id: 'l43', title: 'Validação de Ideia',      duration: '25min', videoUrl: 'https://www.youtube.com/embed/2tgcGkRqmFk', pdfUrl: '', description: 'Validando sua ideia de negócio.' },
      { id: 'l44', title: 'Criando seu MVP',         duration: '30min', videoUrl: 'https://www.youtube.com/embed/jHyU54GhfGs', pdfUrl: '', description: 'Produto mínimo viável.' },
      { id: 'l45', title: 'Modelos de Monetização', duration: '22min', videoUrl: 'https://www.youtube.com/embed/gRgG7FGMkEs', pdfUrl: '', description: 'SaaS, freemium e marketplace.' },
    ],
  },
  {
    id: 'c12', title: 'Matemática para Programadores',
    description: 'Matemática aplicada à tecnologia: álgebra linear, estatística, probabilidade e lógica.',
    category: 'Exatas', thumbnail: '📐', color: '#ec4899',
    teacherId: 'demo-teacher', teacherName: 'Profa. Larissa Moura',
    workload: '35h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    lessons: [
      { id: 'l46', title: 'Lógica Matemática', duration: '28min', videoUrl: 'https://www.youtube.com/embed/q5R6HkLpLqk', pdfUrl: '', description: 'Proposições e tabelas verdade.' },
      { id: 'l47', title: 'Álgebra Linear',   duration: '35min', videoUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs', pdfUrl: '', description: 'Vetores e matrizes.' },
      { id: 'l48', title: 'Estatística',      duration: '30min', videoUrl: 'https://www.youtube.com/embed/hjZJIVWHnPE', pdfUrl: '', description: 'Média, mediana e desvio padrão.' },
      { id: 'l49', title: 'Probabilidade',    duration: '32min', videoUrl: 'https://www.youtube.com/embed/uzkc-qNVoOk', pdfUrl: '', description: 'Eventos e probabilidade condicional.' },
    ],
  },
  {
    id: 'c13', title: 'Node.js e APIs RESTful',
    description: 'Desenvolvimento backend com Node.js, Express, autenticação JWT e APIs REST.',
    category: 'Programação', thumbnail: '🟢', color: '#22c55e',
    teacherId: 'demo-teacher', teacherName: 'Prof. Diego Costa',
    workload: '42h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    lessons: [
      { id: 'l50', title: 'Node.js Fundamentos', duration: '25min', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4', pdfUrl: '', description: 'Event loop, módulos e npm.' },
      { id: 'l51', title: 'Express.js',          duration: '30min', videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE', pdfUrl: '', description: 'Rotas, middlewares e controllers.' },
      { id: 'l52', title: 'Autenticação JWT',    duration: '40min', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4', pdfUrl: '', description: 'Login seguro com JWT.' },
      { id: 'l53', title: 'API REST Completa',  duration: '55min', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48', pdfUrl: '', description: 'CRUD com boas práticas REST.' },
    ],
  },
  {
    id: 'c14', title: 'TypeScript Completo',
    description: 'JavaScript tipado: tipos, interfaces, generics, decorators e integração com React.',
    category: 'Programação', thumbnail: '💙', color: '#2563eb',
    teacherId: 'demo-teacher', teacherName: 'Prof. Paulo Henrique',
    workload: '38h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
    lessons: [
      { id: 'l54', title: 'Introdução ao TypeScript', duration: '22min', videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs', pdfUrl: '', description: 'Configuração e primeiros tipos.' },
      { id: 'l55', title: 'Tipos e Interfaces',       duration: '30min', videoUrl: 'https://www.youtube.com/embed/ydkQlJhodio', pdfUrl: '', description: 'Type system avançado.' },
      { id: 'l56', title: 'Generics',                 duration: '35min', videoUrl: 'https://www.youtube.com/embed/EcCTIExsqmI', pdfUrl: '', description: 'Tipos genéricos e utility types.' },
      { id: 'l57', title: 'TypeScript com React',    duration: '40min', videoUrl: 'https://www.youtube.com/embed/jrKcJxF0lAU', pdfUrl: '', description: 'Componentes e hooks tipados.' },
    ],
  },
  {
    id: 'c15', title: 'Git e GitHub do Zero ao Pro',
    description: 'Controle de versão com Git, colaboração no GitHub, branches, pull requests e CI/CD.',
    category: 'Programação', thumbnail: '🐙', color: '#f97316',
    teacherId: 'demo-teacher', teacherName: 'Profa. Renata Vieira',
    workload: '20h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    lessons: [
      { id: 'l58', title: 'Git Essentials',         duration: '20min', videoUrl: 'https://www.youtube.com/embed/RGOj5yH7evk', pdfUrl: '', description: 'Init, add, commit, push e pull.' },
      { id: 'l59', title: 'Branches e Merges',      duration: '25min', videoUrl: 'https://www.youtube.com/embed/e2IbNHi4uCI', pdfUrl: '', description: 'Branches e resolução de conflitos.' },
      { id: 'l60', title: 'Colaboração no GitHub', duration: '30min', videoUrl: 'https://www.youtube.com/embed/HbSjyU2vf6Y', pdfUrl: '', description: 'Fork, PR e code review.' },
    ],
  },
  {
    id: 'c16', title: 'Design Gráfico com Canva',
    description: 'Criação de artes visuais, posts para redes sociais, apresentações e materiais gráficos.',
    category: 'Design', thumbnail: '✏️', color: '#a78bfa',
    teacherId: 'demo-teacher', teacherName: 'Profa. Isabela Torres',
    workload: '22h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
    lessons: [
      { id: 'l61', title: 'Canva para Iniciantes', duration: '18min', videoUrl: 'https://www.youtube.com/embed/lKf3liFDlMo', pdfUrl: '', description: 'Interface e recursos gratuitos.' },
      { id: 'l62', title: 'Identidade Visual',     duration: '25min', videoUrl: 'https://www.youtube.com/embed/sByzHoiYFX0', pdfUrl: '', description: 'Criando uma marca visual.' },
      { id: 'l63', title: 'Posts para Redes',      duration: '20min', videoUrl: 'https://www.youtube.com/embed/s9NrFrBIJbo', pdfUrl: '', description: 'Templates para cada plataforma.' },
    ],
  },
  {
    id: 'c17', title: 'Gestão de Projetos com Scrum',
    description: 'Metodologias ágeis, Scrum, Kanban, sprints e gestão eficiente de equipes de desenvolvimento.',
    category: 'Gestão', thumbnail: '📋', color: '#0891b2',
    teacherId: 'demo-teacher', teacherName: 'Prof. Thiago Monteiro',
    workload: '28h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    lessons: [
      { id: 'l64', title: 'Manifesto Ágil',   duration: '20min', videoUrl: 'https://www.youtube.com/embed/Z9QbYZh1YXY', pdfUrl: '', description: 'Princípios do desenvolvimento ágil.' },
      { id: 'l65', title: 'Scrum',            duration: '35min', videoUrl: 'https://www.youtube.com/embed/9TycLR0TqFA', pdfUrl: '', description: 'Papéis, eventos e artefatos.' },
      { id: 'l66', title: 'Kanban',           duration: '28min', videoUrl: 'https://www.youtube.com/embed/iVaFVa7HYj4', pdfUrl: '', description: 'Gestão visual de tarefas.' },
      { id: 'l67', title: 'Ferramentas Ágeis', duration: '25min', videoUrl: 'https://www.youtube.com/embed/y8OnoxKotPQ', pdfUrl: '', description: 'Jira, Trello e Notion.' },
    ],
  },
  {
    id: 'c18', title: 'Cybersegurança Fundamental',
    description: 'Segurança da informação, ameaças cibernéticas, criptografia, LGPD e boas práticas.',
    category: 'Segurança', thumbnail: '🔐', color: '#dc2626',
    teacherId: 'demo-teacher', teacherName: 'Prof. Rodrigo Barros',
    workload: '40h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
    lessons: [
      { id: 'l68', title: 'Ameaças Cibernéticas', duration: '25min', videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA', pdfUrl: '', description: 'Malware, phishing e engenharia social.' },
      { id: 'l69', title: 'Criptografia',         duration: '35min', videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc', pdfUrl: '', description: 'Criptografia simétrica e assimétrica.' },
      { id: 'l70', title: 'LGPD',                 duration: '30min', videoUrl: 'https://www.youtube.com/embed/zHiTfH2LNVk', pdfUrl: '', description: 'Lei Geral de Proteção de Dados.' },
    ],
  },
  {
    id: 'c19', title: 'WordPress e Sites Profissionais',
    description: 'Crie sites profissionais com WordPress, temas, plugins, SEO on-page e loja virtual.',
    category: 'Web', thumbnail: '🌍', color: '#0369a1',
    teacherId: 'demo-teacher', teacherName: 'Profa. Fernanda Gomes',
    workload: '26h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 17).toISOString(),
    lessons: [
      { id: 'l71', title: 'WordPress do Zero',     duration: '22min', videoUrl: 'https://www.youtube.com/embed/jl8F4KMSaas', pdfUrl: '', description: 'Instalação e configurações básicas.' },
      { id: 'l72', title: 'Temas e Personalização', duration: '30min', videoUrl: 'https://www.youtube.com/embed/Ns3kFhDR4-w', pdfUrl: '', description: 'Customizando a aparência.' },
      { id: 'l73', title: 'Plugins Essenciais',    duration: '25min', videoUrl: 'https://www.youtube.com/embed/vPe6r4SaJQg', pdfUrl: '', description: 'SEO, segurança e cache.' },
    ],
  },
  {
    id: 'c20', title: 'Português para o Mercado de Trabalho',
    description: 'Redação profissional, gramática aplicada, comunicação empresarial e textos técnicos.',
    category: 'Linguagem', thumbnail: '✍️', color: '#7c3aed',
    teacherId: 'demo-teacher', teacherName: 'Profa. Silvia Cunha',
    workload: '24h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 19).toISOString(),
    lessons: [
      { id: 'l74', title: 'Gramática Essencial',    duration: '25min', videoUrl: 'https://www.youtube.com/embed/k2VIHoiPJeI', pdfUrl: '', description: 'Regras para comunicação profissional.' },
      { id: 'l75', title: 'Redação Empresarial',    duration: '30min', videoUrl: 'https://www.youtube.com/embed/A_vM2bHr_r8', pdfUrl: '', description: 'Emails, relatórios e comunicados.' },
      { id: 'l76', title: 'Apresentações e Pitches', duration: '28min', videoUrl: 'https://www.youtube.com/embed/3aaJBNFEGRI', pdfUrl: '', description: 'Comunicação oral e escrita.' },
    ],
  },
  {
    id: 'c21', title: 'Docker e Contêineres',
    description: 'Aprenda Docker, Docker Compose, orquestração com Kubernetes e deploy em produção.',
    category: 'DevOps', thumbnail: '🐳', color: '#0284c7',
    teacherId: 'demo-teacher', teacherName: 'Prof. Leonardo Rocha',
    workload: '36h', level: 'Avançado',
    createdAt: new Date(Date.now() - 86400000 * 23).toISOString(),
    lessons: [
      { id: 'l77', title: 'Introdução ao Docker', duration: '25min', videoUrl: 'https://www.youtube.com/embed/Gjnup-PuquQ', pdfUrl: '', description: 'Contêineres e imagens.' },
      { id: 'l78', title: 'Dockerfile',           duration: '30min', videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE', pdfUrl: '', description: 'Construindo imagens customizadas.' },
      { id: 'l79', title: 'Docker Compose',       duration: '35min', videoUrl: 'https://www.youtube.com/embed/SXwC9fSwct8', pdfUrl: '', description: 'Orquestrando múltiplos serviços.' },
    ],
  },
  {
    id: 'c22', title: 'Ciência de Dados com Python',
    description: 'Análise exploratória, visualização de dados, Pandas, NumPy, Matplotlib e Seaborn.',
    category: 'Dados', thumbnail: '📈', color: '#0d9488',
    teacherId: 'demo-teacher', teacherName: 'Profa. Carolina Lima',
    workload: '48h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    lessons: [
      { id: 'l80', title: 'Pandas',                   duration: '35min', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', pdfUrl: '', description: 'DataFrames, filtros e transformações.' },
      { id: 'l81', title: 'Visualização com Matplotlib', duration: '30min', videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4', pdfUrl: '', description: 'Gráficos de dados.' },
      { id: 'l82', title: 'NumPy',                    duration: '25min', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI', pdfUrl: '', description: 'Arrays e operações matemáticas.' },
      { id: 'l83', title: 'Projeto Data Science',     duration: '60min', videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8', pdfUrl: '', description: 'Análise de dataset real.' },
    ],
  },
  {
    id: 'c23', title: 'Desenvolvimento Mobile com React Native',
    description: 'Crie apps para iOS e Android com React Native, Expo e publicação nas lojas.',
    category: 'Mobile', thumbnail: '📲', color: '#6d28d9',
    teacherId: 'demo-teacher', teacherName: 'Prof. Vinicius Souza',
    workload: '45h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lessons: [
      { id: 'l84', title: 'Intro ao React Native',  duration: '22min', videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc', pdfUrl: '', description: 'Expo e estrutura do projeto.' },
      { id: 'l85', title: 'Componentes e Navegação', duration: '35min', videoUrl: 'https://www.youtube.com/embed/nDSCbhWXe4M', pdfUrl: '', description: 'React Navigation e telas.' },
      { id: 'l86', title: 'APIs e Storage',         duration: '30min', videoUrl: 'https://www.youtube.com/embed/x6nIzRFcCHU', pdfUrl: '', description: 'Consumindo APIs e storage local.' },
      { id: 'l87', title: 'Publicação',             duration: '28min', videoUrl: 'https://www.youtube.com/embed/oBWBDaqx8eo', pdfUrl: '', description: 'Google Play e App Store.' },
    ],
  },
  {
    id: 'c24', title: 'Finanças Pessoais e Investimentos',
    description: 'Educação financeira, controle de gastos, tipos de investimentos, renda fixa e variável.',
    category: 'Finanças', thumbnail: '💰', color: '#d97706',
    teacherId: 'demo-teacher', teacherName: 'Prof. Henrique Castro',
    workload: '22h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    lessons: [
      { id: 'l88', title: 'Educação Financeira',  duration: '20min', videoUrl: 'https://www.youtube.com/embed/YiIFbPKFd_I', pdfUrl: '', description: 'Orçamento e controle financeiro.' },
      { id: 'l89', title: 'Tipos de Investimento', duration: '30min', videoUrl: 'https://www.youtube.com/embed/9q-Jb6d-F2o', pdfUrl: '', description: 'Tesouro Direto, CDB e ações.' },
      { id: 'l90', title: 'Planejamento',          duration: '25min', videoUrl: 'https://www.youtube.com/embed/nJLU2bH3D3E', pdfUrl: '', description: 'Reserva de emergência e aposentadoria.' },
    ],
  },
  {
    id: 'c25', title: 'CSS Avançado e Animações',
    description: 'CSS moderno, Flexbox, Grid, variáveis, animações complexas e técnicas avançadas.',
    category: 'Design', thumbnail: '🎯', color: '#e879f9',
    teacherId: 'demo-teacher', teacherName: 'Profa. Natália Braga',
    workload: '30h', level: 'Intermediário',
    createdAt: new Date(Date.now() - 86400000 * 26).toISOString(),
    lessons: [
      { id: 'l91', title: 'Flexbox',       duration: '28min', videoUrl: 'https://www.youtube.com/embed/phWxA89Dy94', pdfUrl: '', description: 'Layout com Flexbox.' },
      { id: 'l92', title: 'CSS Grid',      duration: '32min', videoUrl: 'https://www.youtube.com/embed/jV8B24rSN5o', pdfUrl: '', description: 'Layouts com CSS Grid.' },
      { id: 'l93', title: 'Animações CSS', duration: '35min', videoUrl: 'https://www.youtube.com/embed/YszONjKpgg4', pdfUrl: '', description: 'Keyframes e micro-interações.' },
      { id: 'l94', title: 'CSS Moderno',   duration: '30min', videoUrl: 'https://www.youtube.com/embed/OGJvhpoE8b4', pdfUrl: '', description: 'Custom properties e container queries.' },
    ],
  },
  {
    id: 'c26', title: 'Oratória e Comunicação',
    description: 'Desenvolva comunicação verbal e não-verbal, técnicas de apresentação e liderança.',
    category: 'Soft Skills', thumbnail: '🎤', color: '#f43f5e',
    teacherId: 'demo-teacher', teacherName: 'Prof. Eduardo Prado',
    workload: '20h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 32).toISOString(),
    lessons: [
      { id: 'l95', title: 'Fundamentos da Oratória',    duration: '22min', videoUrl: 'https://www.youtube.com/embed/AykYRO5d_lI', pdfUrl: '', description: 'Técnicas de fala e postura.' },
      { id: 'l96', title: 'Comunicação não-verbal',     duration: '25min', videoUrl: 'https://www.youtube.com/embed/cFLjudWTuGQ', pdfUrl: '', description: 'Linguagem corporal.' },
      { id: 'l97', title: 'Apresentações Impactantes',  duration: '30min', videoUrl: 'https://www.youtube.com/embed/Unzc731iCUY', pdfUrl: '', description: 'Segredo das melhores apresentações.' },
    ],
  },
  {
    id: 'c27', title: 'Power BI para Análise de Dados',
    description: 'Crie dashboards profissionais, relatórios interativos e análises com Power BI.',
    category: 'Dados', thumbnail: '📊', color: '#f59e0b',
    teacherId: 'demo-teacher', teacherName: 'Profa. Mônica Rezende',
    workload: '32h', level: 'Iniciante',
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    lessons: [
      { id: 'l98',  title: 'Introdução ao Power BI',      duration: '22min', videoUrl: 'https://www.youtube.com/embed/yKTSLffVGbk', pdfUrl: '', description: 'Interface e importação de dados.' },
      { id: 'l99',  title: 'DAX e Medidas',               duration: '35min', videoUrl: 'https://www.youtube.com/embed/H3FKVp25fH8', pdfUrl: '', description: 'Fórmulas DAX avançadas.' },
      { id: 'l100', title: 'Dashboards Profissionais',    duration: '40min', videoUrl: 'https://www.youtube.com/embed/AGrl-H87pRU', pdfUrl: '', description: 'Visualizações e relatórios.' },
      { id: 'l101', title: 'Publicação e Compartilhamento', duration: '25min', videoUrl: 'https://www.youtube.com/embed/KlJ3SLZF2e4', pdfUrl: '', description: 'Power BI Service.' },
    ],
  },
]

function readCourses() {
  try {
    const stored = JSON.parse(localStorage.getItem(COURSES_KEY))
    if (!stored || stored.length === 0) {
      localStorage.setItem(COURSES_KEY, JSON.stringify(DEMO_COURSES))
      return DEMO_COURSES
    }
    const storedIds = new Set(stored.map(c => c.id))
    const missing = DEMO_COURSES.filter(c => !storedIds.has(c.id))
    if (missing.length > 0) {
      const merged = [...stored, ...missing]
      localStorage.setItem(COURSES_KEY, JSON.stringify(merged))
      return merged
    }
    return stored
  } catch { return DEMO_COURSES }
}

function readProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }
function saveCourses(c)  { localStorage.setItem(COURSES_KEY, JSON.stringify(c)) }

export function CoursesProvider({ children }) {
  const [courses, setCourses]   = useState([])
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setCourses(readCourses())
    setProgress(readProgress())
  }, [])

  function getLessonsDone(userId, courseId) {
    return progress[userId]?.[courseId]?.completedLessons || []
  }

  function getProgress(userId, courseId) {
    const course = courses.find(c => c.id === courseId)
    if (!course || !course.lessons.length) return 0
    const done = getLessonsDone(userId, courseId)
    return Math.round((done.length / course.lessons.length) * 100)
  }

  function markLesson(userId, courseId, lessonId) {
    setProgress(prev => {
      const next = { ...prev }
      if (!next[userId]) next[userId] = {}
      if (!next[userId][courseId]) next[userId][courseId] = { completedLessons: [] }
      const done = next[userId][courseId].completedLessons
      if (!done.includes(lessonId)) next[userId][courseId].completedLessons = [...done, lessonId]
      saveProgress(next)
      return next
    })
  }

  function addCourse(course) {
    const next = [{ ...course, id: crypto.randomUUID(), createdAt: new Date().toISOString(), lessons: [] }, ...courses]
    saveCourses(next); setCourses(next)
    return next[0]
  }

  function updateCourse(id, data) {
    const next = courses.map(c => c.id === id ? { ...c, ...data } : c)
    saveCourses(next); setCourses(next)
  }

  function deleteCourse(id) {
    const next = courses.filter(c => c.id !== id)
    saveCourses(next); setCourses(next)
  }

  function addLesson(courseId, lesson) {
    const next = courses.map(c =>
      c.id === courseId ? { ...c, lessons: [...c.lessons, { ...lesson, id: crypto.randomUUID() }] } : c
    )
    saveCourses(next); setCourses(next)
  }

  function deleteLesson(courseId, lessonId) {
    const next = courses.map(c =>
      c.id === courseId ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) } : c
    )
    saveCourses(next); setCourses(next)
  }

  function getStudents() {
    try {
      const users = JSON.parse(localStorage.getItem('edulivre_users_v1') || '[]')
      return users.filter(u => u.role === 'student')
    } catch { return [] }
  }

  return (
    <CoursesContext.Provider value={{
      courses, progress, getLessonsDone, getProgress,
      markLesson, addCourse, updateCourse, deleteCourse,
      addLesson, deleteLesson, getStudents,
    }}>
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses() {
  const ctx = useContext(CoursesContext)
  if (!ctx) throw new Error('useCourses must be inside CoursesProvider')
  return ctx
}
