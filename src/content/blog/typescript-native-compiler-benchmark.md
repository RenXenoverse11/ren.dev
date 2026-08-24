---
title: "TypeScript's native compiler, benchmarked against a project too small to need it"
date: '2026-08-21'
summary: 'The TypeScript team merged their Go-based compiler into main, promising up to 10x. I ran it against this site instead of just repeating the announcement. It is faster. It is not 10x, and the reason why is the actual finding.'
tags: ['TypeScript', 'Performance']
readingTime: 5
image: '/blog/typescript-native-compiler-benchmark.webp'
---

The TypeScript repo's main branch is now mostly Go, not JavaScript. The
team merged their native compiler port, [PR
#63763](https://github.com/microsoft/TypeScript/pull/63763), with a
headline claim of up to 10x faster. I didn't want to just repeat that
number, so I ran it myself.

## The setup

I wasn't running this against my actual site. A brand-new native
compiler is exactly the kind of thing that shouldn't touch a project I
actually deploy, so I copied this repo into a throwaway folder, `npm
install`ed it fresh there, and did everything from that copy. If
something broke, it would break in a folder I was going to delete
anyway, not in this repo's `node_modules` or, worse, its git history.

From that isolated copy: TypeScript 5.9.3 as the baseline, and
`@typescript/native-preview` (the `tsgo` binary, version
`7.0.0-dev.20260707.2`) as the challenger, both run against the same
`tsconfig.json` with `-b --force --noEmit`, `--force` so every run
type-checks from a cold cache instead of reusing incremental build
info.

## The numbers

Three runs each:

```
tsc:   2.82s, 3.19s, 3.08s   -> avg ~3.03s
tsgo:  2.14s, 1.82s, 2.34s   -> avg ~2.10s
```

About 1.4x faster. Not 10x.

That's not a debunking. This site is small: a couple dozen components,
a handful of content files, 86 packages after install. At that size,
most of the wall-clock time is process startup and file I/O, not the
actual type-checking algorithm the Go rewrite speeds up. The 10x claim
is a statement about the compiler's inner loop on a large graph of
files; a project this size barely gives that loop anything to chew on
before the run is already over. Whatever the real multiplier is on a
codebase with thousands of files and a deep import graph, this repo
isn't shaped to show it.

## Same answer, different exit code

A benchmark that only runs on code with zero errors doesn't prove the
new compiler actually checks anything, so I broke something on purpose,
assigning a string to a field typed as a `number`, and ran both again:

```
src/data/site.ts(274,14): error TS2322: Type 'string' is not assignable to type 'number'.
```

Identical message, from both compilers, same file, same line, same
error code. That part matched exactly. What didn't: `tsc` exits with
code `2` on a type error, `tsgo` exits with code `1`. Most CI setups
just check for "non-zero" and won't notice, but a pipeline that
branches on the specific exit code would. Small, verifiable, and the
kind of gap you only find by actually breaking something instead of
reading the changelog.

---

The migration's premise holds up even on a project this small: real
type-checking, same errors, meaningfully faster. What doesn't hold up
is treating "10x" as a number that applies to every command you happen
to run. It's a claim about a compiler's behavior at a scale most
personal projects never reach. Worth remembering the next time a
benchmark headline shows up without the codebase it was measured on.
