# hackrange

A pentesting dojo that runs entirely on this Mac. No VM, no Docker. Public, live at hackrange.jaybulb.com.

## Layout
- `pentest/` — OWASP Juice Shop on 127.0.0.1 (`run-juiceshop.sh`)
- `re/` — C crackmes (`build.sh`)
- `leetcode/` — algorithm problems with a self-test
- `bench/` — the benchmark: real solves scored against Juice Shop's own scoreboard
- `web/` — the landing, `brand/` — the kit, `docs/` — walkthrough, whitepaper, security, contributing

## Rules for any agent here
- `RULES.md` is binding. Target is `127.0.0.1` or a listed training platform, nothing else.
- Never remove the loopback pin in `run-juiceshop.sh`. Juice Shop is broken on purpose.
- Keep docs current: a solve updates `*/progress.md` and `docs/WALKTHROUGH.md`, and new terminal
  output on the landing is recaptured, never mocked.
- Benchmark solvers stay off the reviews/marsdb endpoints, which crash the target on bad input.

## Deploy
`env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy web --project-name hackrange`. A push deploys nothing.

## The loop

The loop handoff is in `docs/LOOP-HANDOFF.md`: what the loop does, where things stand, what is next, and the restart prompt. Read it before restarting the loop.
