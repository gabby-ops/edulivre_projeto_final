# EduLivre v7 — Plataforma EAD

Plataforma de extensão universitária desenvolvida com **React + Vite** (frontend) e **Node.js + Express + Supabase** (backend).

---

## 🚀 Início rápido

### 1. Backend

```bash
cd backend
cp .env.example .env
# Preencha SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e JWT_SECRET no .env

npm install
npm run dev      # desenvolvimento (porta 3001)
```

### 2. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `backend/models/schema.sql`
3. Vá em **Storage → New Bucket**, crie `avatars` com visibilidade **Public**
4. Copie a **URL** e a **service_role key** (Settings → API) para o `.env` do backend
5. Rode o seed: `npm run seed` (cria as contas demo e cursos iniciais)

### 3. Frontend

```bash
# Na raiz do projeto
cp .env.example .env
# .env já vem com: VITE_API_URL=http://localhost:5173/api

npm install
npm run dev      # desenvolvimento (porta 5173)
```

> **Modo offline:** basta deixar `VITE_API_URL` em branco no `.env` do frontend.  
> O app usa localStorage automaticamente — útil para testar sem o backend.

---

## 🔐 Contas demo (após seed)

| E-mail | Senha | Perfil |
|--------|-------|--------|
| aluno@edulivre.com | 123456 | Aluno |
| prof@edulivre.com  | 123456 | Professor |

---

## 📁 Estrutura

```
edulivre/
├── src/                   ← Frontend React/Vite
│   ├── contexts/          ← AuthContext (dual: backend ou offline)
│   ├── pages/             ← Páginas (auth, aluno, professor)
│   ├── components/        ← Componentes compartilhados
│   └── services/api.js    ← Cliente HTTP para o backend
├── backend/
│   ├── controllers/       ← auth, courses, student
│   ├── middleware/        ← JWT auth
│   ├── models/
│   │   ├── database.js    ← Cliente Supabase
│   │   └── schema.sql     ← Schema PostgreSQL (execute no Supabase)
│   ├── routes/api.js      ← Todas as rotas
│   ├── scripts/seed.js    ← Seed de dados demo
│   ├── services/
│   │   └── emailService.js ← Nodemailer (reset de senha + boas-vindas)
│   ├── server.js
│   ├── .env.example       ← Variáveis do backend
│   └── package.json
└── .env.example           ← Variáveis do frontend (Vite)
```

---

## 📡 Endpoints da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /api/auth/register | ❌ | Cadastro |
| POST | /api/auth/login | ❌ | Login |
| GET  | /api/auth/me | ✅ | Usuário logado |
| PUT  | /api/auth/avatar | ✅ | Atualizar avatar (base64 → Storage) |
| POST | /api/auth/forgot-password | ❌ | Solicitar reset por e-mail |
| POST | /api/auth/reset-password | ❌ | Confirmar reset com token |
| GET  | /api/courses | ❌ | Listar cursos |
| POST | /api/courses | ✅ Professor | Criar curso |
| PUT  | /api/courses/:id | ✅ Professor | Editar curso |
| DELETE | /api/courses/:id | ✅ Professor | Remover curso |
| POST | /api/courses/:id/lessons | ✅ Professor | Adicionar aula |
| GET  | /api/progress | ✅ | Progresso em todos os cursos |
| POST | /api/progress/:cid/lesson/:lid | ✅ | Marcar aula concluída |
| GET  | /api/certificates | ✅ | Listar certificados |
| POST | /api/certificates/:courseId | ✅ | Emitir certificado (100%) |
| GET  | /api/favorites | ✅ | Listar favoritos |
| POST | /api/favorites/:courseId | ✅ | Favoritar/desfavoritar |
| GET  | /api/quiz/:courseId | ✅ | Resultado do quiz |
| POST | /api/quiz/:courseId | ✅ | Salvar resultado |
| GET  | /api/health | ❌ | Health check |

---

## ✉️ Configuração de e-mail

No `.env` do backend, preencha as variáveis `SMTP_*`.  
**Gmail:** ative *2FA* → gere uma *App Password* em Segurança → use-a como `SMTP_PASS`.  
**Modo DEV (sem SMTP):** o link de reset é exibido no console do backend.

---

## 🛠 Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Framer Motion  
**Backend:** Node.js, Express, JWT, bcryptjs, Nodemailer  
**Banco:** Supabase (PostgreSQL) + Storage (avatares)
