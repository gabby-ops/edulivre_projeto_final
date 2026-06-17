import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '@/contexts/LangContext'
import LangThemeButtons from '@/components/shared/LangThemeButtons'
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight, Play,
  Star, CheckCircle, ChevronDown, Menu, X, Globe, Zap,
  TrendingUp, Heart, Shield, Clock, MessageSquare, Target,
  Code2, Palette, Calculator, Languages, BarChart2, Cpu,
  Wifi, Briefcase, Database, Megaphone, Brain, Lightbulb
} from 'lucide-react'

const STATS = [
  { value: '2.400+', labelKey: 'stats.students', icon: Users, color: '#8b5cf6' },
  { value: '27',     labelKey: 'stats.courses', icon: BookOpen, color: '#10b981' },
  { value: '98%',    labelKey: 'stats.satisfaction', icon: Star, color: '#f59e0b' },
  { value: '1.200+', labelKey: 'stats.certs', icon: Award, color: '#ec4899' },
]

const FEATURES = [
  { icon: Zap,          title: 'Aprendizado Acelerado',  desc: 'Metodologia ativa com projetos práticos e videoaulas objetivas para você evoluir rapidamente.' },
  { icon: Globe,        title: 'Acesso 100% Online',     desc: 'Estude onde e quando quiser, sem mensalidades ou barreiras geográficas. Educação para todos.' },
  { icon: Award,        title: 'Certificados Reconhecidos', desc: 'Emita certificados digitais ao concluir cada curso e valorize seu currículo profissional.' },
  { icon: MessageSquare,title: 'Fórum Colaborativo',     desc: 'Tire dúvidas, troque experiências e construa sua rede de contatos com outros estudantes.' },
  { icon: TrendingUp,   title: 'Progresso Detalhado',    desc: 'Acompanhe sua evolução em cada curso com relatórios visuais e metas de aprendizado.' },
  { icon: Shield,       title: 'Plataforma Segura',      desc: 'Seus dados e progresso armazenados com segurança. Acesso protegido por autenticação.' },
]

const COURSES = [
  { icon: Code2,     title: 'React do Zero ao Avançado',  category: 'Programação',      color: '#8b5cf6', lessons: 3 },
  { icon: Zap,       title: 'JavaScript Moderno ES2024',  category: 'Programação',      color: '#10b981', lessons: 2 },
  { icon: Palette,   title: 'UI/UX Design com Figma',     category: 'Design',           color: '#f59e0b', lessons: 3 },
  { icon: Calculator,title: 'Matemática Aplicada',        category: 'Exatas',           color: '#ec4899', lessons: 4 },
  { icon: Languages, title: 'Inglês para Tecnologia',     category: 'Idiomas',          color: '#3b82f6', lessons: 5 },
  { icon: BarChart2, title: 'Excel e Análise de Dados',   category: 'Administração',    color: '#f97316', lessons: 4 },
  { icon: Cpu,       title: 'Inteligência Artificial',    category: 'IA & Machine Learning', color: '#a855f7', lessons: 6 },
  { icon: Database,  title: 'Banco de Dados com SQL',     category: 'Programação',      color: '#14b8a6', lessons: 4 },
  { icon: Wifi,      title: 'Redes de Computadores',      category: 'Infraestrutura',   color: '#6366f1', lessons: 3 },
  { icon: Briefcase, title: 'Empreendedorismo Digital',   category: 'Negócios',         color: '#84cc16', lessons: 4 },
  { icon: Megaphone, title: 'Marketing Digital',          category: 'Marketing',        color: '#e11d48', lessons: 5 },
  { icon: Brain,     title: 'Python para Iniciantes',     category: 'Programação',      color: '#0ea5e9', lessons: 6 },
]

const TESTIMONIALS = [
  {
    name: 'Ana Carolina Silva',
    role: 'Desenvolvedora Frontend',
    text: 'A plataforma mudou minha vida profissional. Em 6 meses aprendi React do zero e consegui meu primeiro emprego na área de tecnologia.',
    avatar: 'AC', color: '#8b5cf6'
  },
  {
    name: 'Lucas Mendes',
    role: 'Designer UX/UI',
    text: 'Os cursos são extremamente didáticos. O fórum é ativo e os professores são sempre atenciosos. Recomendo para todos que querem mudar de área.',
    avatar: 'LM', color: '#10b981'
  },
  {
    name: 'Mariana Costa',
    role: 'Analista de Dados',
    text: 'Consegui minha promoção após completar os cursos de Excel e SQL. Os certificados são reconhecidos pelas empresas. Vale muito a pena!',
    avatar: 'MC', color: '#f59e0b'
  },
]

const ABOUT_ITEMS = [
  { icon: Target,    title: 'Missão', desc: 'Democratizar o acesso à educação tecnológica de qualidade, eliminando barreiras socioeconômicas e geográficas.' },
  { icon: Lightbulb, title: 'Visão',  desc: 'Ser a principal referência em educação digital inclusiva do Brasil, formando profissionais capacitados para o mercado.' },
  { icon: Heart,     title: 'Valores', desc: 'Inclusão, qualidade, inovação e colaboração são os pilares que guiam todas as nossas ações e decisões.' },
]

