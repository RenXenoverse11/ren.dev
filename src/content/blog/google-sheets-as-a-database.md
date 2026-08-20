---
title: 'Running a real app on Google Sheets as the database'
date: '2026-03-19'
summary: 'I built an Internship Management System on Google Apps Script with Google Sheets as the only datastore. It runs in production at zero cost. Here is where that works, and where it stops working.'
tags: ['Google Apps Script', 'Svelte', 'Architecture']
readingTime: 6
image: '/blog/google-sheets-as-a-database.webp'
---

Every instinct I had said use a real database. The Internship Management System
needed to track OJT hours, project assignments, document requests and activity
logs for a cohort of student interns. That is relational data with real
constraints, and Postgres is free to start.

I used Google Sheets instead. It has been running in production since, and it
cost nothing to host. This is the reasoning, and the places where the approach
genuinely breaks down.

## Why Sheets won

The deciding factor was not technical. **The coordinators already lived in
spreadsheets.** Before the system existed, intern hours were tracked in a shared
Sheet that several staff edited by hand. Any database I picked would have meant
teaching them a new admin interface, and building that interface.

With Sheets as the datastore, the fallback is the thing they already knew. If
the app misbehaves, a coordinator opens the Sheet and fixes the row. That is a
genuinely good property for a system handed to non-technical users, and no
amount of schema integrity makes up for losing it.

The rest followed from that:

- **Zero infrastructure.** Apps Script hosts the web app, Sheets stores the
  data, Google handles auth. Nothing to deploy, no server to keep alive, no
  free tier that expires in a year and quietly takes the project down.
- **Backups for free.** Sheets keeps full version history. Point-in-time
  recovery, without configuring anything.
- **Auditability.** Every edit is attributed to a Google account already.

## What it actually looks like

The frontend is Svelte, bundled and served from Apps Script as a single HTML
page. The backend is a set of Apps Script functions the client calls through
`google.script.run`.

The important discipline is treating the sheet like a table and reading it in
one go, rather than cell by cell:

```js
function getInternLogs(internId) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Logs')
  // One call. Reading cell-by-cell in a loop is what makes Apps Script crawl.
  const [header, ...rows] = sheet.getDataRange().getValues()
  const col = Object.fromEntries(header.map((name, i) => [name, i]))

  return rows
    .filter((row) => row[col.internId] === internId)
    .map((row) => ({
      date: row[col.date],
      hours: row[col.hours],
      task: row[col.task],
    }))
}
```

That pattern, one `getValues()` then work in memory, is most of the
performance advice for Apps Script. Each call across the Apps Script bridge
costs far more than the work it does, so the goal is to make as few of them as
possible.

## Where it breaks down

This is the part most posts leave out, so here is the honest list.

**There are no transactions.** Two coordinators approving requests at the same
moment can read the same row, both decide it is pending, and both write. Sheets
will happily accept the second write. `LockService` gets you a mutex and is
essential, but it is a lock you have to remember to take, not a guarantee the
storage layer enforces.

**Quotas are real ceilings, not soft limits.** Apps Script caps script runtime
per execution and total runtime per day. A report that scans every log row is
fine at a few hundred rows and starts timing out in the low thousands. You feel
this well before the Sheets row limit becomes the problem.

**There are no joins.** Every relationship is a lookup you write and optimise by
hand. Three sheets is manageable. The moment I wanted "all interns with an
approved request whose logged hours are behind schedule", I was writing a query
planner by hand, badly.

**No schema means no constraints.** Nothing stops a stray edit putting text in
the hours column. The app validates on write, but the sheet is editable
directly. That is the same openness that made it the right call, cutting the
other way.

**Concurrent readers degrade.** This was built for a cohort of interns and a
handful of staff. It would not survive a few hundred simultaneous users, and I
would not try.

## When I would use this again

I would reach for it when **all** of these hold:

- The data lives in a spreadsheet already, and someone non-technical maintains it
- Writes are low-volume and mostly single-user at a time
- Hosting budget is genuinely zero and must stay that way
- The dataset is thousands of rows, not hundreds of thousands

I would not use it for anything with money, anything with real concurrent
writes, or anything I expected to grow past a single team.

## What I would tell myself at the start

Picking Sheets was right, but I treated it as a database for too long before
admitting it is really a shared document with an API. Once I stopped expecting
integrity from the storage layer and moved every guarantee into the application
(validating on write, locking around read-modify-write, keeping an append-only
log rather than mutating rows), the whole thing got more predictable.

The constraint was never the technology. It was that the people using it needed
to keep their spreadsheet, and building around that was worth more than the
correctness I gave up.
