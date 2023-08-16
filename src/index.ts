import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

type Env = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger(), prettyJSON())

app.get('/', (c) => c.text('Hello Hono!'))

app.get('/health', (c) => c.text('health check ok'))

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    'user id': id
  })
})

// すべてのメッセージを取得する
app.get('/messages', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM messages`
  ).all()

  return c.json({
    'messages': results
  })
})

app.post('/messages', async (c) => {
  const body = await c.req.json()
  await c.env.DB.prepare(
    `insert into messages (message) values (?)`
  )
    .bind(body['message'])
    .run()

  return c.json({
    'message': 'ok'
  })
})

app.get('/messages/:id', async (c) => {
  const id = c.req.param('id')
  const result = await c.env.DB.prepare(
    `SELECT * FROM messages WHERE id = ?`
  )
    .bind(id)
    .first()

  if (result == null) {
    return c.status(404)
  }

  return c.json({
    'message': result['message']
  })
})

export default app