import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Search, Plus, Heart, Reply, X, ChevronLeft, Clock, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id:'web',    label:'Programação Web Básica',     color:'#8b5cf6', emoji:'💻' },
  { id:'art',    label:'Arte Digital para Iniciantes',color:'#ec4899', emoji:'🎨' },
  { id:'math',   label:'Matemática Financeira',      color:'#f59e0b', emoji:'📊' },
  { id:'english',label:'Inglês para Iniciantes',     color:'#10b981', emoji:'🌍' },
]

const INIT_POSTS = [
  {
    id:'p1', catId:'web', title:'Como começar com React?',
    body:'Oi pessoal! Estou iniciando em React e não sei por onde começar. Alguém tem dicas?',
    author:'Ana Silva', authorId:'u1', createdAt: new Date(Date.now()-86400000*2).toISOString(),
    likes:['u2','u3'], replies:[
      { id:'r1', body:'Recomendo começar pelo site oficial do React! Tem um ótimo tutorial.', author:'Carlos Lima', authorId:'u2', createdAt: new Date(Date.now()-86400000).toISOString(), likes:['u1'] },
      { id:'r2', body:'Também indico o curso aqui na plataforma — é excelente para iniciantes!', author:'Maria João', authorId:'u3', createdAt: new Date(Date.now()-43200000).toISOString(), likes:[] },
    ],
  },
  {
    id:'p2', catId:'art',  title:'Melhores ferramentas de design gratuitas',
    body:'Quais ferramentas vocês usam para design digital sem gastar nada? Compartilhem suas experiências!',
    author:'Pedro Nunes', authorId:'u4', createdAt: new Date(Date.now()-86400000*3).toISOString(),
    likes:['u1','u5'], replies:[
      { id:'r3', body:'Figma é incrível e gratuito para uso pessoal! Vale muito a pena.', author:'Júlia Torres', authorId:'u5', createdAt: new Date(Date.now()-86400000*2).toISOString(), likes:['u4'] },
    ],
  },
  {
    id:'p3', catId:'math', title:'Dúvida sobre juros compostos',
    body:'Alguém pode explicar a diferença entre juros simples e compostos de forma prática?',
    author:'Lucas Ferreira', authorId:'u6', createdAt: new Date(Date.now()-86400000).toISOString(),
    likes:[], replies:[],
  },
  {
    id:'p4', catId:'english', title:'Dicas para melhorar o listening',
    body:'Tenho dificuldade em entender nativos falando rápido. O que vocês fazem para melhorar o listening?',
    author:'Fernanda Costa', authorId:'u7', createdAt: new Date(Date.now()-3600000*5).toISOString(),
    likes:['u1'], replies:[
      { id:'r4', body:'Assistir séries com legenda em inglês ajuda MUITO! Comece com algo mais lento.', author:'Roberto Alves', authorId:'u8', createdAt: new Date(Date.now()-3600000*2).toISOString(), likes:['u7'] },
    ],
  },
]

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso))/1000)
  if (d < 60)    return 'agora'
  if (d < 3600)  return Math.floor(d/60)+'min atrás'
  if (d < 86400) return Math.floor(d/3600)+'h atrás'
  return Math.floor(d/86400)+'d atrás'
}

function getInitials(name) {
  return name?.split(' ').slice(0,2).map(n=>n[0]?.toUpperCase()).join('') || '?'
}

const AVATAR_COLORS = ['#8b5cf6','#10b981','#f59e0b','#06b6d4','#ec4899','#ef4444']
function avatarColor(name) { return AVATAR_COLORS[(name?.charCodeAt(0)||0) % AVATAR_COLORS.length] }

