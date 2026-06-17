# MANUAL DO ADMINISTRADOR — EduLivre

## Banco de Dados (Supabase)

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Alunos e professores |
| `courses` | Cursos da plataforma |
| `lessons` | Aulas de cada curso |
| `progress` | Progresso dos alunos por aula |
| `certificates` | Certificados emitidos |
| `favorites` | Favoritos dos alunos |
| `quiz_results` | Resultados de avaliações |
| `password_reset_tokens` | Tokens de redefinição de senha |

### Ver todos os alunos (SQL)

```sql
SELECT id, name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC;
```

### Estatísticas gerais (SQL)

```sql
SELECT
  (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_alunos,
  (SELECT COUNT(*) FROM courses) AS total_cursos,
  (SELECT COUNT(*) FROM certificates) AS total_certificados,
  (SELECT COUNT(*) FROM progress) AS total_progresso;
```

## API do Backend

### Endpoints do Professor

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/teacher/students` | Lista alunos com métricas |
| GET | `/api/teacher/students/:id` | Detalhe de um aluno |
| GET | `/api/teacher/stats` | Estatísticas globais |

Todos requerem header: `Authorization: Bearer <token_jwt>`

### Healthcheck

```
GET /api/health
```

Retorna: `{ status: "ok", env: "production", timestamp: "..." }`

## Segurança

- Senhas: bcryptjs com custo 10
- Tokens JWT: expiração configurável via `JWT_EXPIRES_IN`
- Row Level Security: desabilitado (acesso via service_role)
- Recomendação: habilitar RLS em produção com políticas adequadas

## Logs

O backend registra erros no console via `console.error`. Em produção, configure um serviço de logs (ex: Winston, Sentry).

## Backup

Supabase oferece backups automáticos. Acesse Dashboard → Database → Backups.
