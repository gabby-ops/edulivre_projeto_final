// ============================================================
// EduLivre — Supabase Database Layer
// PostgreSQL gerenciado via @supabase/supabase-js
// ============================================================
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

// UUID helper para compatibilidade com o código existente
const { v4: uuid } = require('uuid')

module.exports = { supabase, uuid }
