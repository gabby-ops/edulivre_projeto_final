import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '@/contexts/CoursesContext'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, BookOpen, Home } from 'lucide-react'
import toast from 'react-hot-toast'

// Question bank — per course category
const QUESTION_BANK = {
  'Programação': [
    { q: 'O que significa a sigla HTML?', opts: ['HyperText Markup Language','High Transfer Markup Language','HyperText Multi Language','High Text Markup Link'], answer: 0 },
    { q: 'Qual operador é utilizado para comparação estrita em JavaScript?', opts: ['==','=','===','!=='], answer: 2 },
    { q: 'Em React, o que é um Hook?', opts: ['Um componente de classe','Uma função que permite usar estado em componentes funcionais','Um método do ciclo de vida','Um tipo de rota'], answer: 1 },
    { q: 'Qual estrutura de dados funciona no modelo LIFO (Last In, First Out)?', opts: ['Fila','Lista','Pilha','Árvore'], answer: 2 },
    { q: 'O que é uma API REST?', opts: ['Um banco de dados relacional','Um padrão de arquitetura para serviços web','Um framework JavaScript','Um protocolo de segurança'], answer: 1 },
  ],
  'Design': [
    { q: 'O que significa UI em Design?', opts: ['User Interface','Unified Input','User Integration','Unique Interaction'], answer: 0 },
    { q: 'Qual princípio de design se refere ao espaço vazio entre elementos?', opts: ['Contraste','Espaço negativo','Alinhamento','Hierarquia'], answer: 1 },
    { q: 'Em Figma, qual funcionalidade permite criar componentes reutilizáveis?', opts: ['Frames','Components','Layers','Constraints'], answer: 1 },
    { q: 'O que é Wireframe no design?', opts: ['Um protótipo colorido final','Um esqueleto básico de uma interface','Um tipo de tipografia','Um sistema de grid'], answer: 1 },
    { q: 'Qual modelo de cores é usado para telas digitais?', opts: ['CMYK','Pantone','RGB','HSL'], answer: 2 },
  ],
  'Administração': [
    { q: 'O que é uma Tabela Dinâmica (Pivot Table) no Excel?', opts: ['Uma tabela que muda de cor automaticamente','Uma ferramenta para resumir e analisar grandes volumes de dados','Uma tabela com fórmulas avançadas','Um gráfico interativo'], answer: 1 },
    { q: 'Qual função do Excel retorna o valor de uma célula com base em critérios de busca?', opts: ['SUM','IF','VLOOKUP','COUNT'], answer: 2 },
    { q: 'O que é KPI em gestão?', opts: ['Kilo Per Iteration','Key Performance Indicator','Knowledge Process Integration','Key Product Investment'], answer: 1 },
    { q: 'O ciclo PDCA representa:', opts: ['Plan, Do, Check, Act','Produce, Develop, Control, Automate','Plan, Deliver, Create, Analyze','Program, Design, Code, Audit'], answer: 0 },
    { q: 'O que é fluxo de caixa?', opts: ['Total de ativos da empresa','Registro de entradas e saídas financeiras','Lucro líquido mensal','Taxa de juros bancária'], answer: 1 },
  ],
  'IA & Machine Learning': [
    { q: 'O que é Machine Learning?', opts: ['Programação de robôs físicos','Um subconjunto da IA que aprende com dados','Um sistema de banco de dados','Um framework de desenvolvimento web'], answer: 1 },
    { q: 'O que é overfitting em ML?', opts: ['Modelo que aprende muito pouco','Modelo que memoriza os dados de treino e não generaliza bem','Modelo com muitas camadas','Erro de compilação'], answer: 1 },
    { q: 'Qual é a função de ativação mais comum em redes neurais profundas?', opts: ['Sigmoid','Tanh','ReLU','Softmax'], answer: 2 },
    { q: 'O que significa NLP?', opts: ['Neural Learning Process','Natural Language Processing','Network Logic Protocol','Node Learning Platform'], answer: 1 },
    { q: 'O que é um dataset de treino?', opts: ['Dados usados para validar o modelo','Dados usados para ensinar o modelo a aprender','Dados de produção','Dados brutos não processados'], answer: 1 },
  ],
  'Marketing': [
    { q: 'O que é SEO?', opts: ['Social Engagement Optimization','Search Engine Optimization','Sponsored Email Outreach','Site Entry Overview'], answer: 1 },
    { q: 'O que é taxa de conversão?', opts: ['Porcentagem de visitantes que realizam a ação desejada','Número total de cliques num anúncio','Custo por clique em anúncio','Taxa de abertura de emails'], answer: 0 },
    { q: 'O que é funil de vendas?', opts: ['Estratégia de preços','Representação das etapas da jornada do cliente','Tipo de anúncio pago','Sistema de CRM'], answer: 1 },
    { q: 'Qual métrica representa o custo por cada 1000 impressões em anúncios?', opts: ['CPC','CPA','CPM','ROI'], answer: 2 },
    { q: 'O que é inbound marketing?', opts: ['Marketing de interrupção','Estratégia de atração de clientes por conteúdo relevante','Marketing em redes sociais pagas','Email marketing em massa'], answer: 1 },
  ],
  'Idiomas': [
    { q: 'What is the correct past tense of "go"?', opts: ['goed','went','gone','going'], answer: 1 },
    { q: 'What does "API" stand for in tech English?', opts: ['Application Programming Interface','Automated Process Integration','Advanced Protocol Interface','Application Process Input'], answer: 0 },
    { q: 'Which phrase is correct for starting a formal email?', opts: ['"Hey there"','Dear Sir/Madam','Yo','What\'s up'], answer: 1 },
    { q: 'What does "debug" mean in software development?', opts: ['Add new features','Remove errors from code','Deploy to production','Write documentation'], answer: 1 },
    { q: 'What is the meaning of "deadline"?', opts: ['A very long line','The final date for completing a task','A type of meeting','An error message'], answer: 1 },
  ],
  'Exatas': [
    { q: 'Qual é o resultado de 2³ × 2²?', opts: ['2⁵','2⁶','4⁵','32'], answer: 0 },
    { q: 'O que é a mediana de um conjunto de dados?', opts: ['A soma de todos os valores','O valor que mais se repete','O valor central quando os dados estão ordenados','A diferença entre o maior e menor valor'], answer: 2 },
    { q: 'Em lógica, o operador AND (E) retorna verdadeiro quando:', opts: ['Pelo menos uma proposição é verdadeira','Ambas as proposições são verdadeiras','Nenhuma é verdadeira','Apenas uma é verdadeira'], answer: 1 },
    { q: 'O que é uma matriz identidade?', opts: ['Matriz com todos zeros','Matriz quadrada com 1 na diagonal e 0 nos demais','Matriz invertida','Matriz com números aleatórios'], answer: 1 },
    { q: 'Qual é a probabilidade de tirar cara em uma moeda justa?', opts: ['0.25','0.75','0.5','1'], answer: 2 },
  ],
  'Negócios': [
    { q: 'O que é MVP no contexto de startups?', opts: ['Most Valuable Player','Minimum Viable Product','Maximum Value Proposition','Minimum Value Price'], answer: 1 },
    { q: 'O que é capital de giro?', opts: ['Investimento em equipamentos','Recursos necessários para operações do dia a dia','Lucro acumulado','Empréstimo bancário'], answer: 1 },
    { q: 'O que é o modelo de negócio SaaS?', opts: ['Software as a Service','System as a Solution','Sales and Service','Service as a Subscription'], answer: 0 },
    { q: 'O que é pitch de negócios?', opts: ['Uma reunião interna de equipe','Apresentação curta e objetiva de um projeto/negócio','Um relatório financeiro detalhado','Um contrato de parceria'], answer: 1 },
    { q: 'O que é CAC (Custo de Aquisição de Cliente)?', opts: ['Custo total de produção','Valor médio gasto para conquistar um novo cliente','Taxa de churn mensal','Custo por campanha de marketing'], answer: 1 },
  ],
  'Infraestrutura': [
    { q: 'O que é um endereço IP?', opts: ['Um protocolo de segurança','Identificador único de um dispositivo em uma rede','Um tipo de cabo de rede','Um servidor de emails'], answer: 1 },
    { q: 'O que é um firewall?', opts: ['Um tipo de roteador','Um sistema de proteção que monitora tráfego de rede','Um protocolo de comunicação','Um servidor de arquivos'], answer: 1 },
    { q: 'O modelo OSI possui quantas camadas?', opts: ['4','5','7','9'], answer: 2 },
    { q: 'O que é DNS?', opts: ['Sistema de segurança de rede','Sistema que traduz nomes de domínio em endereços IP','Protocolo de transferência de dados','Tipo de conexão VPN'], answer: 1 },
    { q: 'O que é VPN?', opts: ['Virtual Private Network — rede privada virtual segura','Very Protected Node','Virtual Protocol Network','Verified Private Number'], answer: 0 },
  ],
}

