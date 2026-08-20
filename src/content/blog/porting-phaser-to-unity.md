---
title: 'Porting The Last Aethon from Phaser to Unity, mid-build'
date: '2026-08-20'
summary: 'The Phaser prototype worked. I am rebuilding it in Unity anyway. Why, what ported cleanly, and the two silent rendering bugs an agent-driven editor let through before I learned not to trust its "success" response.'
tags: ['Unity', 'Game Dev', 'C#']
readingTime: 6
image: '/blog/porting-phaser-to-unity.webp'
---

The Last Aethon started as a Phaser 3 and TypeScript prototype, and it worked.
Parallax scrolling background, platformer physics, sprite animations for idle,
walk, run, jump, attack and hurt, an HP bar that shifts green to orange to red,
a dialogue system with portraits. A real, playable slice of Act I.

I'm rebuilding that slice in Unity instead of continuing in Phaser. Nothing was
broken. This is a decision about which tools I want driving the next stretch
of work, not a rescue.

## Why leave something that worked

The honest answer is tooling, not features. Phaser would have gotten me a
finished Act I eventually, but every camera behavior, every sprite import,
every animation state machine would have meant hand-rolling something Unity
ships as a package. Cinemachine handles camera framing and dead-end locking
with a component and a few fields instead of clamp math I'd have written
myself. The 2D Animation package and its Aseprite importer take a sprite sheet
straight from the art tool instead of me slicing frames by hand. And critically,
it's an engine an AI agent can actually operate directly, through the Unity
MCP integration, instead of one where the only surface an agent can touch is
the text files describing the game.

That last point matters more than it sounds. Most of this port so far has been
Claude driving the Unity editor directly: creating scenes, wiring components,
importing art, writing the C# behind it. The [previous post](/blog/how-i-use-ai-to-build)
was about that workflow applied to this website. This is the same workflow
pointed at a game engine, and it surfaced a failure mode the website work never
did.

## Trust but verify, the hard way

Unity MCP tool calls return a "success" response whether or not the values it
actually wrote match what was asked for. Twice in the same sub-project, they
didn't.

The first time, a fade-transition canvas came back mistranscribed on nine
separate properties: render mode, sorting order, UI scale mode, reference
resolution, alpha, whether it blocked raycasts, color, anchors, offsets. All
reported as done. None of it was visible from the editor's summary; the only
way to catch it was to open the raw scene YAML and read the actual values.

The second time was quieter and worse. Two UI elements, a prompt text and a
version label, were created with `localScale` set to `{1.7438693, 1.7438693,
1.7438693}` instead of `{1, 1, 1}`:

```yaml
# what the tool reported creating
m_LocalScale: {x: 1, y: 1, z: 1}

# what the scene file actually had
m_LocalScale: {x: 1.7438693, y: 1.7438693, z: 1.7438693}
```

That's not a crash. It's text that renders at the wrong size in a way that's
easy to mistake for a design choice, and it survived a scene save. Reopening
the file didn't reveal it, only re-reading the raw values did. Neither the
implementer nor the first reviewer caught it; only a deliberate second pass
against the spec did.

It happened a third time weeks later, while building the HUD frame: another
`localScale` defect on a reparented element, same category of bug, different
component. Three strikes is a pattern, not a fluke, and the practice it forced
is now just how this project works: re-read the raw scene YAML after every
MCP tool call. The response saying "success" is a claim, not a verification.

## What ported cleanly, and what didn't

The camera work is the clearest win. The Phaser version needed hand-written
follow and clamp logic; here, decoupling the camera's vertical follow onto its
own target object and then locking dead ends with `CinemachineConfiner2D` took
a fraction of the code and behaves better, with smoother damping and no edge
cases I had to think through myself.

Animation import was the opposite experience. Bringing the Ren sprite sheets
over surfaced problems the Phaser version never had: the idle pivot was wrong,
several idle frames imported blank, the walk sheet's frame size was off, and
one file had been misnamed since it was first added. `ren_run.png` was
actually the walk animation, caught only once the run and walk states started
looking identical in-game.

Input is deliberately unfinished. The new Input System's action map is stubbed
with no bindings yet, left for the player-controller work still to come. There
was no reason to guess at bindings before there's a controller to test
them against.

And one mistake that's specific to a live scene graph: an unrelated
dialogue-system scene got accidentally resaved as a side effect of an
unconnected task, and had to be caught and reverted before it merged. A
text-based Phaser/TypeScript project doesn't have this failure mode in the
same way. There's no equivalent of a binary scene silently picking up state
that has nothing to do with the change you're making.

## Where it stands

Foundation and scene flow are done: main menu, a `GameManager` singleton
handling the fade transition, an empty gameplay scene ready to build on. Since
then: parallax Ashenveil Forest backgrounds, dialogue box and portrait art, an
HP and Mana HUD with a framed portrait, and the camera confiner. Player
movement and combat are next, using the original Phaser build as the spec for
what the behavior should actually feel like.

Still Act I. Still in progress. Most of what "porting" has actually looked
like so far is bugs and re-imports, not new features. The parts that did pay
off, mainly the camera, are enough to make the trade worth it.
