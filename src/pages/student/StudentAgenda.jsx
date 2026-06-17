import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS_LABEL = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const EVENTS_KEY = 'edulivre_events_v1'

function readEvents(userId) {
  try { return JSON.parse(localStorage.getItem(EVENTS_KEY + '_' + userId) || '[]') } catch { return [] }
}
function writeEvents(userId, evs) {
  localStorage.setItem(EVENTS_KEY + '_' + userId, JSON.stringify(evs))
}

function pad(n) { return String(n).padStart(2,'0') }
function isoDate(y,m,d) { return `${y}-${pad(m+1)}-${pad(d)}` }

const COLOR_OPTS = [
  '#8b5cf6','#10b981','#f59e0b','#06b6d4','#ef4444','#ec4899',
]

export default function StudentAgenda() {
  const { user } = useAuth()
  const [today]   = useState(new Date())
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [events, setEvents]       = useState([])
  const [selected, setSelected]   = useState(null) // 'YYYY-MM-DD'
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState({ title:'', date:'', time:'', description:'', color: COLOR_OPTS[0] })
  const [formErr, setFormErr]     = useState('')

  useEffect(() => { setEvents(readEvents(user?.id)) }, [user?.id])

  // ── Calendar grid ──────────────────────────────────
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) }
    else setViewMonth(m => m-1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) }
    else setViewMonth(m => m+1)
  }

  function eventsOn(dateStr) { return events.filter(e => e.date === dateStr) }
  function todayStr() { return isoDate(today.getFullYear(), today.getMonth(), today.getDate()) }
  function selectedStr() { return selected }

  // ── Add event ──────────────────────────────────────
  function openModal(dateStr) {
    setForm({ title:'', date: dateStr || isoDate(viewYear, viewMonth, 1), time:'', description:'', color: COLOR_OPTS[0] })
    setFormErr('')
    setModal(true)
  }

  function handleSave() {
    if (!form.title.trim()) { setFormErr('Informe o nome do evento.'); return }
    if (!form.date)         { setFormErr('Selecione uma data.'); return }
    const ev = { id: crypto.randomUUID(), ...form, title: form.title.trim(), createdAt: new Date().toISOString() }
    const next = [...events, ev].sort((a,b) => a.date.localeCompare(b.date))
    writeEvents(user?.id, next)
    setEvents(next)
    setModal(false)
  }

  function deleteEvent(id) {
    const next = events.filter(e => e.id !== id)
    writeEvents(user?.id, next)
    setEvents(next)
  }

  // Upcoming: next 10 events from today
  const todayIso = todayStr()
  const upcoming = events.filter(e => e.date >= todayIso).slice(0, 10)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>📅 Agenda</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Organize seus estudos e compromissos</p>
        </div>
        <button onClick={() => openModal('')} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Novo evento
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Calendar ── */}
        <div className="lg:col-span-2 card p-5 animate-fade-up" style={{ animationDelay:'0.05s' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-purple-500/15"
              style={{ border:'1px solid var(--border)' }}>
              <ChevronLeft className="w-4 h-4" style={{ color:'var(--text-muted)' }} />
            </button>
            <h2 className="font-display font-bold text-base" style={{ color:'var(--text-primary)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-purple-500/15"
              style={{ border:'1px solid var(--border)' }}>
              <ChevronRight className="w-4 h-4" style={{ color:'var(--text-muted)' }} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_LABEL.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide py-1"
                style={{ color:'var(--text-muted)' }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={'empty-'+idx} />
              const dateStr = isoDate(viewYear, viewMonth, day)
              const dayEvs  = eventsOn(dateStr)
              const isToday = dateStr === todayIso
              const isSel   = dateStr === selected
              return (
                <button key={dateStr} onClick={() => setSelected(isSel ? null : dateStr)}
                  className={cn(
                    'relative flex flex-col items-center rounded-xl py-1.5 transition-all duration-150',
                    isToday && 'ring-2 ring-purple-500/60',
                    isSel ? 'text-white' : 'hover:bg-purple-500/10',
                  )}
                  style={isSel ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' } : {}}>
                  <span className={cn('text-sm font-medium', isToday && !isSel && 'text-purple-400')}
                    style={{ color: isSel ? '#fff' : 'var(--text-primary)' }}>{day}</span>
                  {/* Event dots */}
                  {dayEvs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvs.slice(0,3).map(ev => (
                        <span key={ev.id} className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: isSel ? '#fff' : ev.color }} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected day events */}
          {selected && (
            <div className="mt-5 pt-5 border-t animate-fade-in" style={{ borderColor:'var(--border)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color:'var(--text-primary)' }}>
                {new Date(selected + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}
              </p>
              {eventsOn(selected).length === 0 ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color:'var(--text-muted)' }}>Nenhum evento neste dia.</p>
                  <button onClick={() => openModal(selected)} className="btn-primary px-3 py-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {eventsOn(selected).map(ev => (
                    <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: ev.color + '12', border: `1px solid ${ev.color}30` }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: ev.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{ev.title}</p>
                        {ev.time && <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color:'var(--text-muted)' }}>
                          <Clock className="w-3 h-3" />{ev.time}
                        </p>}
                        {ev.description && <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{ev.description}</p>}
                      </div>
                      <button onClick={() => deleteEvent(ev.id)} className="p-1 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Upcoming events ── */}
        <div className="card p-5 h-fit animate-fade-up" style={{ animationDelay:'0.10s' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color:'var(--text-primary)' }}>
            <Calendar className="w-4 h-4 text-purple-400" /> Próximos eventos
          </h3>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color:'rgba(139,92,246,0.2)' }} />
              <p className="text-sm" style={{ color:'var(--text-muted)' }}>Nenhum evento próximo.</p>
              <button onClick={() => openModal('')} className="btn-primary px-4 py-2 text-xs mt-4">
                <Plus className="w-3.5 h-3.5" /> Criar evento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl group"
                  style={{ background:'var(--bg-card-hover)', border:'1px solid var(--border)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color:'var(--text-primary)' }}>{ev.title}</p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>
                      {new Date(ev.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}
                      {ev.time && ' · ' + ev.time}
                    </p>
                  </div>
                  <button onClick={() => deleteEvent(ev.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Event Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl p-6 z-10 animate-scale-in"
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', boxShadow:'0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg" style={{ color:'var(--text-primary)' }}>Novo Evento</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color:'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {formErr && (
              <p className="text-xs text-red-400 mb-4 flex items-center gap-1.5 p-2.5 rounded-lg"
                style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {formErr}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Nome do evento *</label>
                <input className="input" placeholder="Ex: Aula de JavaScript" value={form.title}
                  onChange={e => { setForm(f=>({...f,title:e.target.value})); setFormErr('') }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Data *</label>
                  <input className="input" type="date" value={form.date}
                    onChange={e => setForm(f=>({...f,date:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Hora</label>
                  <input className="input" type="time" value={form.time}
                    onChange={e => setForm(f=>({...f,time:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Descrição</label>
                <textarea className="input h-auto py-3" rows={2} placeholder="Detalhes do evento..." value={form.description}
                  onChange={e => setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color:'var(--text-muted)' }}>Cor</label>
                <div className="flex gap-2">
                  {COLOR_OPTS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f=>({...f,color:c}))}
                      className="w-7 h-7 rounded-full transition-all duration-150 hover:scale-110"
                      style={{ background:c, outline: form.color===c ? `3px solid ${c}` : 'none', outlineOffset:2 }} />
                  ))}
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary w-full h-11">
                <Plus className="w-4 h-4" /> Salvar evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
