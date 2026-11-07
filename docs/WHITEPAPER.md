# hackrange

Security skill doesn't come from reading about SQL injection, it comes from finding one yourself at 11pm and realizing you've walked past the same bug pattern in real code a dozen times without seeing it. Most learning setups get in the way of that: spin up a Kali VM, configure a network, hope Docker behaves. By the time the environment works, the curiosity is gone. That's the gap.

hackrange strips that down to two tracks that run directly on this Mac. Pentest: attack OWASP Juice Shop, a deliberately broken e-commerce app with a hundred-plus scored vulnerabilities, running locally on localhost. Reverse-engineering: crack small C binaries compiled without debug symbols, using lldb and otool to find the hidden check by reading assembly instead of source. No VM, no target that isn't yours, no setup tax between deciding to practice and actually practicing.

The moment it pays off looks like this: `./run-juiceshop.sh`, open the console, find the first XSS in under a minute, tick it off in `progress.md`, and now the next fifteen minutes are just pulling on that thread. Or: `lldb bin/crackme1`, step through, watch a password check materialize out of a register comparison you'd have missed reading the disassembly cold. That's it. That's the whole product.

It's a home gym, not a gym membership. Nobody drives across town to lift for twenty minutes, so nobody does it. Put the equipment in the garage and it gets used.

v0 is exactly this: two local tracks, self-tracked progress, one Mac. There's no v1 planned beyond adding more crackmes and maybe a third track, this isn't a product, it's a dojo, and dojos don't need a business model.

Repo: nulljosh/hackrange. Rules are simple and non-negotiable: only attack Juice Shop on localhost and the crackmes in this repo, never anything you don't own or have written permission to test.
