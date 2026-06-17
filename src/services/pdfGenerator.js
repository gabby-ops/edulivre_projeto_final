/**
 * EduLivre — PDF Generator v3
 * Certificado: fundo escuro marcante, textos brancos/coloridos bem visíveis
 * Resumo: sem caracteres corrompidos, conteúdo rico
 */

import { jsPDF } from 'jspdf'

// ── Normaliza acentos para jsPDF (helvetica não suporta UTF-8 extra) ──
function n(str) {
  if (!str) return ''
  return String(str)
    .replace(/[àáâãä]/g,'a').replace(/[ÀÁÂÃÄ]/g,'A')
    .replace(/[èéêë]/g,'e').replace(/[ÈÉÊË]/g,'E')
    .replace(/[ìíîï]/g,'i').replace(/[ÌÍÎÏ]/g,'I')
    .replace(/[òóôõö]/g,'o').replace(/[ÒÓÔÕÖ]/g,'O')
    .replace(/[ùúûü]/g,'u').replace(/[ÙÚÛÜ]/g,'U')
    .replace(/ç/g,'c').replace(/Ç/g,'C')
    .replace(/ñ/g,'n').replace(/Ñ/g,'N')
    .replace(/[\u2014\u2013]/g,'-')
    .replace(/[\u201c\u201d\u201e]/g,'"')
    .replace(/[\u2018\u2019]/g,"'")
    .replace(/[^\x00-\xFF]/g,'')
}

function sf(doc, style) {
  try { doc.setFont('helvetica', style) } catch(e) { doc.setFont('helvetica','normal') }
}

function txt(doc, text, x, y, size, color, style='normal', align='left') {
  doc.setFontSize(size)
  doc.setTextColor(...color)
  sf(doc, style)
  doc.text(n(text), x, y, { align })
}

function fill(doc, x, y, w, h, color) {
  doc.setFillColor(...color)
  doc.rect(x, y, w, h, 'F')
}

function rrect(doc, x, y, w, h, r, fc, sc) {
  if (fc) doc.setFillColor(...fc)
  if (sc) doc.setDrawColor(...sc)
  doc.roundedRect(x, y, w, h, r, r, fc && sc ? 'FD' : fc ? 'F' : 'D')
}

function hline(doc, x1, x2, y, color, lw=0.3) {
  doc.setDrawColor(...color)
  doc.setLineWidth(lw)
  doc.line(x1, y, x2, y)
}

// Linha degradê roxo → verde
function gline(doc, x1, x2, y, lw=1) {
  const steps = 50
  const sw = (x2-x1)/steps
  for (let i=0; i<steps; i++) {
    const t = i/(steps-1)
    doc.setDrawColor(
      Math.round(139+(16-139)*t),
      Math.round(92+(185-92)*t),
      Math.round(246+(129-246)*t)
    )
    doc.setLineWidth(lw)
    doc.line(x1+sw*i, y, x1+sw*(i+1), y)
  }
}

