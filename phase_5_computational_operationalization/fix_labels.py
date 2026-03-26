import json
import os

D1_MAP = {
    "1": "EMOTIONAL",
    "2": "ESTEEM",
    "3": "INFORMATIONAL",
    "4": "NETWORK",
    "5": "TANGIBLE",
    "6": "APPRAISAL"
}

D2_MAP = {
    "1": "LISTENER",
    "2": "REFLECTIVE PARTNER",
    "3": "COACH",
    "4": "ADVISOR",
    "5": "COMPANION",
    "6": "NAVIGATOR"
}

def fix_val(val, mapping):
    if val is None: return None
    v_str = str(val)
    if v_str in mapping:
        return mapping[v_str]
    return val # Keep as is if already string or unknown

def main():
    filename = 'esconv_aroma_full_llm.json'
    if not os.path.exists(filename):
        print(f"Error: {filename} not found")
        return

    with open(filename, 'r') as f:
        data = json.load(f)

    fixed_count = 0
    for i, item in enumerate(data):
        if item:
            old_d1 = item.get('d1')
            old_d2 = item.get('d2')
            
            new_d1 = fix_val(old_d1, D1_MAP)
            new_d2 = fix_val(old_d2, D2_MAP)
            
            if new_d1 != old_d1 or new_d2 != old_d2:
                item['d1'] = new_d1
                item['d2'] = new_d2
                fixed_count += 1

    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"SUCCESS: Fixed labels for {fixed_count} turns in {filename}")

if __name__ == "__main__":
    main()
