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

app.use('*', logger())
```

### デプロイ

```:shell
npm run deploy
```

デプロイしたらプレビューでエンドポイントにアクセスしてみる


### D1 の作成

```:shell
npx wrangler d1 cloudflare-d1-sample
```

実行してログインしたあとターミナルに表示される下記のテキストを`wrangler.toml` に貼り付ける

```
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "cloudflare-d1-sample"
database_id = "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

```
npm install --save-dev @cloudflare/workers-types
```