# chatbotnext

Mirror site by openAI chat completion API, based on https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt

### Components

- Next.js
- OpenAI API (ChatGPT) - streaming
- API Routes (Edge runtime) - streaming
- Redis - save sessions
- Google search API

## How to Use

### Set up environment variables

Rename [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

update `OPENAI_API_KEY` with your [OpenAI](https://beta.openai.com/account/api-keys) secret key.

Next, run Next.js in development mode:

```bash
npm install
npm run dev
```

The app should be up and running at http://localhost:3000.

### About the conservation history

Conservation history is saved in redis, it's optinal, you can remove it if you don't need it.

Setup: Deploy a redis server, in .env.local update `REDIS_URL` with redis server, such as localhost:6379

### About the web search plugin

With web search result, you can let chatGpt to search the web for you, and return the result.

Setup: In .env.local, update `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_CONTENXT_KEY` for web search, refer to (https://developers.google.com/custom-search/v1/introduction#identify_your_application_to_google_with_api_ke)

Usage: Turn on the web search button in left pane. By default, the input message will be used as search key words and the search results will by be included in a default prompt. You can also set your own prompt using ##...## to enclose the search keyword.