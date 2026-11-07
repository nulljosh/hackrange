# Benchmark

Proof the dojo actually breaks things, and a stopwatch on it. Two tracks, scored honestly.

```
./pentest/run-juiceshop.sh      # start the target first (pentest track only)
python3 -I bench/bench.py       # both tracks
python3 -I bench/bench.py --re        # just the crackmes, no server needed
python3 -I bench/bench.py --leetcode  # just the algorithms
```

## How it scores

**Pentest.** Each solver fires its request at Juice Shop on `127.0.0.1:3000`, then the benchmark
asks Juice Shop's own `/api/Challenges` scoreboard whether that challenge flipped to solved. A row
passes only when the app itself marks it solved, so a payload that returns `200` but doesn't actually
exploit anything still fails. That is the point: the score can't be faked.

**Reverse engineering.** Each solver pulls the secret out of the binary the documented way, then runs
the binary and checks it accepts that secret. crackme1's password is a plain string; crackme2's key is
stored XOR'd, so `strings` finds nothing and the solver undoes the XOR.

## Scope

Every request points at `127.0.0.1` or a local binary, and nothing else. The solvers stay off the
reviews/marsdb endpoints because malformed input there can crash Juice Shop. See [../RULES.md](../RULES.md).

## Adding a challenge

Write a solver that returns the Juice Shop challenge key (from `/api/Challenges`), add it to `PENTEST`,
and the scoreboard check does the rest.
