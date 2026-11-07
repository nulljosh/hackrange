# Hackrange loop handoff (2026-11-06, late night)

## What the loop is

The loop works through Hackrange's open items one at a time: pentest solves against Juice Shop, reverse engineering on the C crackmes, LeetCode problems, and the benchmark that scores them. Each tick takes the next item, does the real solve against the real target, scores it in `bench/bench.py`, updates the matching `progress.md` and `docs/WALKTHROUGH.md`, then commits and pushes.

RULES.md binds it. Targets are 127.0.0.1 or a listed training platform, nothing else. The loopback pin in `pentest/run-juiceshop.sh` stays.

## Where things stand

- Public repo nulljosh/hackrange under Apache 2.0, with a v0.1.0 release on GitHub.
- Hero terminal animation (b8ce626) types out a real pentest session and loops. The visibility fix (59cf6eb) centers and brightens it; it is deployed to Cloudflare Pages.
- Open follow-up: a user saw a stale cached version of the landing, so add a cache-bust query to the CSS and JS asset links in web/index.html.
- Landing is live at hackrange.jaybulb.com (and hackrange.pages.dev), deployed with `env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy web --project-name hackrange`. A push deploys nothing.
- Benchmark 19/19: pentest 9/9, reverse engineering 2/2, LeetCode 8/8. Every pentest solve is checked against Juice Shop's own `/api/Challenges` scoreboard.
- crackme2 is now XOR-obfuscated, so `strings` finds nothing in it. Crackme binaries are gitignored; rebuild with `re/build.sh`.
- Docs: SECURITY, WHITEPAPER and CONTRIBUTING live in `docs/`. AGENTS.md is gone and CLAUDE.md is short.

## Next, in order

1. Cut v1.0.0. It is a major, so Joshua says yes first.
2. Add CI that runs the benchmark with `--re --leetcode` on every push.
3. Two harder LeetCode problems: Trapping Rain Water and LRU Cache.
4. More Juice Shop challenges, each scored by the benchmark.

## Restart prompt

```
/loop until 90% usage tonight or version 1.0.0
```
