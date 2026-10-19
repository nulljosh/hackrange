# Architecture

Personal security dojo. Three tracks: web penetration testing (OWASP Juice Shop), binary reverse engineering (C crackmes), and algorithm challenges (LeetCode-style). Everything runs locally on this Mac, no VM or Docker. Each track maintains progress and solutions as Markdown files.

## Pentest

| File | What it owns |
|---|---|
| `pentest/run-juiceshop.sh` | Bash script. Installs npm deps if needed, starts the local OWASP Juice Shop instance. Run with `bash pentest/run-juiceshop.sh`. |
| `pentest/juice-shop/` | OWASP Juice Shop submodule. Web application vulnerable-by-design for hacking practice. |
| `pentest/progress.md` | Track of completed vulnerabilities and challenges. Update as you solve them. |
| `pentest/solutions.md` | Writeups and hints for each challenge. |

## Reverse Engineering

| File | What it owns |
|---|---|
| `re/build.sh` | Bash script. Compiles all C crackmes in re/crackmes/ with clang -O0, outputs binaries to re/bin/, then strips them. Run with `bash re/build.sh`. |
| `re/crackmes/` | C source files: crackme1.c (simple string comparison), crackme2.c (char-by-char check). Each is a standalone password/key challenge. |
| `re/progress.md` | Track of solved crackmes and techniques learned. Update as you reverse each binary. |
| `re/solutions.md` | Approach, tools used (objdump, gdb, strings), and solutions for each crackme. |

## Algorithms

| File | What it owns |
|---|---|
| `leetcode/` | Algorithm challenges, LeetCode-style or similar. Keep code in language of choice here. |
| `leetcode/progress.md` | List of solved problems, categories, difficulty levels. |
| `leetcode/README.md` | Overview and learning notes. |

## Workflow

1. Start a track: `bash pentest/run-juiceshop.sh` or `bash re/build.sh` to set up binaries.
2. Work through challenges.
3. When solved, add an entry to the track's `progress.md` (what was solved, technique).
4. Write a summary in the track's `solutions.md` (approach, tools, code snippet if applicable).
5. Nothing here targets anything but the local instance and local binaries.
