import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

app.use('*', logger(), prettyJSON())
app.get('/', (c) => c.text('Hello Hono!'))

app.get('/health', (c) => c.text('health check ok'))

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    'user id': id
  })
})

export default app
