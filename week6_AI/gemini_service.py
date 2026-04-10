import json
import re
import time
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

def parse_json_from_response(text: str) -> list[dict]:
   
    cleaned = re.sub(r"^```(?:json)?", "", text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"```$",          "", cleaned,      flags=re.MULTILINE)
    cleaned = cleaned.strip()

    try:
        result = json.loads(cleaned)
        if isinstance(result, list):
            return result
        for v in result.values():
            if isinstance(v, list):
                return v
    except json.JSONDecodeError:
        pass

    match = re.search(r"\[.*\]", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group())

    raise json.JSONDecodeError("No valid JSON array found in response", cleaned, 0)


def generate_products(count: int = 10, scenario_hint: str = "") -> list[dict]:
    hint_clause = f"\nScenario context: {scenario_hint}" if scenario_hint else ""

    prompt = f"""
You are a toy store inventory manager.
Generate exactly {count} toy store products as a valid JSON array.{hint_clause}

Each product MUST have these exact fields:
  - "name"        : string (2–100 chars)
  - "category"    : string — MUST be one of: "Action Figures", "Puzzles",
                    "Board Games", "Dolls", "Educational", "Outdoor",
                    "Arts & Crafts", "Vehicles", "Stuffed Animals",
                    "STEM Kits", "Sports", "Other"
  - "price"       : number (float, USD, e.g. 12.99)
  - "quantity"    : integer (0–500)
  - "description" : string (one sentence, max 200 chars)
  - "sku"         : string (format: TOY-XXXX where X is a digit)

CRITICAL RULES:
  • Return ONLY a raw JSON array
  • NO markdown, NO ```json blocks
  • NO explanation text
  • All strings must use double quotes
  • price must be a number
  • quantity must be an integer

Example:
[
  {{
    "name": "Rainbow Puzzle Set",
    "category": "Puzzles",
    "price": 14.99,
    "quantity": 120,
    "description": "A colorful 100-piece puzzle for ages 4 and up.",
    "sku": "TOY-1042"
  }}
]
"""

    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        generation_config=genai.types.GenerationConfig(
            temperature=0.3,
            max_output_tokens=8000,
        ),
    )

    print(f"  🤖 Asking Gemini to generate {count} products...")
    response = model.generate_content(prompt)

    raw_text = ""

    if hasattr(response, "text") and response.text:
        raw_text = response.text
    elif response.candidates:
        raw_text = response.candidates[0].content.parts[0].text
    else:
        raise ValueError("❌ No valid response from Gemini")

    print(f"  ✅ Response received ({response.usage_metadata.total_token_count} tokens)")
    print("\n🔍 RAW RESPONSE PREVIEW:\n", raw_text[:500])

    return parse_json_from_response(raw_text)

def generate_stock_events(count: int = 10) -> list[dict]:
  
    prompt = f"""
You are a warehouse management AI for a toy store.
Generate exactly {count} future stock events as a valid JSON array.

Each event MUST have these exact fields:
  - "event_id"        : string (format: EVT-XXXX, e.g. EVT-0001)
  - "product_name"    : string (a toy product name)
  - "event_type"      : string — MUST be one of:
                        "Expected Delivery", "Scheduled Restock",
                        "Seasonal Spike", "Clearance Sale",
                        "Supplier Delay", "Stock Expiry"
  - "expected_date"   : string (ISO format YYYY-MM-DD, use 2025 or 2026)
  - "quantity_change" : integer (positive = incoming, negative = outgoing)
  - "notes"           : string (one sentence explaining the event)

CRITICAL: Return ONLY a raw JSON array. No markdown. No backticks.

Example:
[
  {{
    "event_id": "EVT-0001",
    "product_name": "Rainbow Puzzle Set",
    "event_type": "Expected Delivery",
    "expected_date": "2025-02-01",
    "quantity_change": 200,
    "notes": "Confirmed shipment of 200 units arriving from the supplier."
  }}
]
"""
    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        generation_config=genai.types.GenerationConfig(
            temperature=0.6,         
            max_output_tokens=3000,
        ),
    )

    print(f"  🤖 Asking Gemini to generate {count} stock events...")
    response = model.generate_content(prompt)
    print(f"  ✅ Response received ({response.usage_metadata.total_token_count} tokens)")

    return parse_json_from_response(response.text)