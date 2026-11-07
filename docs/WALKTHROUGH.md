# Walkthrough: every hack, explained

Plain-English notes on each thing the benchmark breaks and *why* it works. Do the challenge yourself
first, then read the matching note. Every target here is local: Juice Shop on `127.0.0.1:3000` or a
binary in this repo. See [../RULES.md](../RULES.md).

The golden rule under all of it: the app trusts input it shouldn't. Every hack below is one version of
that sentence.

## Pentest (OWASP Juice Shop)

### 1. Login Admin — SQL injection
The login form builds a query like `SELECT * FROM Users WHERE email = '<you>' AND password = '...'`.
Send the email `' OR 1=1--`. The first quote closes the string early, `OR 1=1` makes the WHERE always
true, and `--` comments out the password check. You log in as the first user in the table, the admin.
**Lesson:** never build SQL by pasting strings together. Use parameterised queries.

### 2. Login Bender — targeted SQL injection
Same bug, aimed. Email `bender@juice-sh.op'--` closes the string right after a real address and comments
out the password, so you land in that specific account without the password.

### 3. Weak admin password
The admin ships with `admin123`. No injection, just a guess. **Lesson:** weak and default passwords
fall to a wordlist in seconds. This is still how a huge share of real breaches start.

### 4. Database schema — UNION injection
The product search is injectable too. `')) UNION SELECT sql,'2',...,'9' FROM sqlite_master--` bolts a
second query onto the first. `UNION` needs the same column count (nine here), and `sqlite_master.sql`
holds every table's `CREATE TABLE` statement, so the search results hand you the whole schema.
**Lesson:** one injection point leaks the shape of the entire database, which is the map for everything next.

### 5. Confidential document — broken access control
`GET /ftp/acquisitions.md`. A sensitive file was dropped in a folder the web server happily lists and
serves. No auth, no trick, just a URL nobody meant you to visit. **Lesson:** "nobody knows the link" is
not access control.

### 6. Exposed metrics — information disclosure
`GET /metrics` returns a Prometheus dump: internal counters, routes, versions. Meant for monitoring, left
public. **Lesson:** operational endpoints need the same auth as everything else.

### 7. Register as admin — mass assignment
Signup accepts a JSON body and trusts all of it, including a `role` field it should set itself. Post
`{"email":..,"password":..,"role":"admin"}` and you create an admin account. **Lesson:** allow-list the
fields a user may set; never bind a request body straight onto your model.

### 8. Empty user registration — missing validation
The API creates a user with an empty email and password. **Lesson:** validate at the trust boundary, on
the server. The client form's "required" attribute is decoration an attacker skips by calling the API directly.

### 9. Security policy — the convention itself
A `security.txt` at `/.well-known/` tells researchers how to report bugs. The challenge is knowing the
convention exists and looking for it. **Lesson:** reconnaissance is half the job; well-known paths are the
first place to look.

## Reverse engineering (crackmes)

### crackme1 — the password is just sitting there
Compiled, stripped of symbols, but the password `hunter2` is a plain C string, so it survives into the
binary verbatim. `strings bin/crackme1` prints it. In lldb you can watch it too: break on `fgets`, step
out, break on `strcmp`, and read register `x1` at the compare to see your input lined up against the
secret. **Lesson:** a secret baked into a binary is not secret. `strings` is the first thing anyone runs.

### crackme2 — obfuscation that isn't
This one stores the key XORed byte by byte, so `strings` finds nothing. But the XOR key (`0x5A`) and the
encoded bytes are both right there in the disassembly (`otool -tv` shows the `eor w8, w8, #0x5a` loop). XOR
is its own inverse: read the encoded bytes out of the Mach-O, XOR each with `0x5A`, and the key `KX92-QT7Z`
falls out. **Lesson:** obfuscation slows a reader down, it doesn't stop one. Real secrets live server-side,
never in code you ship.

## LeetCode

Not hacking, but the same muscle: see the structure under the problem. The notes live in the code itself
(`leetcode/solutions.py`), one comment per solution naming the trick, hash map, stack, sliding window,
one pass. Run `python3 -I leetcode/solutions.py` to check them.

## How the benchmark proves all this

`bench/bench.py` doesn't trust its own payloads. After each pentest solver fires, it asks Juice Shop's own
`/api/Challenges` scoreboard whether that challenge flipped to solved, so a request that returns `200`
without actually exploiting anything still scores zero. The crackme solvers extract the secret and then run
the binary to confirm it accepts it. Nothing is marked solved on faith.