export default function StudentForum() {
  const { user } = useAuth()
  const [posts, setPosts]   = useState(INIT_POSTS)
  const [activeCat, setActiveCat] = useState(null)
  const [search, setSearch] = useState('')
  const [activePost, setActivePost] = useState(null)
  const [newPostModal, setNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title:'', body:'', catId: CATEGORIES[0].id })
  const [replyText, setReplyText] = useState('')
  const [replyErr, setReplyErr] = useState('')

  // Filter
  const filtered = posts.filter(p => {
    const matchCat = !activeCat || p.catId === activeCat
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  // Like post
  function likePost(postId) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes.includes(user?.id)
      return { ...p, likes: liked ? p.likes.filter(id=>id!==user?.id) : [...p.likes, user?.id] }
    }))
    if (activePost?.id === postId) {
      setActivePost(prev => {
        const liked = prev.likes.includes(user?.id)
        return { ...prev, likes: liked ? prev.likes.filter(id=>id!==user?.id) : [...prev.likes, user?.id] }
      })
    }
  }

  // Like reply
  function likeReply(postId, replyId) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, replies: p.replies.map(r => {
        if (r.id !== replyId) return r
        const liked = r.likes.includes(user?.id)
        return { ...r, likes: liked ? r.likes.filter(id=>id!==user?.id) : [...r.likes, user?.id] }
      })}
    }))
    setActivePost(prev => prev ? { ...prev, replies: prev.replies.map(r => {
      if (r.id !== replyId) return r
      const liked = r.likes.includes(user?.id)
      return { ...r, likes: liked ? r.likes.filter(id=>id!==user?.id) : [...r.likes, user?.id] }
    })} : null)
  }

  // Add reply
  function addReply() {
    if (!replyText.trim()) { setReplyErr('Escreva uma resposta.'); return }
    const reply = { id: crypto.randomUUID(), body: replyText.trim(), author: user?.name||'Você', authorId: user?.id, createdAt: new Date().toISOString(), likes:[] }
    setPosts(prev => prev.map(p => p.id === activePost?.id ? {...p, replies:[...p.replies, reply]} : p))
    setActivePost(prev => ({ ...prev, replies:[...prev.replies, reply] }))
    setReplyText(''); setReplyErr('')
  }

  // Create post
  function createPost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return
    const p = { id: crypto.randomUUID(), ...newPost, title:newPost.title.trim(), body:newPost.body.trim(),
      author: user?.name||'Você', authorId: user?.id, createdAt: new Date().toISOString(), likes:[], replies:[] }
    setPosts(prev => [p, ...prev])
    setNewPostModal(false)
    setNewPost({ title:'', body:'', catId: CATEGORIES[0].id })
  }

  const cat = id => CATEGORIES.find(c=>c.id===id)

  /* ── Post detail view ── */
  if (activePost) {
    const c = cat(activePost.catId)
    return (
      <div className="p-6 max-w-3xl mx-auto animate-fade-up">
        <button onClick={() => setActivePost(null)}
          className="flex items-center gap-2 text-sm mb-5 transition-colors hover:text-purple-300"
          style={{ color:'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" /> Voltar ao fórum
        </button>

        {/* Post */}
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{c?.emoji}</span>
            <span className="badge-lilac text-[10px]">{c?.label}</span>
          </div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>{activePost.title}</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color:'var(--text-muted)' }}>{activePost.body}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: avatarColor(activePost.author), color:'#fff' }}>
                {getInitials(activePost.author)}
              </div>
              <span className="text-xs" style={{ color:'var(--text-muted)' }}>{activePost.author}</span>
              <span className="text-xs flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                <Clock className="w-3 h-3" />{timeAgo(activePost.createdAt)}
              </span>
            </div>
            <button onClick={() => likePost(activePost.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color: activePost.likes.includes(user?.id) ? '#f87171' : 'var(--text-muted)' }}>
              <Heart className={cn('w-3.5 h-3.5', activePost.likes.includes(user?.id) && 'fill-red-400')} />
              {activePost.likes.length}
            </button>
          </div>
        </div>

        {/* Replies */}
        <h3 className="font-semibold mb-3" style={{ color:'var(--text-primary)' }}>
          {activePost.replies.length} resposta{activePost.replies.length!==1?'s':''}
        </h3>
        <div className="space-y-3 mb-5">
          {activePost.replies.map(r => (
            <div key={r.id} className="card p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: avatarColor(r.author), color:'#fff' }}>
                {getInitials(r.author)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold" style={{ color:'var(--text-primary)' }}>{r.author}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                    <Clock className="w-2.5 h-2.5" />{timeAgo(r.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{ color:'var(--text-muted)' }}>{r.body}</p>
                <button onClick={() => likeReply(activePost.id, r.id)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: r.likes.includes(user?.id) ? '#f87171' : 'var(--text-muted)' }}>
                  <Heart className={cn('w-3 h-3', r.likes.includes(user?.id) && 'fill-red-400')} />
                  {r.likes.length} curtida{r.likes.length!==1?'s':''}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        <div className="card p-4">
          <p className="text-sm font-semibold mb-3" style={{ color:'var(--text-primary)' }}>Sua resposta</p>
          {replyErr && <p className="text-xs text-red-400 mb-2">{replyErr}</p>}
          <textarea className="input h-auto py-3 mb-3" rows={3} placeholder="Escreva sua resposta..."
            value={replyText} onChange={e=>{ setReplyText(e.target.value); setReplyErr('') }} />
          <button onClick={addReply} className="btn-primary px-5 py-2 text-sm">
            <Reply className="w-4 h-4" /> Responder
          </button>
        </div>
      </div>
    )
  }

  /* ── Main forum view ── */
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>💬 Fórum</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Discuta, tire dúvidas e ajude outros alunos</p>
        </div>
        <button onClick={() => setNewPostModal(true)} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Nova discussão
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
        <input className="input pl-10" placeholder="Buscar discussões..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6 animate-fade-up" style={{ animationDelay:'0.08s' }}>
        <button onClick={() => setActiveCat(null)}
          className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', !activeCat ? 'text-white' : 'hover:text-purple-300')}
          style={!activeCat ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' } : { background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', color:'var(--text-muted)' }}>
          Todos ({posts.length})
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5', activeCat===c.id ? 'text-white' : 'hover:text-purple-300')}
            style={activeCat===c.id ? { background:`linear-gradient(135deg,${c.color},${c.color}cc)` } : { background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', color:'var(--text-muted)' }}>
            <span>{c.emoji}</span>{c.label} ({posts.filter(p=>p.catId===c.id).length})
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color:'rgba(139,92,246,0.2)' }} />
            <p className="font-semibold mb-1" style={{ color:'var(--text-primary)' }}>Nenhuma discussão encontrada</p>
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>Seja o primeiro a criar uma!</p>
          </div>
        ) : filtered.map((post, i) => {
          const c = cat(post.catId)
          return (
            <div key={post.id} onClick={() => setActivePost(post)}
              className="card p-5 cursor-pointer hover:scale-[1.005] transition-all duration-200 animate-fade-up"
              style={{ animationDelay: i * 0.05 + 's' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: (c?.color||'#8b5cf6') + '18' }}>
                  {c?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <span className="badge-lilac text-[10px]">{c?.label}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color:'var(--text-primary)' }}>{post.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color:'var(--text-muted)' }}>{post.body}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color:'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: avatarColor(post.author), color:'#fff' }}>
                        {getInitials(post.author)}
                      </div>
                      {post.author}
                    </div>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><Reply className="w-3 h-3" />{post.replies.length}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* New post modal */}
      {newPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setNewPostModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl p-6 z-10 animate-scale-in"
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', boxShadow:'0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg" style={{ color:'var(--text-primary)' }}>Nova Discussão</h3>
              <button onClick={()=>setNewPostModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color:'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Categoria</label>
                <select className="input" value={newPost.catId} onChange={e=>setNewPost(p=>({...p,catId:e.target.value}))}
                  style={{ background:'var(--bg-card)' }}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Título *</label>
                <input className="input" placeholder="Título da discussão" value={newPost.title}
                  onChange={e=>setNewPost(p=>({...p,title:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Mensagem *</label>
                <textarea className="input h-auto py-3" rows={4} placeholder="Descreva sua dúvida ou tema..." value={newPost.body}
                  onChange={e=>setNewPost(p=>({...p,body:e.target.value}))} />
              </div>
              <button onClick={createPost} disabled={!newPost.title.trim()||!newPost.body.trim()}
                className="btn-primary w-full h-11">
                <Plus className="w-4 h-4" /> Publicar discussão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
