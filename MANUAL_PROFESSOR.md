# MANUAL DO PROFESSOR — EduLivre

## Acesso ao Painel

Login: `prof@edulivre.com` / `123456` (conta demo)

URL do painel: `/professor`

## Dashboard

O dashboard exibe automaticamente:
- **Cursos criados**: total de cursos na plataforma
- **Total de aulas**: soma de todas as aulas
- **Alunos**: total de alunos cadastrados (dados reais do banco)
- **Certificados**: total emitidos
- **Quizzes realizados**: total de avaliações feitas
- **Média dos quizzes**: percentual médio de acertos

O botão 🔄 no canto superior direito atualiza os dados em tempo real.

## Gerenciar Alunos

Acesse: **Menu → Alunos**

### Busca
Digite nome ou e-mail na barra de busca. Filtro em tempo real.

### Ordenação
Use o menu suspenso para ordenar por:
- Mais recentes / Mais antigos
- Nome A→Z / Z→A
- Mais aulas concluídas
- Mais certificados

### Cards de Aluno
Cada card exibe:
- Nome e e-mail
- Data de cadastro
- Aulas concluídas
- Certificados obtidos
- Média nas avaliações (quizzes)

### Exportação CSV
Clique em **CSV** para baixar a lista completa de alunos com todas as métricas. O arquivo é compatível com Excel e Google Sheets.

### Atualização
Clique em **Atualizar** para recarregar os dados do banco.

## Modo Online vs Offline

- **● Backend** (verde): dados vêm do banco Supabase em tempo real
- **● Offline** (amarelo): dados locais do navegador (modo sem backend)

No modo offline, apenas alunos cadastrados no mesmo navegador aparecem.

## Relatórios

Acesse: **Menu → Relatórios**

Exibe:
- Totais de alunos, cursos, aulas, certificados
- Média geral dos quizzes
- Distribuição de cursos por categoria (barras de progresso)
- Ranking de cursos por número de aulas

## Criar Cursos

Acesse: **Menu → Adicionar Curso** ou clique em "Criar novo curso" no Dashboard.

## Gerenciar Cursos

Acesse: **Menu → Gerenciar Cursos** para editar, adicionar aulas ou excluir cursos.