function useIntersect(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function AnimSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useIntersect()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
    }}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function scrollTo(id) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--bg-secondary)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>EduLivre</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
            {['cursos', 'sobre', 'depoimentos', 'contato'].map(s => (
              <button key={s} onClick={() => scrollTo(s)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 14, fontWeight: 500,
                textTransform: 'capitalize', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                {s === 'cursos' ? t('nav.courses') : s === 'sobre' ? t('nav.about') : s === 'depoimentos' ? t('nav.testimonials') : t('nav.contact')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <LangThemeButtons />
            <Link to="/login" style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: 'var(--text-muted)', border: '1px solid var(--border)',
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >{t('nav.login')}</Link>
            <Link to="/cadastro" style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}>
              {t('nav.register')} <ArrowRight size={14} />
            </Link>
            <button onClick={() => setMenuOpen(s => !s)} className="show-mobile" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '16px 24px 24px' }}>
            {[[t('nav.courses'),'cursos'],[t('nav.about'),'sobre'],[t('nav.testimonials'),'depoimentos'],[t('nav.contact'),'contato']].map(([label,id],i) => (
              <button key={i} onClick={() => scrollTo(id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 16, fontWeight: 500,
                padding: '12px 0', borderBottom: '1px solid var(--border)'
              }}>{label}</button>
            ))}
            <div style={{ marginTop: 12, marginBottom: 8 }}>
              <LangThemeButtons size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Link to="/login" style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>{t('nav.login')}</Link>
              <Link to="/cadastro" style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>{t('nav.register')}</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 70 }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#c4b5fd' }}>Projeto de Extensão Universitária — Educação Digital Inclusiva</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
              {t('hero.title1')}{' '}
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('hero.title2')}
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 580 }}>
              {t('hero.desc')}
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/cadastro" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(139,92,246,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.4)' }}
              >
                <GraduationCap size={20} /> {t('hero.cta1')}
              </Link>
              <button onClick={() => scrollTo('cursos')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                <Play size={18} /> {t('hero.cta2')}
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 48 }}>
              {[
                { v: '2.400+', l: 'alunos matriculados' },
                { v: '27', l: 'cursos disponíveis' },
                { v: '100%', l: 'gratuito' },
              ].map(({ v, l }) => (
                <div key={l}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{v}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', opacity: 0.5 }}>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {STATS.map(({ value, labelKey, icon: Icon, color }, i) => (
            <AnimSection key={labelKey} delay={i * 0.1}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <div style={{ fontSize: 38, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{value}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{t(labelKey)}</div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── Cursos ─────────────────────────────────────── */}
      <section id="cursos" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('catalog.badge')}</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8, marginBottom: 16 }}>
                {t('catalog.title')}
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>
                {t('catalog.desc')}
              </p>
            </div>
          </AnimSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {COURSES.map(({ icon: Icon, title, category, color, lessons }, i) => (
              <AnimSection key={title} delay={i * 0.05}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: 24, cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${color}20` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{category}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <BookOpen size={13} />
                    <span>{lessons} {t('catalog.lessons')}</span>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>

          <AnimSection delay={0.2}>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/cadastro" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(139,92,246,0.35)'
              }}>
                {t('catalog.seeAll')} <ArrowRight size={18} />
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('features.badge')}</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8, marginBottom: 16 }}>
                {t('features.title')}
              </h2>
            </div>
          </AnimSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <AnimSection key={title} delay={i * 0.08}>
                <div style={{ display: 'flex', gap: 16, padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: '#a78bfa' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sobre o Projeto ────────────────────────────── */}
      <section id="sobre" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 64, alignItems: 'center' }}>
            <AnimSection>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('about.badge')}</span>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8, marginBottom: 20 }}>
                  {t('about.title')}
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 24 }}>
                  {t('about.p1')}
                </p>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32 }}>
                  {t('about.p2')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[t('about.check1'), t('about.check2'), t('about.check3'), t('about.check4')].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {ABOUT_ITEMS.map(({ icon: Icon, title, desc }, i) => (
                  <div key={title} style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ── Impacto Social ─────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.04) 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <AnimSection>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Impacto Social</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8, marginBottom: 16 }}>
              Democratizando o ensino no Brasil
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 64px' }}>
              Acreditamos que educação de qualidade é um direito, não um privilégio. Nossa plataforma conecta oportunidades a quem mais precisa.
            </p>
          </AnimSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🎓', title: 'Inclusão Digital', desc: 'Capacitando populações em situação de vulnerabilidade digital com tecnologia acessível' },
              { icon: '🌎', title: 'Alcance Nacional', desc: 'Estudantes de todos os estados do Brasil acessando educação de qualidade' },
              { icon: '💼', title: 'Empregabilidade', desc: 'Formando profissionais prontos para o mercado digital e as demandas do futuro' },
              { icon: '♿', title: 'Acessibilidade', desc: 'Interface inclusiva adaptada para diferentes necessidades e dispositivos' },
            ].map(({ icon, title, desc }) => (
              <AnimSection key={title}>
                <div style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ────────────────────────────────── */}
      <section id="depoimentos" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('testimonials.badge')}</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
                {t('testimonials.title')}
              </h2>
            </div>
          </AnimSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(({ name, role, text, avatar, color }, i) => (
              <AnimSection key={name} delay={i * 0.1}>
                <div style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>"{text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                      {avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section id="contato" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <AnimSection>
            <div style={{
              padding: '72px 48px', borderRadius: 28, textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.08) 100%)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 24px 80px rgba(139,92,246,0.12)'
            }}>
              <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(139,92,246,0.4)' }}>
                <GraduationCap size={32} color="#fff" />
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                {t('cta.title')}
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
                {t('cta.desc')}
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/cadastro" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '15px 36px', borderRadius: 14, fontSize: 17, fontWeight: 700,
                  background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(139,92,246,0.4)'
                }}>
                  {t('cta.btn1')} <ArrowRight size={20} />
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '15px 28px', borderRadius: 14, fontSize: 17, fontWeight: 600,
                  border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)'
                }}>
                  {t('cta.btn2')}
                </Link>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{ padding: '48px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>EduLivre</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
          {t('footer.desc')}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(139,138,174,0.5)' }}>
          © {new Date().getFullYear()} EduLivre. {t('footer.rights')}
        </p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
