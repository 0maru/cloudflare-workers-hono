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
