# MANUAL DE INSTALAÇÃO — EduLivre

## Requisitos

- Node.js 18+ e npm
- Conta no Supabase (para modo backend)

## Instalação Rápida (Modo Offline)

```bash
# 1. Instalar dependências frontend
npm install

# 2. Iniciar desenvolvimento
npm run dev
# Acesse: http://localhost:5173

# Login demo:
# Aluno:    aluno@edulivre.com / 123456
# Professor: prof@edulivre.com  / 123456
```

## Instalação Completa (Com Backend)

### 1. Configurar Supabase

1. Crie um projeto em https://supabase.com
2. Vá em **SQL Editor** e execute `backend/models/schema.sql`
3. Em **Storage**, crie um bucket chamado `avatars` (público)

### 2. Configurar o Backend

```bash
cd backend
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais:
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_SERVICE_KEY=eyJ...
# JWT_SECRET=sua-chave-secreta-longa
```

### 3. Criar contas demo no banco

```bash
node backend/scripts/seed.js
```

### 4. Iniciar o backend

```bash
node backend/server.js
# API rodando em: http://localhost:3001
```

### 5. Configurar o Frontend

```bash
# Na raiz do projeto, edite .env:
VITE_API_URL=http://localhost:3001/api
```

### 6. Iniciar o frontend

```bash
npm run dev
```

## Build para Produção

```bash
npm run build
# Arquivos gerados em: dist/
```

## Variáveis de Ambiente

### Frontend (.env)
| Variável | Valor | Obrigatória |
|----------|-------|-------------|
| `VITE_API_URL` | URL da API backend | Não (modo offline sem ela) |

### Backend (backend/.env)
| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (padrão: 3001) |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Chave service_role do Supabase |
| `JWT_SECRET` | Chave para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Expiração do token (padrão: 7d) |
| `SMTP_*` | Configurações de e-mail (opcional) |
| `FRONTEND_URL` | URL do frontend para links de e-mail |