const QUIZ_KEY = 'edulivre_quiz_v1'

function getQuizResults() {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}') } catch { return {} }
}
function saveQuizResult(key, data) {
  const all = getQuizResults()
  all[key] = data
  localStorage.setItem(QUIZ_KEY, JSON.stringify(all))
}

function getQuestionsForCourse(course) {
  const bank = QUESTION_BANK[course.category] || QUESTION_BANK['Programação']
  // Pick 5 questions, shuffled
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(5, shuffled.length))
}

export default function StudentQuiz() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { courses } = useCourses()
  const { user } = useAuth()

  const course = courses.find(c => c.id === courseId)
  const quizKey = `${user?.id}_${courseId}`

  const [questions] = useState(() => course ? getQuestionsForCourse(course) : [])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const existingResult = getQuizResults()[quizKey]

  useEffect(() => {
    if (existingResult && !finished) {
      // Has existing result, show it
    }
  }, [])

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-white">Curso não encontrado.</p>
        <button onClick={() => navigate('/aluno/cursos')} className="btn-primary mt-4 px-6 py-2.5">Voltar aos Cursos</button>
      </div>
    )
  }

  function handleSelect(idx) {
    if (showFeedback) return
    setSelected(idx)
  }

  function handleConfirm() {
    if (selected === null) return
    const correct = selected === questions[current].answer
    const newAnswers = [...answers, { selected, correct }]
    setAnswers(newAnswers)
    setShowFeedback(true)
  }

  function handleNext() {
    setShowFeedback(false)
    setSelected(null)
    if (current + 1 >= questions.length) {
      const score = answers.filter(a => a.correct).length + (answers[current] ? 0 : (selected === questions[current].answer ? 1 : 0))
      const finalAnswers = [...answers, { selected, correct: selected === questions[current].answer }]
      const finalScore = finalAnswers.filter(a => a.correct).length
      saveQuizResult(quizKey, { score: finalScore, total: questions.length, date: new Date().toISOString() })
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  function handleRetry() {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
    setShowFeedback(false)
  }

  const q = questions[current]
  const finalScore = answers.filter(a => a.correct).length
  const pct = Math.round((finalScore / questions.length) * 100)

  if (finished) {
    const passed = pct >= 60
    return (
      <div className="p-4 sm:p-6 max-w-xl mx-auto">
        <div className="card p-8 text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(248,113,113,0.15)',
              border: `2px solid ${passed ? 'rgba(16,185,129,0.4)' : 'rgba(248,113,113,0.4)'}` }}>
            {passed
              ? <Trophy className="w-9 h-9 text-green-400" />
              : <RotateCcw className="w-9 h-9 text-red-400" />}
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-2">
            {passed ? 'Parabéns! 🎉' : 'Quase lá!'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {passed ? 'Você passou no questionário com sucesso!' : 'Tente novamente para melhorar sua pontuação.'}
          </p>

          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `conic-gradient(${passed ? '#10b981' : '#f59e0b'} ${pct * 3.6}deg, rgba(255,255,255,0.05) 0deg)`, padding: 4 }}>
            <div className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-card)' }}>
              <div>
                <p className="text-3xl font-bold text-white">{pct}%</p>
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>acertos</p>
              </div>
            </div>
          </div>

          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {finalScore} de {questions.length} questões corretas
          </p>

          <div className="space-y-3">
            {!passed && (
              <button onClick={handleRetry} className="btn-primary w-full py-3">
                <RotateCcw className="w-4 h-4" /> Tentar novamente
              </button>
            )}
            <button onClick={() => navigate('/aluno/aulas')} className="btn-ghost w-full py-3">
              <BookOpen className="w-4 h-4" /> Continuar estudando
            </button>
            <button onClick={() => navigate('/aluno')} className="btn-ghost w-full py-3">
              <Home className="w-4 h-4" /> Ir ao Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
          <BookOpen className="w-4 h-4" />
          <span>{course.title}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Questionário</h1>
      </div>

      {/* Progress bar */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span>Questão {current + 1} de {questions.length}</span>
          <span>{Math.round(((current) / questions.length) * 100)}% completo</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current) / questions.length) * 100}%`, background: 'linear-gradient(90deg,#8b5cf6,#10b981)' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 sm:p-8 mb-5 animate-fade-up" style={{ animationDelay:'0.08s' }}>
        <p className="text-lg font-semibold text-white mb-6 leading-relaxed">{q.q}</p>

        <div className="space-y-3">
          {q.opts.map((opt, idx) => {
            let bg = 'rgba(255,255,255,0.03)', border = 'var(--border)', color = 'var(--text-primary)'
            if (showFeedback) {
              if (idx === q.answer) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; color = '#34d399' }
              else if (idx === selected && idx !== q.answer) { bg = 'rgba(248,113,113,0.12)'; border = 'rgba(248,113,113,0.4)'; color = '#fca5a5' }
            } else if (idx === selected) {
              bg = 'rgba(139,92,246,0.15)'; border = 'rgba(139,92,246,0.5)'; color = '#c4b5fd'
            }

            return (
              <button key={idx} onClick={() => handleSelect(idx)}
                className="w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: showFeedback ? 'default' : 'pointer' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: idx === selected ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)', border: `1px solid ${border}` }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm">{opt}</span>
                {showFeedback && idx === q.answer && <CheckCircle className="w-4 h-4 ml-auto text-green-400 shrink-0" />}
                {showFeedback && idx === selected && idx !== q.answer && <XCircle className="w-4 h-4 ml-auto text-red-400 shrink-0" />}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="mt-5 p-4 rounded-xl text-sm animate-fade-in" style={{
            background: selected === q.answer ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${selected === q.answer ? 'rgba(16,185,129,0.25)' : 'rgba(248,113,113,0.25)'}`,
            color: selected === q.answer ? '#34d399' : '#fca5a5'
          }}>
            {selected === q.answer
              ? '✅ Correto! Excelente resposta.'
              : `❌ Incorreto. A resposta correta é: ${q.opts[q.answer]}`}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!showFeedback ? (
          <button onClick={handleConfirm} disabled={selected === null} className="btn-primary flex-1 py-3">
            Confirmar resposta
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary flex-1 py-3">
            {current + 1 >= questions.length ? 'Ver resultado' : 'Próxima questão'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