// ══════════════════════════════════════════════════════════════
// CERTIFICADO — A4 PAISAGEM, FUNDO ESCURO MARCANTE
// ══════════════════════════════════════════════════════════════
export function generateCertificatePDF({ studentName, courseName, workload, teacherName, date, certId }) {
  try {
    const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' })
    const W=297, H=210, P=12

    // ── 1. Fundo principal — roxo escuro profundo ─────────────
    doc.setFillColor(8, 5, 28)
    doc.rect(0, 0, W, H, 'F')

    // ── 2. Card interno — azul-roxo escuro ───────────────────
    doc.setFillColor(14, 10, 40)
    doc.roundedRect(P, P, W-P*2, H-P*2, 6, 6, 'F')

    // ── 3. Borda externa roxo vivo ────────────────────────────
    doc.setDrawColor(120, 60, 240)
    doc.setLineWidth(0.8)
    doc.roundedRect(P, P, W-P*2, H-P*2, 6, 6, 'D')

    // ── 4. Faixa lateral esquerda — gradiente vertical ────────
    // Roxa sólida (jsPDF não tem gradiente nativo em rect)
    doc.setFillColor(100, 40, 220)
    doc.roundedRect(P, P, 6, H-P*2, 6, 6, 'F')
    doc.setFillColor(14, 10, 40)
    doc.rect(P+4, P, 4, H-P*2, 'F') // cobre canto direito da faixa

    // ── 5. Faixa lateral direita — verde ─────────────────────
    doc.setFillColor(10, 160, 100)
    doc.roundedRect(W-P-6, P, 6, H-P*2, 6, 6, 'F')
    doc.setFillColor(14, 10, 40)
    doc.rect(W-P-6, P, 4, H-P*2, 'F')

    // ── 6. Círculos decorativos de fundo ─────────────────────
    // Canto sup-dir: círculo roxo grande
    doc.setFillColor(60, 20, 140)
    doc.circle(W-P-10, P+8, 55, 'F')
    doc.setFillColor(14, 10, 40)
    doc.circle(W-P-10, P+8, 44, 'F')   // vazio interno

    // Canto inf-esq: círculo verde
    doc.setFillColor(8, 100, 60)
    doc.circle(P+10, H-P-8, 45, 'F')
    doc.setFillColor(14, 10, 40)
    doc.circle(P+10, H-P-8, 36, 'F')   // vazio interno

    // ── 7. Header ─────────────────────────────────────────────
    doc.setFillColor(22, 16, 60)
    doc.roundedRect(P+8, P+6, W-P*2-16, 26, 4, 4, 'F')
    hline(doc, P+8, W-P-8, P+32, [100, 40, 220], 0.5)

    // Logo box
    doc.setFillColor(100, 40, 220)
    doc.roundedRect(P+14, P+10, 16, 16, 3, 3, 'F')
    txt(doc, 'EDU', P+22, P+20.5, 7, [255,255,255], 'bold', 'center')

    txt(doc, 'EduLivre',                          P+34, P+18,  14, [255,255,255], 'bold')
    txt(doc, 'PLATAFORMA EAD | PROJETO DE EXTENSAO UNIVERSITARIA',
                                                  P+34, P+25,   6, [160,140,210])

    // Badge direito
    doc.setFillColor(30, 20, 70)
    doc.roundedRect(W-P-76, P+10, 68, 11, 5, 5, 'F')
    doc.setDrawColor(120, 60, 240)
    doc.setLineWidth(0.5)
    doc.roundedRect(W-P-76, P+10, 68, 11, 5, 5, 'D')
    txt(doc, 'CERTIFICADO OFICIAL DE CONCLUSAO', W-P-42, P+17, 6, [196,181,253], 'bold', 'center')

    // ── 8. Corpo central ──────────────────────────────────────
    const CY = P + 40

    // Cinco pontos dourados
    txt(doc, '* * * * *', W/2, CY+5, 12, [245,158,11], 'bold', 'center')

    // Tag verde
    txt(doc, 'CERTIFICADO DE CONCLUSAO DE CURSO', W/2, CY+14, 7.5, [52,211,153], 'bold', 'center')

    // Título grande — branco puro e bold
    txt(doc, 'Certificado de Conclusao', W/2, CY+26, 26, [255,255,255], 'bold', 'center')

    // Linha degradê
    gline(doc, W/2-45, W/2+45, CY+31, 1.2)

    // Certificamos que — cinza claro
    txt(doc, 'Certificamos que', W/2, CY+40, 9.5, [180,165,230], 'italic', 'center')

    // Nome do aluno — roxo luminoso GRANDE e bem visível
    doc.setFontSize(30)
    doc.setTextColor(210, 190, 255)  // roxo claro luminoso
    sf(doc, 'bold')
    doc.text(n(studentName), W/2, CY+54, { align:'center' })

    // Separador
    hline(doc, W/2-40, W/2+40, CY+58, [100,40,220], 0.4)

    // concluiu com exito
    txt(doc, 'concluiu com exito o curso', W/2, CY+65, 9.5, [160,145,210], 'normal', 'center')

    // Nome do curso — branco com boa visibilidade
    doc.setFontSize(15)
    doc.setTextColor(235, 230, 255)
    sf(doc, 'bold')
    const cLines = doc.splitTextToSize(n(courseName), 200)
    doc.text(cLines, W/2, CY+74, { align:'center' })

    // ── 9. Grid de metadados ─────────────────────────────────
    const GY = CY + 84, GH = 24
    doc.setFillColor(20, 14, 55)
    doc.roundedRect(P+8, GY, W-P*2-16, GH, 4, 4, 'F')
    doc.setDrawColor(80, 40, 180)
    doc.setLineWidth(0.3)
    doc.roundedRect(P+8, GY, W-P*2-16, GH, 4, 4, 'D')

    const gW = (W-P*2-16)/4
    const gX = P+8
    const meta = [
      { label:'DATA DE CONCLUSAO', value: n(date) },
      { label:'CARGA HORARIA',     value: n(workload||'30h') },
      { label:'PROFESSOR',         value: n((teacherName||'EduLivre').split(' ').slice(0,2).join(' ')) },
      { label:'CONCLUSAO',         value: '100%' },
    ]
    meta.forEach(({ label, value }, i) => {
      const cx = gX + gW*i + gW/2
      if (i>0) {
        doc.setDrawColor(80, 40, 180)
        doc.setLineWidth(0.2)
        doc.line(gX+gW*i, GY+4, gX+gW*i, GY+GH-4)
      }
      txt(doc, label, cx, GY+9,  5.5, [130,110,200], 'bold',   'center')
      txt(doc, value, cx, GY+18, 10,  [255,255,255], 'bold',   'center')
    })

    // ── 10. Rodapé com assinaturas ────────────────────────────
    const FY = GY + GH + 6
    hline(doc, P+8, W-P-8, FY, [80,40,180], 0.3)

    const s1x = P + 60
    hline(doc, s1x-30, s1x+30, FY+11, [160,140,200], 0.6)
    txt(doc, n(teacherName||'Equipe EduLivre'), s1x, FY+15.5, 8.5, [220,215,245], 'bold',   'center')
    txt(doc, 'Professor Responsavel',           s1x, FY+20,   6.5, [130,110,180], 'normal', 'center')

    const s2x = W/2
    hline(doc, s2x-38, s2x+38, FY+11, [160,140,200], 0.6)
    txt(doc, 'EduLivre - Plataforma EAD',             s2x, FY+15.5, 8.5, [220,215,245], 'bold',   'center')
    txt(doc, 'Projeto de Extensao Universitaria',      s2x, FY+20,   6.5, [130,110,180], 'normal', 'center')

    // QR simulado
    const qrX = W-P-44, qrY = FY+2
    doc.setFillColor(22, 16, 60)
    doc.roundedRect(qrX, qrY, 24, 20, 3, 3, 'F')
    doc.setDrawColor(100, 40, 220)
    doc.setLineWidth(0.5)
    doc.roundedRect(qrX, qrY, 24, 20, 3, 3, 'D')
    // pixels do QR
    const pts = [[0,0],[2,0],[4,0],[0,2],[4,2],[0,4],[2,4],[4,4],[2,2],[6,6],[8,6],[6,8],[8,8],[10,6],[10,8]]
    pts.forEach(([dx,dy]) => {
      doc.setFillColor(160, 100, 255)
      doc.rect(qrX+2.5+dx*1.3, qrY+3+dy*1.1, 1.1, 0.95, 'F')
    })
    txt(doc, 'VALIDAR', qrX+12, qrY+24, 5.5, [130,110,180], 'normal', 'center')

    // ── 11. Borda interna verde sutil ─────────────────────────
    doc.setDrawColor(16, 160, 100)
    doc.setLineWidth(0.2)
    doc.roundedRect(P+2.5, P+2.5, W-P*2-5, H-P*2-5, 5, 5, 'D')

    // ── 12. ID ────────────────────────────────────────────────
    txt(doc, 'ID: '+n(certId)+'  |  Emitido em '+n(date)+'  |  edulivre.app/validar/'+n(certId),
        W/2, H-P+5, 5.5, [80,65,130], 'normal', 'center')

    doc.save('Certificado_'+n(courseName).replace(/[\s\/\\:*?"<>|]+/g,'_')+'.pdf')

  } catch(err) {
    console.error('Erro ao gerar certificado:', err)
    throw err
  }
}

// ══════════════════════════════════════════════════════════════
// BANCO DE RESUMOS
// ══════════════════════════════════════════════════════════════
export const LESSON_SUMMARIES = {
  l1: {
    title:'O que e React',
    content:[
      {type:'h1', text:'Introducao ao React'},
      {type:'info', items:['Biblioteca criada pelo Facebook (Meta) em 2013','Foco na camada de visualizacao (UI) — nao e um framework completo','A mais usada no mundo para frontend em 2024']},
      {type:'h2', text:'O que e React?'},
      {type:'p', text:'React e uma biblioteca JavaScript para construir interfaces de usuario de forma eficiente e componentizada. Diferente de um framework completo, React cuida apenas da camada de visualizacao da aplicacao, sendo extremamente flexivel para integrar com outras solucoes.'},
      {type:'h2', text:'Por que usar React?'},
      {type:'ul', items:['Componentizacao: a interface e dividida em pecas reutilizaveis','Virtual DOM: apenas o que mudou e re-renderizado, muito mais rapido','Fluxo unidirecional: dados fluem de pai para filho, facil de depurar','Ecossistema enorme: milhares de bibliotecas compativeis (Next.js, React Native...)','Alta demanda no mercado: salarios acima da media']},
      {type:'h2', text:'Virtual DOM — como funciona?'},
      {type:'p', text:'Quando o estado muda, React cria uma copia virtual do DOM (Virtual DOM), compara com o estado anterior usando o algoritmo de reconciliation e aplica APENAS as diferencas necessarias no DOM real. Resultado: interface muito mais rapida.'},
      {type:'h2', text:'JSX — JavaScript + HTML juntos'},
      {type:'code', text:'// JSX permite escrever HTML dentro do JavaScript\nfunction Saudacao({ nome }) {\n  return (\n    <div className="container">\n      <h1>Ola, {nome}!</h1>\n      <p>Bem-vindo ao React.</p>\n    </div>\n  )\n}\n\n// Usando o componente:\n<Saudacao nome="Ana" />'},
      {type:'h2', text:'Pontos-Chave da Aula'},
      {type:'ul', items:['React e uma BIBLIOTECA, nao um framework completo','Todo componente React retorna JSX (HTML dentro do JS)','Use className em vez de class (class e palavra reservada no JS)','Expressoes JS dentro do JSX usam chaves: {variavel}','Componentes SEMPRE comecam com letra maiuscula: <MeuComponente />']},
      {type:'tip', text:'Instale a extensao "ES7+ React/Redux/React-Native snippets" no VS Code para atalhos como rafce (cria componente funcional com exportacao em 1 segundo).'},
    ]
  },
  l2: {
    title:'Componentes e Props',
    content:[
      {type:'h1', text:'Componentes e Props'},
      {type:'info', items:['Componentes sao os blocos fundamentais do React','Props permitem comunicacao de pai para filho','Componentes devem ter responsabilidade unica (principio SOLID)']},
      {type:'h2', text:'O que sao Componentes?'},
      {type:'p', text:'Componentes sao funcoes que recebem dados (props) e retornam JSX. Funcionam como pecas de LEGO: podem ser reutilizados em qualquer parte da aplicacao. Um botao, um card, um formulario, uma navbar — cada um pode ser um componente independente.'},
      {type:'h2', text:'Props — passando dados entre componentes'},
      {type:'code', text:'// Definindo o componente\nfunction CartaoCurso({ titulo, professor, duracao, nivel }) {\n  return (\n    <div className="card">\n      <h2>{titulo}</h2>\n      <p>Prof: {professor}</p>\n      <span>{duracao} | Nivel: {nivel}</span>\n    </div>\n  )\n}\n\n// Usando com diferentes dados:\n<CartaoCurso titulo="React Avancado" professor="Carlos" duracao="40h" nivel="Intermediario" />\n<CartaoCurso titulo="Python Basico"  professor="Ana"    duracao="20h" nivel="Iniciante"    />'},
      {type:'h2', text:'Props vs State — diferencas fundamentais'},
      {type:'table', headers:['Caracteristica','Props','State'], rows:[
        ['Quem controla','Componente pai','O proprio componente'],
        ['Pode mudar?','Nao (somente leitura)','Sim (com useState)'],
        ['Quando usar','Passar dados para filhos','Dados que mudam na tela'],
        ['Onde vive','Vem de fora','Interno ao componente'],
      ]},
      {type:'h2', text:'Boas Praticas com Props'},
      {type:'ul', items:['Sempre desestruture: ({ nome }) em vez de (props) — mais legivel','Use valores padrao: function Card({ cor = "roxo" }) { ... }','Prefira componentes pequenos com uma unica responsabilidade','Nomeie props de forma clara e descritiva (evite: x, d, v...)','Use TypeScript para validar tipos automaticamente em projetos maiores']},
      {type:'tip', text:'Regra de ouro: se dois componentes irmaos precisam do mesmo dado, ele deve subir para o componente pai comum. Isso e chamado de State Lifting (elevar estado).'},
    ]
  },
  l3: {
    title:'State e Hooks',
    content:[
      {type:'h1', text:'State e Hooks no React'},
      {type:'info', items:['Hooks foram introduzidos no React 16.8 (2019)','Permitem usar estado em componentes funcionais','Os mais usados: useState, useEffect, useContext, useRef, useMemo']},
      {type:'h2', text:'O que e State (Estado)?'},
      {type:'p', text:'State e a memoria interna de um componente. Quando o state muda, React re-renderiza automaticamente o componente com os novos dados. E assim que a interface reage as acoes do usuario — dai o nome React.'},
      {type:'h2', text:'useState — o Hook mais importante'},
      {type:'code', text:'import { useState } from "react"\n\nfunction Contador() {\n  const [count, setCount] = useState(0)  // valor inicial: 0\n\n  return (\n    <div>\n      <h2>Contagem: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(prev => prev - 1)}>-1</button>\n      <button onClick={() => setCount(0)}>Zerar</button>\n    </div>\n  )\n}'},
      {type:'h2', text:'useEffect — efeitos colaterais'},
      {type:'p', text:'useEffect executa codigo apos a renderizacao. Use para buscar dados de APIs, iniciar timers, escutar eventos do DOM, etc.'},
      {type:'code', text:'useEffect(() => {\n  // Executa sempre que "userId" mudar\n  fetch(`/api/user/${userId}`)\n    .then(r => r.json())\n    .then(data => setUser(data))\n\n  // Cleanup: executado ao desmontar o componente\n  return () => console.log("limpeza executada")\n}, [userId])  // array de dependencias'},
      {type:'h2', text:'Todos os Hooks essenciais'},
      {type:'table', headers:['Hook','Para que serve','Exemplo practico'], rows:[
        ['useState','Estado local','formularios, contadores, toggles'],
        ['useEffect','Efeitos colaterais','buscar API, timers, subscricoes'],
        ['useContext','Estado global','tema, usuario logado, idioma'],
        ['useRef','Referencia ao DOM','focar input, scroll, stopwatch'],
        ['useMemo','Memoizar calculos','filtrar listas grandes'],
        ['useCallback','Memoizar funcoes','evitar re-renders desnecessarios'],
        ['useReducer','Estado complexo','carrinhos, formularios grandes'],
      ]},
      {type:'h2', text:'Regras dos Hooks (obrigatorias)'},
      {type:'ul', items:['Chame hooks SEMPRE no nivel superior do componente — nunca condicionalmente','NUNCA dentro de if, for, while ou funcoes aninhadas','So use em componentes funcionais React ou custom hooks','Sempre nomeie custom hooks com "use": useFetch, useAuth, useDebounce']},
      {type:'tip', text:'Crie custom hooks para reutilizar logica entre componentes. Ex: useFetch(url) que retorna { data, loading, error } pode ser usado em qualquer componente da aplicacao.'},
    ]
  },
  l9: {
    title:'Introducao ao Python',
    content:[
      {type:'h1', text:'Introducao ao Python'},
      {type:'info', items:['Criada por Guido van Rossum em 1991','3a linguagem mais popular do mundo (Stack Overflow 2024)','Usada por Google, Netflix, Instagram, NASA e muitas outras']},
      {type:'h2', text:'O que e Python?'},
      {type:'p', text:'Python e uma linguagem de alto nivel com sintaxe proxima do ingles, extremamente versatil: Ciencia de Dados, Inteligencia Artificial, desenvolvimento web (Django, FastAPI), automacao de tarefas, scripts e muito mais.'},
      {type:'h2', text:'Por que aprender Python?'},
      {type:'ul', items:['Sintaxe simples e legivel — facil para iniciantes','Versatil: web, dados, IA, automacao, jogos, ciencia','Mercado aquecido: alta demanda, bons salarios','Comunidade enorme: PyPI tem mais de 450.000 pacotes','Excelente para prototipagem rapida e producao']},
      {type:'h2', text:'Hello World e primeiros passos'},
      {type:'code', text:'# Primeiro programa em Python\nprint("Ola, Mundo!")\n\n# Lendo entrada do usuario\nnome = input("Qual e o seu nome? ")\nprint(f"Bem-vindo, {nome}!")\n\n# f-strings: interpolacao moderna\nidade = 25\nprint(f"Em 10 anos voce tera {idade + 10} anos.")'},
      {type:'h2', text:'Tipos de dados em Python'},
      {type:'table', headers:['Tipo','Exemplo','Descricao'], rows:[
        ['int','42','Numeros inteiros'],
        ['float','3.14','Numeros decimais'],
        ['str','"texto"','Texto (string)'],
        ['bool','True / False','Verdadeiro ou falso'],
        ['list','[1, 2, 3]','Lista ordenada e mutavel'],
        ['tuple','(1, 2, 3)','Lista imutavel'],
        ['dict','{"a": 1}','Pares chave:valor'],
        ['set','{1, 2, 3}','Conjunto sem duplicatas'],
      ]},
      {type:'h2', text:'Indentacao — regra fundamental'},
      {type:'p', text:'Em Python, a indentacao (espacos) define os blocos de codigo. Diferente de outras linguagens que usam chaves {}, Python usa 4 espacos por nivel — isso e obrigatorio.'},
      {type:'code', text:'# CORRETO: 4 espacos por nivel\nif True:\n    print("Bloco do if")\n    if True:\n        print("Bloco aninhado")\nprint("Fora do bloco")\n\n# ERRADO: gera IndentationError\nif True:\nprint("Isso causa erro!")'},
      {type:'tip', text:'Configure o VS Code com Tab Size = 4 e Insert Spaces = true para Python. Nunca misture TABs e espacos no mesmo arquivo.'},
    ]
  },
  l15: {
    title:'Introducao ao SQL',
    content:[
      {type:'h1', text:'Introducao ao SQL'},
      {type:'info', items:['SQL = Structured Query Language','Padrao para bancos de dados relacionais desde 1986 (ISO)','Usado em MySQL, PostgreSQL, SQLite, SQL Server, Oracle']},
      {type:'h2', text:'O que e SQL?'},
      {type:'p', text:'SQL e a linguagem padrao para trabalhar com bancos de dados relacionais. Permite criar tabelas, inserir, buscar, atualizar e deletar dados. E uma habilidade essencial para desenvolvedores back-end, analistas de dados e cientistas de dados.'},
      {type:'h2', text:'Os 4 comandos CRUD'},
      {type:'code', text:'-- CREATE: inserir novo registro\nINSERT INTO alunos (nome, email, curso)\nVALUES ("Maria Silva", "maria@email.com", "React");\n\n-- READ: buscar dados\nSELECT nome, email FROM alunos\nWHERE curso = "React"\nORDER BY nome ASC\nLIMIT 10;\n\n-- UPDATE: alterar registro existente\nUPDATE alunos\nSET email = "novo@email.com"\nWHERE id = 1;\n\n-- DELETE: remover registro\nDELETE FROM alunos WHERE id = 1;'},
      {type:'h2', text:'Criando tabelas'},
      {type:'code', text:'CREATE TABLE cursos (\n  id         INT PRIMARY KEY AUTO_INCREMENT,\n  titulo     VARCHAR(200) NOT NULL,\n  categoria  VARCHAR(100),\n  professor  VARCHAR(150),\n  carga_hora INT DEFAULT 30,\n  nivel      ENUM("Basico","Intermediario","Avancado"),\n  criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP\n);'},
      {type:'h2', text:'Clausulas e funcoes essenciais'},
      {type:'table', headers:['Clausula','O que faz','Exemplo'], rows:[
        ['WHERE','Filtra resultados','WHERE nota > 7'],
        ['ORDER BY','Ordena resultados','ORDER BY nome ASC'],
        ['LIMIT','Limita quantidade','LIMIT 10'],
        ['DISTINCT','Remove duplicatas','SELECT DISTINCT cidade'],
        ['COUNT(*)','Conta registros','SELECT COUNT(*) FROM alunos'],
        ['AVG()','Calcula media','SELECT AVG(nota)'],
        ['SUM()','Soma valores','SELECT SUM(carga_hora)'],
        ['JOIN','Une tabelas','JOIN cursos ON curso_id = cursos.id'],
      ]},
      {type:'tip', text:'Use ferramentas graficas como DBeaver (gratuito) ou TablePlus para visualizar e editar bancos de dados sem precisar digitar SQL o tempo todo.'},
    ]
  },
  l58: {
    title:'Git Essentials',
    content:[
      {type:'h1', text:'Git e GitHub — O Essencial'},
      {type:'info', items:['Git foi criado por Linus Torvalds em 2005','Sistema de controle de versao distribuido mais usado no mundo','GitHub hospeda mais de 420 milhoes de repositorios publicos']},
      {type:'h2', text:'O que e Git?'},
      {type:'p', text:'Git e um sistema de controle de versao distribuido. Registra todas as alteracoes no codigo, permite voltar a versoes anteriores, trabalhar em equipe sem conflitos e manter um historico completo do projeto.'},
      {type:'h2', text:'Comandos fundamentais'},
      {type:'code', text:'git init                     # Iniciar repositorio\ngit status                   # Ver arquivos modificados\ngit add .                    # Adicionar tudo ao stage\ngit add arquivo.js           # Adicionar arquivo especifico\ngit commit -m "feat: login"  # Salvar com mensagem\ngit push origin main         # Enviar para o GitHub\ngit pull origin main         # Baixar atualizacoes\ngit log --oneline            # Ver historico resumido\ngit diff                     # Ver o que mudou'},
      {type:'h2', text:'Ciclo de vida dos arquivos'},
      {type:'table', headers:['Estado','Descricao','Como chegar'], rows:[
        ['Untracked','Arquivo novo, Git nao rastreia','Criar um novo arquivo'],
        ['Staged','Pronto para commit','git add arquivo'],
        ['Committed','Salvo no historico','git commit -m "mensagem"'],
        ['Modified','Alterado apos ultimo commit','Editar um arquivo existente'],
      ]},
      {type:'h2', text:'Mensagens de commit — Conventional Commits'},
      {type:'ul', items:['feat: nova funcionalidade — ex: feat: adiciona tela de login','fix: correcao de bug — ex: fix: valida formato do email','docs: documentacao — ex: docs: atualiza README com instrucoes','style: formatacao sem mudar logica — ex: style: corrige identacao','refactor: refatoracao — ex: refactor: extrai logica para servico','test: adicionar testes — ex: test: cria testes para authService']},
      {type:'tip', text:'Configure: git config --global user.name "Seu Nome" e git config --global user.email "seu@email.com" antes do primeiro commit.'},
    ]
  },
  l59: {
    title:'Branches e Merges',
    content:[
      {type:'h1', text:'Branches e Merges no Git'},
      {type:'info', items:['Branch = linha independente de desenvolvimento','Permite trabalhar em features sem afetar o codigo principal','Fluxo padrao: branch > commit > pull request > merge']},
      {type:'h2', text:'O que e uma Branch?'},
      {type:'p', text:'Uma branch (ramificacao) e uma copia isolada do codigo principal. Permite desenvolver novas funcionalidades ou corrigir bugs sem afetar a branch main. Apos finalizar, faz-se o merge de volta.'},
      {type:'h2', text:'Comandos de branches'},
      {type:'code', text:'# Criar e mudar para nova branch\ngit checkout -b feat/login\ngit switch -c feat/login       # Forma moderna\n\n# Listar branches\ngit branch                     # Locais\ngit branch -a                  # Locais + remotas\n\n# Trocar de branch\ngit switch main\n\n# Merge: juntar na main\ngit checkout main\ngit merge feat/login\n\n# Deletar apos merge\ngit branch -d feat/login'},
      {type:'h2', text:'Resolvendo conflitos'},
      {type:'code', text:'# Conflito aparece assim no arquivo:\n<<<<<<< HEAD (seu codigo)\nconsole.log("versao A")\n=======\nconsole.log("versao B")\n>>>>>>> feat/login\n\n# Resolva: escolha uma versao e remova os marcadores\nconsole.log("versao final escolhida")\n# Depois: git add . && git commit -m "fix: resolve conflito"'},
      {type:'h2', text:'GitHub Flow — fluxo recomendado'},
      {type:'ul', items:['1. Crie branch para cada feature: git switch -c feat/nome','2. Desenvolva e faca commits frequentes com mensagens claras','3. Envie: git push origin feat/nome','4. Abra Pull Request no GitHub para revisao do time','5. Aguarde aprovacao e faca o merge','6. Delete a branch: git branch -d feat/nome']},
      {type:'tip', text:'Use "git stash" para salvar trabalho em andamento sem commitar. Util quando precisa trocar de branch urgentemente: git stash / git switch main / git stash pop.'},
    ]
  },
}

// ── Helpers do resumo ─────────────────────────────────────────

function getSummaryContent(lessonId, lesson, course) {
  if (LESSON_SUMMARIES[lessonId]) return LESSON_SUMMARIES[lessonId].content
  return [
    {type:'h1', text:n(lesson.title)},
    {type:'h2', text:'Sobre esta Aula'},
    {type:'p',  text:'Esta aula faz parte do curso "'+n(course.title)+'" ('+n(course.category)+'). '+n(lesson.description||'')},
    {type:'h2', text:'Informacoes'},
    {type:'ul',  items:['Curso: '+n(course.title),'Categoria: '+n(course.category),'Professor: '+n(course.teacherName||'EduLivre'),'Duracao: '+n(lesson.duration||'N/A'),'Carga horaria: '+n(course.workload||'N/A')]},
    {type:'h2', text:'Como aprofundar'},
    {type:'ul',  items:['Reveja o video da aula','Pratique os exercicios propostos','Participe do forum da plataforma','Faca o quiz da aula','Consulte a documentacao oficial']},
    {type:'tip', text:'Pratique criando um pequeno projeto pessoal com o conteudo desta aula. A pratica e a melhor forma de fixar o aprendizado.'},
  ]
}

function renderBlock(doc, block, x, y, cW) {
  const lh = { p:5.4, li:5.3, code:4.6 }

  switch(block.type) {
    case 'h1': {
      doc.setFontSize(18); doc.setTextColor(20,20,45); sf(doc,'bold')
      const ll = doc.splitTextToSize(n(block.text), cW)
      doc.text(ll, x, y)
      return y + ll.length*7.5 + 2
    }
    case 'h2': {
      doc.setFillColor(139,92,246); doc.rect(x, y-4, 3, 7,'F')
      doc.setFontSize(12); doc.setTextColor(91,33,182); sf(doc,'bold')
      const ll = doc.splitTextToSize(n(block.text), cW-7)
      doc.text(ll, x+7, y)
      return y + ll.length*6 + 2
    }
    case 'p': {
      doc.setFontSize(9.5); doc.setTextColor(50,55,75); sf(doc,'normal')
      const ll = doc.splitTextToSize(n(block.text), cW)
      doc.text(ll, x, y)
      return y + ll.length*lh.p + 3
    }
    case 'ul': {
      let cy=y; doc.setFontSize(9.5); sf(doc,'normal')
      for(const item of block.items) {
        doc.setFillColor(139,92,246); doc.circle(x+2, cy-1.5, 1.3,'F')
        doc.setTextColor(50,55,75)
        const ll = doc.splitTextToSize(n(item), cW-8)
        doc.text(ll, x+7, cy)
        cy += ll.length*lh.li + 1.5
        doc.setDrawColor(230,225,250); doc.setLineWidth(0.12)
        doc.line(x+6, cy-0.8, x+cW, cy-0.8)
      }
      return cy+3
    }
    case 'info': {
      const h = block.items.length*5.8+8
      doc.setFillColor(235,230,255); doc.roundedRect(x,y-2,cW,h,4,4,'F')
      doc.setDrawColor(139,92,246); doc.setLineWidth(0.3); doc.roundedRect(x,y-2,cW,h,4,4,'D')
      doc.setFillColor(139,92,246); doc.rect(x,y-2,3,h,'F')
      doc.setFontSize(8); doc.setTextColor(91,33,182); sf(doc,'bold')
      doc.text('PONTOS IMPORTANTES:', x+7, y+3)
      sf(doc,'normal'); doc.setTextColor(76,29,149)
      block.items.forEach((it,i) => doc.text('> '+n(it), x+7, y+8+i*5.5))
      return y+h+4
    }
    case 'tip': {
      const ll = doc.splitTextToSize(n(block.text), cW-14)
      const h = ll.length*5.2+8
      doc.setFillColor(220,255,240); doc.roundedRect(x,y-2,cW,h,4,4,'F')
      doc.setDrawColor(16,185,129); doc.setLineWidth(0.3); doc.roundedRect(x,y-2,cW,h,4,4,'D')
      doc.setFillColor(16,185,129); doc.rect(x,y-2,3,h,'F')
      doc.setFontSize(8); doc.setTextColor(5,100,60); sf(doc,'bold')
      doc.text('DICA:', x+7, y+3)
      sf(doc,'normal')
      doc.text(ll, x+7, y+8)
      return y+h+4
    }
    case 'code': {
      const lines = n(block.text).split('\n')
      const bh = lines.length*lh.code+11
      doc.setFillColor(240,235,255); doc.roundedRect(x,y-2,cW,bh,4,4,'F')
      doc.setDrawColor(220,210,255); doc.setLineWidth(0.3); doc.roundedRect(x,y-2,cW,bh,4,4,'D')
      doc.setFillColor(100,40,220); doc.roundedRect(x,y-2,cW,5.5,4,4,'F')
      doc.rect(x,y+1.5,cW,2,'F')
      doc.setFontSize(7); doc.setTextColor(255,255,255); sf(doc,'bold')
      doc.text('CODIGO', x+4, y+2.8)
      doc.setFontSize(8); doc.setTextColor(76,29,149); sf(doc,'normal')
      lines.forEach((l,i) => {
        const s = n(l); doc.text(s.length>90?s.slice(0,87)+'...':s, x+4, y+8+i*lh.code)
      })
      return y+bh+4
    }
    case 'table': {
      const cols = block.headers.length, cw = cW/cols
      let cy=y
      doc.setFillColor(243,240,255); doc.rect(x,cy-3.5,cW,7,'F')
      doc.setDrawColor(220,210,255); doc.setLineWidth(0.25); doc.rect(x,cy-3.5,cW,7,'D')
      doc.setFontSize(8.5); doc.setTextColor(91,33,182); sf(doc,'bold')
      block.headers.forEach((h,i) => {
        doc.text(n(h), x+cw*i+3, cy)
        if(i>0){doc.setDrawColor(220,210,255);doc.setLineWidth(0.15);doc.line(x+cw*i,cy-3.5,x+cw*i,cy+3.5)}
      })
      cy+=7; sf(doc,'normal')
      block.rows.forEach((row,ri) => {
        const rH=6.5
        if(ri%2===1){doc.setFillColor(250,249,255);doc.rect(x,cy-4,cW,rH,'F')}
        doc.setDrawColor(220,210,255); doc.setLineWidth(0.15); doc.rect(x,cy-4,cW,rH,'D')
        doc.setTextColor(50,55,75); doc.setFontSize(8.5)
        row.forEach((cell,ci) => {
          const s=n(String(cell)); doc.text(s.length>36?s.slice(0,33)+'...':s, x+cw*ci+3, cy)
          if(ci>0){doc.setDrawColor(220,210,255);doc.line(x+cw*ci,cy-4,x+cw*ci,cy+2.5)}
        })
        cy+=rH
      })
      return cy+5
    }
    default: return y
  }
}

// ══════════════════════════════════════════════════════════════
// RESUMO DA AULA — A4 RETRATO
// ══════════════════════════════════════════════════════════════
export function generateSummaryPDF({ lesson, course }) {
  try {
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
    const W=210, H=297, M=18, cW=W-M*2
    const dateStr = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
    let pageNum=1

    function drawHeader() {
      doc.setFillColor(255,255,255); doc.rect(0,0,W,32,'F')
      // degradê roxo→verde embaixo do header
      gline(doc, 0, W, 32, 1.5)
      // Logo
      doc.setFillColor(100,40,220); doc.roundedRect(M,9,14,14,3,3,'F')
      txt(doc,'EDU', M+7, 18, 6.5, [255,255,255], 'bold', 'center')
      txt(doc,'EduLivre',     M+18, 15, 12, [20,20,45], 'bold')
      txt(doc,'Resumo de Aula', M+18, 20,  7, [107,114,128])
      // Meta direita
      doc.setFontSize(7.5); doc.setTextColor(107,114,128); sf(doc,'normal')
      doc.text('Curso: '+n(course.title),                 W-M, 12, {align:'right'})
      doc.text('Prof.: '+n(course.teacherName||'EduLivre'),W-M, 17, {align:'right'})
      doc.text('Gerado em '+n(dateStr),                    W-M, 22, {align:'right'})
    }

    function drawFooter() {
      doc.setFillColor(248,249,250); doc.rect(0,H-14,W,14,'F')
      doc.setDrawColor(229,231,235); doc.setLineWidth(0.3); doc.line(0,H-14,W,H-14)
      txt(doc,'EduLivre - Projeto de Extensao Universitaria  |  Material de estudo  |  edulivre.app',
          W/2, H-7, 6.5, [107,114,128], 'normal', 'center')
      txt(doc,'Pagina '+pageNum, W-M, H-7, 6.5, [107,114,128], 'normal', 'right')
    }

    // Pagina 1
    doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F')
    drawHeader(); drawFooter()

    // Badge categoria
    const bw = Math.min(cW*0.55, 90)
    doc.setFillColor(243,240,255); doc.roundedRect(M,35,bw,8,4,4,'F')
    doc.setDrawColor(220,210,255); doc.setLineWidth(0.3); doc.roundedRect(M,35,bw,8,4,4,'D')
    doc.setFontSize(7.5); doc.setTextColor(91,33,182); sf(doc,'bold')
    doc.text(n(course.category||''), M+4, 40.5)

    // Titulo
    let Y=49
    doc.setFontSize(20); doc.setTextColor(20,20,45); sf(doc,'bold')
    const tl = doc.splitTextToSize(n(lesson.title), cW)
    doc.text(tl, M, Y); Y += tl.length*8+2
    gline(doc, M, W-M, Y, 1.2); Y+=7

    // Conteudo
    const items = getSummaryContent(lesson.id, lesson, course)
    const bot = H-20

    for(const block of items) {
      let est=0
      if(block.type==='h1')    est=14
      else if(block.type==='h2')    est=13
      else if(block.type==='p')     est=Math.ceil(n(block.text).length/75)*5.5+6
      else if(block.type==='ul')    est=block.items.length*8+6
      else if(block.type==='info')  est=block.items.length*5.8+10
      else if(block.type==='tip')   est=Math.ceil(n(block.text).length/68)*5.2+12
      else if(block.type==='code')  est=block.text.split('\n').length*4.6+14
      else if(block.type==='table') est=(block.rows.length+1)*7+10

      if(Y+est>bot) {
        doc.addPage(); pageNum++
        doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F')
        drawHeader(); drawFooter(); Y=40
      }
      Y = renderBlock(doc, block, M, Y, cW)
    }

    doc.save('Resumo_'+n(lesson.title).replace(/[\s\/\\:*?"<>|]+/g,'_')+'.pdf')
  } catch(err) {
    console.error('Erro ao gerar resumo PDF:', err)
    throw err
  }
}
