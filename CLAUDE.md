# hackrange

Personal security dojo. Everything runs on this Mac, no VM, no Docker. Public repo, live at hackrange.jaybulb.com.

- `pentest/` runs OWASP Juice Shop locally (`run-juiceshop.sh`), `re/` is C crackmes with `build.sh`, `leetcode/` is problems
- Each track keeps `progress.md` and `solutions.md`. Update those, not the README, as things get solved
- Nothing here targets anything but the local instance and the local binaries
- Juice Shop stays pinned to 127.0.0.1 by `run-juiceshop.sh`. Never remove that, it is broken on purpose
- `web/` is the landing, `brand/` the kit. Every terminal block on the site is real output, recapture it rather than mock it up
- Deploy: `env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy web --project-name hackrange`. A push deploys nothing
- `RULES.md` binds every agent here. Read it before running any offensive tool. Target is `127.0.0.1` or a listed platform, nothing else
- Coach first: the human is here to learn, so don't solve challenges unless asked
