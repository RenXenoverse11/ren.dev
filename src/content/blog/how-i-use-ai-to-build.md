---
title: 'What actually happens when you build with an AI agent'
date: '2026-08-19'
summary: 'I rebuilt parts of this portfolio with an AI coding agent driving. Not a demo — real commits, a real bug it caught, and the places where I had to overrule it.'
tags: ['AI', 'Workflow', 'React']
readingTime: 7
image: '/blog/how-i-use-ai-to-build.webp'
---

Most writing about AI coding tools is either a demo that works suspiciously well
or a complaint that it wrote nonsense. I want to write down what actually
happened over one working session on this site, including the parts where the
model was wrong and the parts where I overruled it.

## How I split the two tools

Claude is what actually touches the code. When the work means driving multiple
files, running commands, and carrying out a real implementation end to end —
like the animation fix and the blog system below — that's Claude in the driver's
seat, not a suggestion I copy-paste myself. ChatGPT stays for the lighter,
disposable stuff: a quick syntax reminder, sanity-checking an idea before I
commit to it, a question that doesn't need repo access to answer.

It's less about one being smarter than the other and more about how much I trust
each one unsupervised. I'll let Claude run for an hour on a scoped task and check
the result afterward. ChatGPT I only ever use for a single reply I can verify
myself in ten seconds. Neither has burned me badly enough on its own that I've
sworn it off for something specific — the failures I have hit came from trusting
output too quickly, not from picking the wrong tool for the job.

## The session

The work was ordinary front-end maintenance: change a font, restructure a
heading, widen some cards, add scroll animations, build a blog. Nothing
architecturally exotic. That's exactly why it's a useful test — most real work
looks like this, not like a greenfield demo.

A few things stood out.

### It caught a bug I would have shipped

I asked for scroll-reveal animations. The obvious implementation is a CSS
transition: start the element at `opacity: 0` and `translateY(20px)`, add a
class when it scrolls into view, let the transition do the rest.

That implementation is broken here, and the reason is subtle. My project and
skill cards already declare their own `transition` and a hover `transform`:

```css
.project {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project:hover {
  transform: translateY(-6px);
}
```

A `[data-reveal]` attribute selector has the same specificity as a `.project`
class selector — so whichever comes **later in the stylesheet wins**. The reveal
rules sit near the top of my CSS, the card rules near the bottom. The card would
have won, silently killing the reveal transition.

The fix was to build the reveal as a keyframe animation with `backwards` fill
instead of a transition. The animation holds the start state through the stagger
delay, then releases entirely when it finishes — so the final `transform` falls
back to the element's own rules and hover still works:

```css
[data-reveal].is-revealed {
  opacity: 1;
  animation: reveal-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: var(--reveal-delay, 0s);
}
```

What I want to flag is the failure mode this avoided. The transition version
wouldn't have thrown an error. It would have looked *almost* right — some
elements animating, cards just appearing — and I'd have spent an hour assuming I
got the observer wrong.

### The verification mattered more than the code

The animation went in with a check that the cards still lift on hover after
revealing — reading the computed `transform` before and after. It came back
`none` at rest and `translateY(-6px)` on hover, which is the actual proof the
`backwards` fill did what it was supposed to.

At one point a nav-highlighting test came back looking off by one. It turned out
the *test* was wrong — it sampled the active link mid-scroll, before the smooth
scrolling had finished. Re-run with instant scrolling, all five sections were
correct.

That's worth sitting with. If nobody had re-checked, the obvious next move is to
"fix" nav highlighting that was never broken — and now you have a real bug
introduced to solve an imaginary one. **The tool being willing to say "my test
was wrong, the code was fine" is worth more than the code it writes.**

### I overruled it, and that was right

I wanted a blog. The recommendation was to call it "Writeups" instead — the
argument being that "blog" implies a publishing cadence, so going quiet reads as
abandonment, while a writeup from last year is just as valid as one from today.

Reasonable argument. I still said Blog, because that's what people search for and
what it plainly is. The rename went through cleanly — routes, components, CSS
classes, content folder.

I'm keeping this in because it's the realistic shape of the thing. It wasn't
"AI builds my site." It was an argument I considered and rejected, and then the
tedious part got done properly.

### The tradeoffs were surfaced, not hidden

Two examples from the blog build:

**Where markdown gets parsed.** Posts are markdown, but the parser doesn't ship
to the browser — a Vite plugin compiles them at build time, so the bundle carries
rendered HTML instead of a markdown library. Verified by grepping the output
bundle: zero matches for the parser's internals, one for the compiled post text.

**What routing cost.** Giving each post a real URL means adding a router, and
that took the bundle from **73.5 kB to 90.5 kB gzipped**. Not free. I took the
deal because shareable, indexable post URLs are the entire point — but I'd rather
be told the number than discover it later in a Lighthouse report.

## Where it goes wrong

When I drafted the Google Sheets post, it invented specifics about my own
project — quota limits, `LockService`, concurrency races — that read as
confident fact but were inferred, not verified. I had to fact-check my own
experience back into my own writing. That's the single most important caution
in this whole post: **it is most convincing exactly where it's guessing.**

The other recurring one is outdated library or API advice — a method signature
or a package version that used to be current and isn't anymore. It reads with
exactly the same confidence as the correct answer, which is what makes it worth
watching for: nothing about the tone signals "this was true two major versions
ago."

## What I'd tell another developer

It changed what I was willing to attempt, not just how fast I got through what I
already knew how to do. Rebuilding the animation system and standing up a whole
blog — content pipeline, routing, drafts — in one sitting isn't something I'd
have queued up solo on a portfolio site; the activation energy wasn't worth it.
With an agent actually driving the implementation, it was.

What I still don't hand over is the judgment call. I still read the diff, still
override it when the reasoning is wrong instead of assuming it isn't — see the
Blog-vs-Writeups call above, and the reveal-animation bug it caught that a less
careful pass would have shipped. Would I tell a junior dev to use this? Only with
that same habit attached. Without the discipline to verify instead of trust, it's
a tool that lets you ship confidently wrong things faster than you used to.

---

*Written with help from Claude, which also wrote most of the code described
above. Judge the bias accordingly.*
