import re

def check_file(path):
    print(f"Analyzing {path}...")
    with open(path, 'r') as f:
        content = f.read()

    if '<<<<<<<' in content:
        print(f"  FOUND CONFLICT MARKERS!")
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if '<<<<<<<' in line:
                print(f"  Line {i+1}: {line}")
    else:
        print("  No conflict markers found.")

    # Check for unclosed React.memo
    if 'React.memo' in content:
        print("  Contains React.memo")
        # Simple heuristic: Count ( and ) after React.memo
        # This is hard to do robustly with regex, but let's just check the end of the file
        last_lines = content.strip().split('\n')[-5:]
        print(f"  Last lines: {last_lines}")

check_file('components/Hero.tsx')
check_file('components/Footer2026.tsx')
check_file('components/InteractiveGallery.tsx')
check_file('components/CardStack.tsx')
