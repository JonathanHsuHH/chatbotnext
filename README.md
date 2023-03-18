# chatbotnext

Mirror site by openAI chat completion API, based on https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt

### Components

- Next.js
- OpenAI API (ChatGPT) - streaming
- API Routes (Edge runtime) - streaming

## How to Use

### Set up environment variables

Rename [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

then, update `OPENAI_API_KEY` with your [OpenAI](https://beta.openai.com/account/api-keys) secret key.

Next, run Next.js in development mode:

```bash
npm install
npm run dev
```

The app should be up and running at http://localhost:3000.
