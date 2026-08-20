---
title: 'Keeping MindaRide AI from inventing a bus fare'
date: '2026-08-21'
summary: 'A chatbot that answers fare and schedule questions in Tagalog, Bisaya, English, or Taglish, backed by four LLM providers and never allowed to guess a number. What actually keeps it honest.'
tags: ['AI', 'LLM', 'Supabase']
readingTime: 7
draft: true
---

Every page on MindaRide has a chat bubble in the corner. Ask it "magkano
Davao to Surigao" or "what time is the next bus" and it answers in
whatever language you asked in. The interesting problem isn't the chat
UI. It's making sure the model never just makes up a fare, a departure
time, or a stop, while running on free-tier API budgets that can run out
mid-conversation.

## One client, four providers

`llm-client.ts` is the only file that knows any LLM provider exists.
Gemini, Cerebras, Groq, and OpenRouter all speak the same
OpenAI-compatible `/chat/completions` shape, so one generic fetch client
drives all four:

```ts
const PROVIDERS: ProviderConfig[] = [
  { id: 'gemini', envKey: 'GEMINI_API_KEY', model: 'gemini-2.5-flash', ... },
  { id: 'cerebras', envKey: 'CEREBRAS_API_KEY', model: 'gpt-oss-120b', ... },
  { id: 'groq', envKey: 'GROQ_API_KEY', model: 'llama-3.1-8b-instant', ... },
  { id: 'openrouter', envKey: 'OPENROUTER_API_KEY', model: 'openai/gpt-oss-120b:free', ... },
]
```

Only providers with a configured API key are used, tried in order, and a
failure at any step falls through to the next one. The interesting
failure mode isn't a network error, it's a provider returning HTTP 200
with nothing usable in it:

```ts
// A 200 with neither content nor tool calls is unusable (e.g. Gemini's
// occasional MALFORMED_FUNCTION_CALL). Treat it as a failure so the
// chain falls through to the next provider instead of returning an
// empty reply.
if (!content && (!toolCalls || toolCalls.length === 0)) {
  throw new Error(`[${cfg.id}] empty completion (${reason})`)
}
```

A success status code isn't proof of a usable response. Something had to
actually hit that Gemini failure mode in production for the comment to
exist.

## Grounding means the data comes back with instructions attached

The model can't answer a fare question from what it already "knows."
It has seven typed tools (`search_route`, `list_schedules`,
`list_stopovers`, and so on), Zod-validated, that query Supabase
directly. What makes this actually grounded isn't just that the data is
real. Each tool result carries its own usage instructions baked into the
JSON, tailored to that specific query:

```ts
note: matched
  ? `${base.note} The route DOES pass through ${matched.name} (stop ${matched.order} of ${stops.length}).`
  : `${base.note} ${p.data.place} is NOT on this route's stop list - say the route does not pass through it, and do not substitute a nearby town.`,
```

A general system prompt saying "don't hallucinate" is easy for a model
to drift from three turns into a conversation. A `note` field sitting
right next to the fact the model is about to quote, telling it exactly
what it's allowed to say about that fact, is much harder to ignore.

## Manila has two front doors

Most origin-destination pairs resolve to one route. Davao to Manila
doesn't: buses actually terminate at either Cubao or PITX, and picking
one arbitrarily would just be wrong for half the people asking. The tool
layer special-cases it, resolves both, and hands the model a structured
choice instead of a guess:

```ts
if (!isDavaoManilaPair(origin, destination) && !isManilaDavaoPair(origin, destination)) {
  return null
}
const routes = await Promise.all([
  ds.resolveRoute(origin, 'Cubao'),
  ds.resolveRoute(origin, 'PITX'),
])
```

The `note` on that result tells the model to present both options and
ask which one the commuter wants, rather than pick a default and hope.

## A word that looks like a date

Buried in the system prompt is one line that has nothing to do with
routes at all:

```
NEVER use Tagalog/Bisaya "May" to mean "there is/are" — it gets misread
as the month May (e.g. "May 2" looks like a date). Always use "Meron"
or "Mayroon" instead (e.g. "Meron pang 2 biyahe ngayon", "Mayroong
Aircon na bus").
```

"May 2 biyahe ngayon" reads as either "there are 2 trips today" or "May
2nd" depending entirely on context a model can miss. That's not a bug
you find by reasoning about the system in the abstract, it's a bug you
find by watching a real answer come out wrong and tracing it back to one
ambiguous word.

## Two rate limits, because one memory doesn't survive serverless

There's a 10-per-minute burst limit held in memory, and a separate
40-per-day cap enforced through a Supabase counter. They're not
redundant. Vercel's serverless functions don't guarantee the same
instance handles your next request, so an in-memory map that resets per
instance can't be trusted for a daily total, only Postgres can. And when
the Supabase check itself fails:

```ts
// Atomically bump the caller's usage for today and return the new count. Returns
// null if the check could not run — callers should fail OPEN (never lock out a
// legitimate user because of a transient DB error).
```

the app lets the request through rather than blocking someone over an
infrastructure hiccup on the *rate limiter's* own database call.

## The loop has to end

Tool calls can chain: search a route, then list its schedules, then
check a stopover, all in one exchange. That loop allows up to four
rounds of tool calls; the fifth and final call to the model forces
`tool_choice: 'none'`, so it's compelled to write an actual answer
instead of requesting yet another tool call:

```ts
const toolChoice = round === maxToolRounds ? 'none' : 'auto'
```

If nothing usable comes out even then, the fallback is a plain Tagalog
apology telling the commuter to use the search bar instead. A chat
feature that can silently hang is worse than one that admits it's stuck.

---

None of this makes the model smarter. It makes it harder for the model
to get away with a confident wrong answer: instructions travel with the
data instead of living only in a system prompt, ambiguous phrasing gets
caught and banned one real failure at a time, and every loop in the
system, tool calls, rate limits, provider fallbacks, has an explicit
place it's forced to stop. That's what "grounded" turns out to mean in
practice: not one clever prompt, but a lot of small places where the
system refuses to let the model improvise.
