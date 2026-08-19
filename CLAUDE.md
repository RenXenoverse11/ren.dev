# Git workflow

- Commit after completing each task, with a clear descriptive message.
- Do NOT `git push` and do NOT open a pull request unless the user explicitly asks for it.
- When pushing, push directly to `main` (commit/merge local work into `main` and push it there) instead of a feature branch. Do not open a pull request for this.

# Blog writing

Posts live in `src/content/blog/`. Set `draft: true` in the frontmatter to keep
a post out of the built site while still previewing it in `npm run dev`.

- Never use em dashes (`—`) in post content. They read as an AI-generated tell.
  Rewrite the sentence with a comma, colon, period, or parentheses instead of
  substituting a hyphen or en dash, which look equally mechanical.
