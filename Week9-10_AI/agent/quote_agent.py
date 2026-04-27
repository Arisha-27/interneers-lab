import os, json, sys, re
from pathlib import Path
from dotenv import load_dotenv
sys.path.insert(0, str(Path(__file__).parent.parent))
load_dotenv()
from google import genai
from google.genai import types
from tools.product_tools import get_product_info, check_inventory, calculate_quote, get_full_quote
from tools.policy_check import enforce_discount_policy
def _run_get_product_info(args):
    return json.dumps(get_product_info(args.strip()), indent=2)
def _run_check_inventory(args):
    return json.dumps(check_inventory(args.strip()), indent=2)
def _run_calculate_quote(args):
    try:
        d = json.loads(args)
        pid, qty = d["product_id"], int(d["quantity"])
    except:
        parts = args.split(",")
        if len(parts) != 2:
            return json.dumps({"error": "Format: 'product_id, quantity'"})
        pid = parts[0].strip()
        try: qty = int(parts[1].strip())
        except: return json.dumps({"error": "Quantity must be integer"})
    result = calculate_quote(pid, qty)
    if result.get("status") == "success":
        q = result["quote"]
        policy = enforce_discount_policy(q["discount_pct"], q["product_id"], q["quantity_requested"])
        if not policy["approved"]:
            result["policy_warning"] = policy["warning"]
    return json.dumps(result, indent=2)
TOOLS = {
    "get_product_info": _run_get_product_info,
    "check_inventory":  _run_check_inventory,
    "calculate_quote":  _run_calculate_quote,
    "get_full_quote":   lambda args: json.dumps(get_full_quote(*[x.strip() for x in args.split(",")]), indent=2) if "," in args else json.dumps({"error": "Format: 'keyword, quantity'"}),
}
SYSTEM_PROMPT = """You are a Quote Agent. USE MINIMAL STEPS to answer.
PRIMARY TOOL (Use this whenever possible to save time/quota):
- get_full_quote: Input = "product_keyword, quantity" e.g. "lego, 60". 
  This one tool handles searching, inventory, and pricing in ONE STEP.
Other Tools (Use only if needed):
- get_product_info: Input = product keyword.
- check_inventory:  Input = product_id.
- calculate_quote:  Input = "product_id, quantity".
Format:
Thought: <reasoning>
Action: <tool name>
Action Input: <input>
When done:
Thought: I have everything.
Final Answer: 
| Item Details | Value |
| :--- | :--- |
| **Product** | {name} ({id}) |
| **Quantity** | {qty} |
| **Unit Price** | ${unit_price} |
| **Subtotal** | ${subtotal} |
| **Discount** | {discount_pct}% ({label}) |
| **Total Savings** | -${savings} |
| **Final Total** | **${total}** |
**Status:** {can_fulfill}
**Warehouse:** {location}
**Policy Note:** {any_warnings}"""
def run_quote_agent(user_request, verbose=True):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"success": False, "error": "GEMINI_API_KEY not set. Get free key at https://aistudio.google.com/app/apikey", "agent_response": "", "user_request": user_request}
    client = genai.Client(api_key=api_key)
    convo  = [types.Content(role="user", parts=[types.Part(text=user_request)])]
    if verbose: print(f"\n{'='*60}\nRequest: {user_request}\n{'='*60}\n")
    final_answer = None
    for step in range(8):
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=convo,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.1,
            ),
        )
        text = resp.text.strip()
        convo.append(types.Content(role="model", parts=[types.Part(text=text)]))
        if verbose: print(f"[Step {step+1}]\n{text}\n")
        if "Final Answer:" in text:
            final_answer = text.split("Final Answer:", 1)[1].strip()
            break
        m = re.search(r"Action:\s*(\w+)\s*\nAction Input:\s*(.+?)(?=\nThought:|\nAction:|\Z)", text, re.DOTALL)
        if not m:
            obs = "Follow the format: Thought/Action/Action Input"
        else:
            name, inp = m.group(1).strip(), m.group(2).strip()
            obs = TOOLS[name](inp) if name in TOOLS else f"Unknown tool: {name}"
        if verbose: print(f"Observation: {obs[:300]}\n")
        convo.append(types.Content(role="user", parts=[types.Part(text=f"Observation: {obs}")]))
    return {
        "user_request":   user_request,
        "agent_response": final_answer or "Max steps reached.",
        "success":        True,
        "error":          None,
    }
if __name__ == "__main__":
    req = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "I need 60 building blocks for a school project, can I get a deal?"
    r = run_quote_agent(req)
    print(f"\n{'='*60}\nFINAL QUOTE:\n{'='*60}\n{r['agent_response']}")
    if r["error"]: print(f"ERROR: {r['error']}")
