#!/usr/bin/env python3
"""
FifthStar — Free sample generator
==================================
Takes a merchant's 3 latest Google reviews and produces 3 on-brand,
British-tone reply drafts (one per review). Output is a JSON array of
3 strings you can drop straight into the one-pager / outreach email.

USAGE
-----
1. Set your key (DeepSeek is the default provider):
     export DEEPSEEK_API_KEY="sk-..."
   To use OpenAI instead:
     export SAMPLE_PROVIDER=openai
     export OPENAI_API_KEY="sk-..."
2. Put reviews in a JSON file, e.g. reviews.json:
     [
       {"stars": 5, "text": "Absolutely loved our dinner..."},
       {"stars": 3, "text": "Food was good but we waited 40 min..."},
       {"stars": 4, "text": "Great little spot, only downside loud..."}
     ]
3. Run:  python generate_sample.py reviews.json > drafts.json
   Or pipe: cat reviews.json | python generate_sample.py

Provider defaults to DeepSeek (model deepseek-chat). Switch with
SAMPLE_PROVIDER=openai (model gpt-4o-mini). Override model: SAMPLE_MODEL=...
Override key: SAMPLE_KEY=...  No third-party libs needed (urllib + stdlib).
"""
import sys, json, os, re, urllib.request

# --- provider selection (DeepSeek default; OpenAI-compatible) ---
PROVIDER = os.environ.get("SAMPLE_PROVIDER", "deepseek").lower()
MODEL = os.environ.get("SAMPLE_MODEL") or {
    "deepseek": "deepseek-chat",
    "openai": "gpt-4o-mini",
}.get(PROVIDER, "deepseek-chat")

if PROVIDER == "deepseek":
    API = "https://api.deepseek.com/chat/completions"
    KEY_ENV = "DEEPSEEK_API_KEY"
elif PROVIDER == "openai":
    API = "https://api.openai.com/v1/chat/completions"
    KEY_ENV = "OPENAI_API_KEY"
else:
    sys.stderr.write(f"ERROR: unknown SAMPLE_PROVIDER={PROVIDER!r} (use 'deepseek' or 'openai')\n")
    sys.exit(2)

SYSTEM = (
    "You are FifthStar, a UK-local specialist who writes Google review "
    "replies for small British businesses (restaurants, salons, clinics, trades). "
    "You write in warm, natural British English — never corporate, never robotic. "
    "Rules: (1) One reply per review provided, in the same order. "
    "(2) For praise (4-5★): genuine, specific thanks; invite them back without being salesy. "
    "(3) For complaints (1-3★): acknowledge specifically, brief sincere apology if warranted, "
    "NEVER make excuses, offer to resolve offline / ask them to ask for the manager — do not "
    "offer compensation you can't promise. (4) 1-3 sentences, plain language, no hashtags, "
    "no emoji, no 'We hope this message finds you well' filler. (5) Sound like a real local "
    "owner, not a bot. Output STRICTLY a JSON array of exactly N strings, no extra text."
)

def normalize_drafts(content, n):
    """Robustly turn a model response into a clean JSON list of N strings.

    Handles every shape DeepSeek/OpenAI has actually returned:
      - a raw JSON array  ["...","...","..."]
      - {"replies":["...",...]}  (json_object mode)
      - {"replies":"[\"...\"]"}   (double-encoded string  ← the old bug)
      - markdown code fences  ```json ... ```
      - text with an embedded [...] / {...} block
    Returns a plain Python list (of strings). Never a string, never double-encoded.
    """
    s = (content or "").strip()
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z]*\n?", "", s)
        s = re.sub(r"\n?```$", "", s).strip()
    for _ in range(5):
        try:
            obj = json.loads(s)
        except Exception:
            m = re.search(r"(\[.*\]|\{.*\})", s, re.DOTALL)
            if not m:
                break
            s = m.group(1)
            continue
        if isinstance(obj, list):
            out = []
            for it in obj:
                if isinstance(it, str):
                    try:
                        sub = json.loads(it)
                        if isinstance(sub, list):
                            out.extend(sub)
                            continue
                    except Exception:
                        pass
                out.append(it)
            return out
        if isinstance(obj, dict):
            cand = None
            for k in ("replies", "reply", "responses", "results", "drafts", "output"):
                if k in obj:
                    cand = obj[k]
                    break
            if cand is None:
                lists = [v for v in obj.values() if isinstance(v, list)]
                cand = lists[0] if lists else None
            if cand is None:
                strs = [v for v in obj.values() if isinstance(v, str)]
                cand = strs[0] if strs else None
            if cand is None:
                return []
            s = cand if isinstance(cand, str) else json.dumps(cand, ensure_ascii=False)
            continue
        break
    return []


