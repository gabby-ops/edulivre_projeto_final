# EduLivre — Backend API

Backend desenvolvido com **Node.js + Express** para o projeto de extensão universitária EduLivre.

## 🚀 Iniciar

```bash
cd backend
cp .env.example .env
npm install
npm run dev      # desenvolvimento (nodemon)
npm start        # produção
```

## 📡 Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /api/auth/register | ❌ | Cadastro de usuário |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Dados do usuário logado |
| PUT | /api/auth/avatar | ✅ | Atualizar avatar |
| GET | /api/courses | ❌ | Listar cursos |
| GET | /api/courses/:id | ❌ | Detalhe do curso |
| POST | /api/courses | ✅ Professor | Criar curso |
| PUT | /api/courses/:id | ✅ Professor | Editar curso |
| DELETE | /api/courses/:id | ✅ Professor | Remover curso |
| POST | /api/courses/:id/lessons | ✅ Professor | Adicionar aula |
| DELETE | /api/courses/:id/lessons/:lid | ✅ Professor | Remover aula |
| GET | /api/progress | ✅ | Progresso em todos os cursos |
| GET | /api/progress/:courseId | ✅ | Progresso em curso específico |
| POST | /api/progress/:courseId/lesson/:lid | ✅ | Marcar aula como concluída |
| GET | /api/certificates | ✅ | Listar certificados |
| POST | /api/certificates/:courseId | ✅ | Emitir certificado |
| GET | /api/favorites | ✅ | Listar favoritos |
| POST | /api/favorites/:courseId | ✅ | Favoritar/desfavoritar |
| GET | /api/quiz/:courseId | ✅ | Buscar resultado de quiz |
| POST | /api/quiz/:courseId | ✅ | Salvar resultado de quiz |
| GET | /api/health | ❌ | Health check |

## 🔐 Autenticação

O token JWT deve ser enviado no header:
```
Authorization: Bearer <token>
```

## 👤 Contas Demo

| E-mail | Senha | Role |
|--------|-------|------|
| aluno@edulivre.com | 123456 | student |
| prof@edulivre.com | 123456 | teacher |

## 🛠 Tecnologias

- **Express.js** — framework HTTP
- **JWT** — autenticação stateless
- **bcryptjs** — criptografia de senhas
- **helmet** — segurança HTTP
- **cors** — Cross-Origin Resource Sharing
- **express-rate-limit** — proteção contra brute-force
- **morgan** — logging de requisições

## 📦 Para Produção

Para produção, substitua o `models/database.js` por:
- **PostgreSQL** com `pg` ou Prisma ORM
- **MongoDB** com Mongoose
- **Supabase** (PostgreSQL gerenciado)
- **Firebase** Firestore

Exemplo com Supabase já está documentado em `/docs/supabase-migration.md`.
