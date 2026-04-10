from collections import Counter
from pydantic import ValidationError
from models import StockEvent
from gemini_service import generate_stock_events
from mongo_service import save_stock_events, count_events

def validate_events(raw_events: list[dict]) -> tuple[list[StockEvent], list[dict]]:
    valid  : list[StockEvent] = []
    failed : list[dict]       = []

    for i, item in enumerate(raw_events):
        try:
            event = StockEvent(**item)
            valid.append(event)

            direction = "📈 +" if event.quantity_change > 0 else "📉  "
            print(
                f"  ✅ {event.event_id} | {event.event_type:<20} | "
                f"{direction}{abs(event.quantity_change):>4} units | "
                f"{event.expected_date}"
            )
        except (ValidationError, ValueError) as e:
            print(f"  ❌ Event #{i+1} FAILED validation: {e}")
            failed.append({"raw": item, "error": str(e)})

    return valid, failed


# ─────────────────────────────────────────────────────────────────
# SUMMARY REPORT
# ─────────────────────────────────────────────────────────────────
def print_summary(events: list[StockEvent]) -> None:
    """
    Print a statistics summary of the generated events.
    WHY: Gives a quick sanity check — did Gemini generate a realistic
    mix of event types, or all the same type?
    """
    incoming = sum(e.quantity_change for e in events if e.quantity_change > 0)
    outgoing = sum(e.quantity_change for e in events if e.quantity_change < 0)
    net      = incoming + outgoing

    type_counts = Counter(e.event_type for e in events)

    print(f"\n{'─'*50}")
    print(f"  📊 SIMULATION SUMMARY")
    print(f"{'─'*50}")
    print(f"  Total events    : {len(events)}")
    print(f"  Incoming stock  : +{incoming:,} units")
    print(f"  Outgoing stock  : {outgoing:,} units")
    print(f"  Net change      : {net:+,} units")
    print(f"\n  Event Type Breakdown:")
    for event_type, count in type_counts.most_common():
        bar = "█" * count
        print(f"    {event_type:<22} {bar} ({count})")
    print(f"{'─'*50}")

def main() -> None:
    print("=" * 60)
    print("  TASK 4: Future Stock Event Simulation (Audit Trail)")
    print("=" * 60)

    print("\n📡 STEP 1: Generating 10 future stock events via Gemini...\n")
    raw_events = generate_stock_events(count=10)
    print(f"  📦 Gemini returned {len(raw_events)} raw event dicts")

    print(f"\n🔍 STEP 2: Validating events with Pydantic...\n")
    valid_events, failed_events = validate_events(raw_events)
    print(f"\n  ✅ Valid: {len(valid_events)} | ❌ Failed: {len(failed_events)}")

    print_summary(valid_events)

    print(f"\n💾 STEP 3: Saving {len(valid_events)} events to MongoDB audit trail...")
    inserted = save_stock_events(valid_events)
    total    = count_events()
    print(f"  ✅ Inserted: {inserted} audit records")
    print(f"  📊 Total events in audit trail now: {total}")

    print("\n🎉 Task 4 complete! Your audit trail is populated.")
    print("   Check MongoDB: db.stock_events.find({}).pretty()")


if __name__ == "__main__":
    main()