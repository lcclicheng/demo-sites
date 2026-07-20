#!/usr/bin/env python3
"""
Fifth Star — Free sample generator
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
import sys, json, os, urllib.request

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
    "You are Fifth Star, a UK-local specialist who writes Google review "
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

def main():
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
    # model may wrap array in {"replies":[...]} or return raw array
    try:
        parsed = json.loads(content)
        drafts = parsed.get("replies", parsed) if isinstance(parsed, dict) else parsed
    except Exception:
        drafts = content
    print(json.dumps(drafts, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
