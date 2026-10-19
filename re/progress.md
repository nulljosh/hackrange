# Crackme progress

- [ ] crackme1 — find the password with `strings` first, then confirm with lldb
- [ ] crackme2 — `strings` won't show it plainly; use `otool -tv` to read the compare loop

Workflow for each: `otool -tv bin/crackmeN` to read the disassembly, or `lldb bin/crackmeN`
then `b main`, `run`, `disassemble`, step with `si`/`ni`, inspect registers with `register read`.
