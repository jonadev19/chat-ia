# chat-ia

Backend con Bun que recibe una pregunta en lenguaje natural, genera SQL con AI SDK + OpenRouter, valida la consulta y responde en lenguaje natural con datos de PostgreSQL.

## Requisitos

- Bun >= 1.3
- Docker y Docker Compose

## Variables de entorno

Configura estas variables en `.env`:

```bash
PORT=3333
DATABASE_URL=postgresql://chat_ia:chat_ia@localhost:5432/chat_ia
OPENROUTER_API_KEY=tu_api_key
OPENROUTER_MODEL=openrouter/free
```

## Instalacion

```bash
bun install
```

## Base de datos local (PostgreSQL)

Levanta PostgreSQL:

```bash
docker compose up -d
```

Genera y aplica migraciones:

```bash
bun run db:generate
bun run db:migrate
```

Carga datos de ejemplo:

```bash
bun run db:seed
```

## Ejecutar API

Desarrollo:

```bash
bun run dev
```

Produccion local:

```bash
bun run start
```

## Endpoint principal

`POST /chat`

Request:

```json
{
  "message": "cuanto vendi ayer?"
}
```

Response:

```json
{
  "answer": "Ayer vendiste ...",
  "sql": "select ...",
  "rows": []
}
```

## Flujo

1. Usuario envia pregunta.
2. LLM genera SQL.
3. Backend valida SQL (solo lectura).
4. PostgreSQL ejecuta la consulta.
5. LLM redacta respuesta natural.