def self_test():
    """Offline verification of the parser — no API key / network needed.

    Covers every response shape the model has actually returned (the historic
    source of bugs): raw array, json_object, double-encoded string, markdown
    fences, text with an embedded block, and an array-within-a-string element.
    Returns 0 if all pass, 1 otherwise.
    """
    cases = [
        ("raw JSON array",
         '["Thanks!","Sorry about the wait.","Glad you liked it."]',
         ["Thanks!", "Sorry about the wait.", "Glad you liked it."]),
        ("json_object with replies list",
         '{"replies":["a","b","c"]}',
         ["a", "b", "c"]),
        ("double-encoded string (old bug)",
         '{"replies":"[\\"x\\",\\"y\\"]"}',
         ["x", "y"]),
        ("markdown code fence",
         '```json\n["one","two"]\n```',
         ["one", "two"]),
        ("array embedded in prose",
         'Here you go:\n["p","q","r"]\nCheers',
         ["p", "q", "r"]),
        ("array-inside-string element",
         '["a", "[\\"b\\",\\"c\\"]", "d"]',
         ["a", "b", "c", "d"]),
        ("json_object with output string",
         '{"output":"[\\"p\\",\\"q\\"]"}',
         ["p", "q"]),
        ("garbage (no json)",
         "no json here at all",
         []),
        ("empty string",
         "",
         []),
    ]
    ok = 0
    for label, raw, exp in cases:
        got = normalize_drafts(raw, len(exp) if exp else 3)
        if got == exp:
            ok += 1
            sys.stderr.write(f"  PASS  {label}\n")
        else:
            sys.stderr.write(f"  FAIL  {label}\n    expected={exp!r}\n    got={got!r}\n")
    sys.stderr.write(f"\nself-test: {ok}/{len(cases)} passed\n")
    return 0 if ok == len(cases) else 1


def main():
    if "--self-test" in sys.argv:
        sys.exit(self_test())

    key = os.environ.get("SAMPLE_KEY") or os.environ.get(KEY_ENV)
    if not key:
        sys.stderr.write(f"ERROR: set {KEY_ENV} first (export {KEY_ENV}=...)\n")
        sys.exit(2)
    raw = sys.stdin.read() if (len(sys.argv) < 2 or sys.argv[1] == "-") \
          else open(sys.argv[1], encoding="utf-8").read()
    try:
        reviews = json.loads(raw)
    except Exception as e:
        sys.stderr.write(f"ERROR: reviews must be a JSON array: {e}\n")
        sys.exit(3)
    if not isinstance(reviews, list) or not reviews:
        sys.stderr.write("ERROR: expected a non-empty JSON array of reviews\n")
        sys.exit(3)

    user = "Write a reply for each review below. Return a JSON array of exactly " \
           f"{len(reviews)} strings.\n" + json.dumps(reviews, ensure_ascii=False)
    body = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user",   "content": user},
        ],
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
    }, ensure_ascii=False).encode("utf-8")

    req = urllib.request.Request(API, data=body, headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read().decode("utf-8"))
    except Exception as e:
        sys.stderr.write(f"API ERROR: {e}\n")
        sys.exit(4)

    content = resp["choices"][0]["message"]["content"]
    drafts = normalize_drafts(content, len(reviews))
    # coerce every element to a string (model rarely returns non-strings, but be safe)
    drafts = [str(d) for d in drafts]
    print(json.dumps(drafts, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
