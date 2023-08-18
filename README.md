# cloudflare-workers-hono

[hono(webフレームワーク)](https://github.com/honojs/hono) で作成したWebサーバを Cloudflare Workers　にデプロイするハンズオン

## GitHub

<https://github.com/honojs/hono>

## 公式ドキュメント

<https://hono.dev/>

## 手順

### プロジェクトの作成

```:shell
npm create hono@latest cloudflare-workers-hono
```

### package.json を書き換える

```:json
{
  "scripts": {
    "dev": "wrangler dev src/index.ts",
    "deploy": "wrangler deploy --minify src/index.ts"
  },
  "dependencies": {
    "hono": "^3.4.1"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20230628.0",
    "wrangler": "^3.1.2"
  },
  "overrides": {
    "workers": "v1.20230801.0"
  }
}
```

### 依存関係のインストール

```:shell
npm i
```

### 実行してみる

```:shell
npm run dev
```

### ターミナルに表示されているURLをブラウザで開いて動作確認する

「Hello Hono!」と表示されていることが確認できればOK

### エンドポイントの追加

```:javascript
app.get('/health', (c) => c.text('health check ok'))
```

```:javascript
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
      'user id': id
  })
})
```

### ミドルウェアの追加

```:javascript
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

app.use('*', logger(), prettyJSON())
```

### デプロイ

```:shell
npm run deploy
```

デプロイしたらプレビューでエンドポイントにアクセスしてみる

### D1 の作成

```:shell
npx wrangler d1 create cloudflare-d1-sample
```

### D1 の設定を追加

実行してログインしたあとターミナルに表示される下記のテキストを`wrangler.toml` に貼り付ける

```:toml
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "cloudflare-d1-sample"
database_id = "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### D1 用の型定義が使えるようにライブラリを追加

```:shell
npm install --save-dev @cloudflare/workers-types
```

### D1 のテーブル定義と初期データを作成

```:sql
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    message TEXT NOT NULL,
);
INSERT INTO messages (message) VALUES ('First Message');
```

### ローカルにSQLite を作成する

```:shell
wrangler d1 execute cloudflare-d1-sample --local --file=./migration.sql
```

### メッセージを取得できるエンドポイントを作成する

```:javascript
app.get('/messages/:id', async (c) => {
  const id = c.req.param('id')
  const result = await c.env.DB.prepare(
    `SELECT * FROM messages WHERE id = ?`
  ).bind(id).first()
  if (result == null) {
    return c.status(404)
  }

  return c.json({
    'message': result['message']
  })
})
```

### すべてのメッセージを取得できるエンドポイントを作成する

```:javascript
// すべてのメッセージを取得する
app.get('/messages', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM messages`
  ).all()

  return c.json({
    'messages': results
  })
})
```

### メッセージを作成できるエンドポイントを作成する

```:javascript
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
```

### curl でPOSTリクエストを送信する

```:shell
curl 'http://127.0.0.1:8787/messages' \
--header 'Content-Type: application/json' \
--data '{
    "message": "test"
}'
```

### D1 にスキーマと初期データを反映する

```:shell
wrangler d1 execute cloudflare-d1-sample --file=./migration.sql
```

### Workers のデプロイ

```:shell
npm run deploy
```

### D1にPOSTリクエストでデータを登録する

```:curl
curl 'https://DOMAIN/messages' \
--header 'Content-Type: application/json' \
--data '{
    "message": "test"
}'
```

```:curl
curl 'https://my-app.0maru-dev9733.workers.dev/messages' \
--header 'Content-Type: application/json' \
--data '{
    "message": "test"
}'
```

### /messages API にアクセスしてデータを見る

ブラウザで開いてください
