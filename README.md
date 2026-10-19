# hackrange

Personal cyber security dojo. Two tracks: **pentest** (web app attacks against a real
vulnerable target) and **reverse-engineering** (crackme binaries you disassemble and break).
Everything runs locally on this Mac — no Kali VM, no Docker.

<img src="progress.svg" width="460">

## Setup (already done on this machine)
- `nmap`, `gobuster` — installed via brew
- `clang`, `lldb`, `otool` — ships with Xcode CLT
- Juice Shop runs via `npx` (no install needed)

## Track 1 — Web pentest (OWASP Juice Shop)

Juice Shop is a deliberately vulnerable e-commerce app built by OWASP with 100+ intentional
bugs (XSS, SQLi, broken auth, IDOR, etc), each one a scored "challenge".

```
cd pentest
./run-juiceshop.sh        # starts at http://localhost:3000
```

Then just attack your own localhost. Track solved challenges by ticking them off in
`pentest/progress.md`. The in-app "Score Board" (visit `/#/score-board`) lists every
challenge and its difficulty — start there.

Useful tools once it's running:
- Browser devtools (Elements/Console/Network) — most XSS and IDOR bugs are found here first
- `gobuster dir -u http://localhost:3000 -w <wordlist>` — find hidden endpoints
- `nmap -sV localhost` — see what's actually listening

## Track 2 — Reverse engineering (crackmes)

`re/crackmes/` has tiny C programs compiled without debug symbols. Each one hides a secret
(a password check, a license key check) you have to find by reading assembly, not source.

```
cd re
./build.sh                 # compiles every crackme in crackmes/ to bin/
lldb bin/crackme1           # step through it, set breakpoints, read registers
otool -tv bin/crackme1      # dump disassembly statically
```

Solve order is in `re/progress.md`. Don't peek at the `.c` source until you've solved it —
that's the whole exercise. Solutions are in `re/solutions.md` (spoilers).

## Rules
Only attack Juice Shop on localhost and the crackmes in this repo. Never point these
techniques at anything you don't own or don't have written permission to test.

## Architecture

<img src="architecture.svg" width="600">
