---
title: 'What actually happens when you build with an AI agent'
date: '2026-08-19'
summary: 'I rebuilt parts of this portfolio with an AI coding agent driving. Not a demo, but real commits, a real bug it caught, and the places where I had to overrule it.'
tags: ['AI', 'Workflow', 'React']
readingTime: 7
draft: true
---

> **DRAFT, not ready to publish.** Everything in "The session" is what actually
> happened and can stay. Sections marked **[NEEDS YOUR INPUT]** are placeholders
> I can't write for you. They're your opinions and your experience with tools I
> can't observe. Delete this blockquote before publishing.

Most writing about AI coding tools is either a demo that works suspiciously well
or a complaint that it wrote nonsense. I want to write down what actually
happened over one working session on this site, including the parts where the
model was wrong and the parts where I overruled it.

## [NEEDS YOUR INPUT] How I split the two tools

*You use both ChatGPT and Claude. I can see both in your taskbar, but I don't
know how you divide them. A few prompts to answer in your own words:*

- *Which do you reach for first, and for what kind of question?*
- *Is one better for quick syntax lookups vs. multi-file changes?*
- *Has either one burned you badly enough that you stopped trusting it for
  something specific?*

*Two or three honest paragraphs here. This is the part readers can't get
anywhere else, because it's yours.*

## The session

The work was ordinary front-end maintenance: change a font, restructure a
heading, widen some cards, add scroll animations, build a blog. Nothing
architecturally exotic. That's exactly why it's a useful test, because most real
work looks like this, not like a greenfield demo.

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
class selector, so whichever comes **later in the stylesheet wins**. The reveal
rules sit near the top of my CSS, the card rules near the bottom. The card would
have won, silently killing the reveal transition.

The fix was to build the reveal as a keyframe animation with `backwards` fill
instead of a transition. The animation holds the start state through the stagger
delay, then releases entirely when it finishes, so the final `transform` falls
back to the element's own rules and hover still works:

```css
[data-reveal].is-revealed {
  opacity: 1;
  animation: reveal-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: var(--reveal-delay, 0s);
}
```

What I want to flag is the failure mode this avoided. The transition version
wouldn't have thrown an error. It would have looked *almost* right, with some
elements animating and cards just appearing, and I'd have spent an hour assuming
I got the observer wrong.

### The verification mattered more than the code

The animation went in with a check that the cards still lift on hover after
revealing, reading the computed `transform` before and after. It came back
`none` at rest and `translateY(-6px)` on hover, which is the actual proof the
`backwards` fill did what it was supposed to.

At one point a nav-highlighting test came back looking off by one. It turned out
the *test* was wrong. It sampled the active link mid-scroll, before the smooth
scrolling had finished. Re-run with instant scrolling, all five sections were
correct.

That's worth sitting with. If nobody had re-checked, the obvious next move is to
"fix" nav highlighting that was never broken, and now you have a real bug
introduced to solve an imaginary one. **The tool being willing to say "my test
was wrong, the code was fine" is worth more than the code it writes.**

### I overruled it, and that was right

I wanted a blog. The recommendation was to call it "Writeups" instead. The
argument was that "blog" implies a publishing cadence, so going quiet reads as
abandonment, while a writeup from last year is just as valid as one from today.

Reasonable argument. I still said Blog, because that's what people search for and
what it plainly is. The rename went through cleanly: routes, components, CSS
classes, content folder.

I'm keeping this in because it's the realistic shape of the thing. It wasn't
"AI builds my site." It was an argument I considered and rejected, and then the
tedious part got done properly.

### The tradeoffs were surfaced, not hidden

Two examples from the blog build:

**Where markdown gets parsed.** Posts are markdown, but the parser doesn't ship
to the browser. A Vite plugin compiles them at build time, so the bundle carries
rendered HTML instead of a markdown library. Verified by grepping the output
bundle: zero matches for the parser's internals, one for the compiled post text.

**What routing cost.** Giving each post a real URL means adding a router, and
that took the bundle from **73.5 kB to 90.5 kB gzipped**. Not free. I took the
deal because shareable, indexable post URLs are the entire point, but I'd rather
be told the number than discover it later in a Lighthouse report.

## [NEEDS YOUR INPUT] Where it goes wrong

*Two things you can write honestly here, one of which you have first-hand:*

1. *When I drafted the Google Sheets post, I invented specifics about your own
   project (quota limits, `LockService`, concurrency races) that read as
   confident fact but that I'd inferred, not verified. You had to fact-check your
   own experience back into it. That's the single most important caution in this
   whole post: **it is most convincing exactly where it's guessing.** Write that
   up in your own words.*
2. *Anything else that's bitten you: hallucinated APIs, confidently wrong
   versions, outdated library advice.*

## [NEEDS YOUR INPUT] What I'd tell another developer

*Your actual conclusion. Some questions to react to, not a script to copy:*

- *Has it changed what you're willing to take on, or just how fast you do it?*
- *What do you still refuse to hand over?*
- *Would you tell a junior dev to use this, or does it need enough judgment to
  catch the wrong answers that it's a bad first tool?*

*Land on something you actually believe. A hedged ending is worse than a strong
opinion someone disagrees with.*

---

*Written with help from Claude, which also wrote most of the code described
above. Judge the bias accordingly.*
