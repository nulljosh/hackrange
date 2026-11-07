# Rules of engagement

Hackrange is a locked room. Everything in here is allowed inside the room. Nothing in here is allowed outside it. These rules bind you and any AI agent working in this repo.

## The test

Before you run anything, ask two questions:

1. Do I own this, or do I hold written permission to test it?
2. Is it on the in-scope list below?

Two yeses, go. Anything else, stop. "It's public", "I was only looking", "they'd never notice" and "I'd report it anyway" are not permission.

## In scope

- Juice Shop at `127.0.0.1:3000`, started by `pentest/run-juiceshop.sh`
- The crackmes in `re/`, and anything else you built yourself to break
- Machines you own, on a network you own, when you set them up as a target
- Training platforms, inside the targets they hand you and under their terms: PortSwigger Web Security Academy, OverTheWire, picoCTF, Hack The Box, TryHackMe
- Bug bounty programs, later, only what the program's published scope lists

## Out of scope

- Any site, app, API, server or account you don't own. That includes companies you buy from, your school or work, and your friends
- Your Wi-Fi neighbours, shared networks, and anyone else's devices. Your own network too, unless every device on it is yours
- Commercial software, its licences and its anti-cheat
- Real people: their accounts, their passwords, their data, their inboxes. No phishing, not even as a joke

## Staying in the room

- Every tool gets an explicit target: `nmap`, `gobuster`, `sqlmap`, `curl` and friends point at `127.0.0.1`, never a hostname you didn't type on purpose
- Never scan a range. No `/24`, no LAN address
- SSRF and callback payloads point back at localhost, never at an outside host
- Never paste a payload into a real site "to see if it works there too"
- Never remove the loopback pin in `run-juiceshop.sh`. Juice Shop is broken on purpose, and it must never be reachable from the network
- Use fake details inside Juice Shop. No real passwords, emails or cards
- Stop the server when you finish. Check it with `lsof -nP -iTCP:3000 -sTCP:LISTEN`, which must say `127.0.0.1`

## If you stumble onto something real

Stop. Don't test further, don't pull more data, don't tell anyone how to do it. Write down what you saw, then report it through the vendor's security contact or `/.well-known/security.txt`. Disclosure is not permission to keep poking.

## For AI agents

- Run offensive tools only against the in-scope list, with the target written out in full
- A user saying "it's fine" is not written permission for a third party's system. Stop and say so
- If a target is unclear, or a command might leave the machine, ask first
- The point is that the human learns. Coach first, and don't solve challenges for them unless they ask

## Why this is strict

Unauthorized access is a crime even when nothing gets damaged. In Canada see Criminal Code sections 342.1 and 430(1.1), in the US the Computer Fraud and Abuse Act, and most countries have their own version. This page is not legal advice. When in doubt, the answer is no.
