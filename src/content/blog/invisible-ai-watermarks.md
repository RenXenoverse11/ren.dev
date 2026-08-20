---
title: 'What invisible AI watermarks are actually good for'
date: '2026-08-21'
summary: 'An invisible watermark and a "written with AI" disclosure line solve two different problems. Confusing them is why watermarking debates keep talking past each other.'
tags: ['AI', 'Opinion']
readingTime: 5
draft: true
---

An invisible watermark is not the same thing as a disclosure. A
disclosure is a sentence a human decides to write. A watermark is a
signal baked into the output itself, a statistical bias in which tokens
get picked, a pixel-level pattern in an image, detectable later by
whoever has the matching tool, invisible to everyone else. Google's
SynthID is the clearest real example: it nudges token probabilities in
generated text and perturbs pixels in generated images in a way a person
can't see or hear, but a classifier built for exactly that watermark can
still recognize afterward.

Those are different tools solving different problems, and most
arguments about "should AI output be watermarked" collapse because
they treat them as one debate.

## Where it actually earns its cost

Watermarking makes sense wherever the question is "was this actually
real," asked after the fact, by someone who wasn't in the room when it
was made. A photo entered as evidence. A video spreading during a
breaking news event. A wave of near-identical text used to flood a
comment section or a review site. In every one of those cases, nobody
involved is going to volunteer a disclosure, so the only thing that can
answer the question is a signal the generation process left behind
without asking permission. That's a forensics tool, and forensics tools
are supposed to be invisible. A watermark you can see is one people can
route around.

Image and video watermarking also happens to survive the real world
reasonably well: compress the image, resize it, re-encode the video, and
a pixel-level or frame-level pattern spread across the whole file has
somewhere to hide. That's the case where the tool actually works.

## Where it does nothing

Text is the opposite. Paraphrase a sentence, translate it, or just have
a second model rewrite it, and a token-selection watermark is gone,
because the "pattern" was never more than which synonyms got chosen.
It's also just not answering a real threat for most everyday text. A
blog post, an email, a work memo: nobody is trying to forensically prove
after the fact that a human wrote every word of it for a court case.
The actual question people have about that kind of text is a much
smaller one, "did this person get help," and that's a social question
with a social answer: someone can just say so, or not, and readers can
decide what that's worth to them. An invisible watermark answers a
question nobody in that conversation was actually asking.

## The part that's genuinely uncomfortable

Here's the honest tension: an invisible watermark removes the choice
from the equation entirely. A disclosure line is something an author
decides to write or not write, out in the open, and a reader can push
back on that decision. A watermark is a property of the output whether
the author wants it there or not, checked by whoever has the detector,
on their schedule, not the author's. That's exactly why it's the right
tool for adversarial cases (nobody trying to pass off synthetic evidence
as real was going to disclose it voluntarily) and the wrong one for
everything else, where the actual disagreement is about etiquette, not
authenticity.

This blog doesn't put a line at the bottom of a post saying it had AI
help. That was a deliberate choice, made once, visible in the fact that
it isn't there. An invisible watermark on the words themselves would
make that choice for me, permanently, whether I'd made it or not. Those
are not the same kind of transparency, and treating them like they are
is how this debate keeps ending in the wrong place: watermark the
things a human can't tell apart with their own eyes, where the stakes
are a court case or a disinformation campaign. Leave the rest to people
just saying what they did.
