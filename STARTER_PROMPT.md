# Claude Code Starter Prompt — Phase 1 Foundation

Paste the block below into Claude Code after pointing it at the `Pintail Experience` folder.

---

```
Read CLAUDE.md and "Pintail Experience — Software Build Plan.md", then build it. Don't stop at phase boundaries — keep going.

Supabase project is already created — `.env.local` has the URL and publishable key. I'll paste the service-role key in from Studio.

Create a private GitHub repo `pintail-experience` via `gh repo create`, set the remote, and push every commit to origin automatically.

Only stop for real blockers: missing keys, a migration I need to apply, or a real ambiguity. Flag those clearly when they come up.
```

---

## What's already done (from Cowork)

- ✅ **Supabase project created** — `the-pintail-experience` in `us-east-1` ($10/mo, matches your other projects)
  - Project ref: `phwtjtbzdkgaghjjlpse`
  - Studio: https://supabase.com/dashboard/project/phwtjtbzdkgaghjjlpse
- ✅ **`.env.local` written** with the project URL + publishable key. One TODO: grab the **service-role key** from Studio → Project Settings → API and paste it in.
- ✅ **CLAUDE.md** prepped with project context (auto-loads in Claude Code)
- ✅ **.gitignore** and **.env.example** in place
- ✅ All four planning docs (Action Plan, Background Brief, Deep-Dive, Software Build Plan) in the folder

## What Claude Code will do

- Scaffold the Next.js app in place
- Create the GitHub repo via `gh` CLI (`pintail-experience`, private)
- Generate Supabase migrations (you apply them in Studio)
- Wire up Supabase auth + the three route groups
- Make the first commit (does NOT push — you push when ready)

## Before you paste — one thing

**Grab the service-role key** while you're thinking about it: https://supabase.com/dashboard/project/phwtjtbzdkgaghjjlpse → Project Settings → API → copy `service_role` (or the new "Secret keys" if shown). Paste it into `.env.local` for the `SUPABASE_SERVICE_ROLE_KEY=` line. Don't commit the file — it's gitignored.
