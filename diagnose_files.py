import os

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def print_context(content, line_num, context=5):
    lines = content.split('\n')
    start = max(0, line_num - context - 1)
    end = min(len(lines), line_num + context)
    for i in range(start, end):
        print(f"{i+1}: {lines[i]}")

print("--- Hero.tsx Conflict ---")
hero = read_file('components/Hero.tsx')
if '<<<<<<<' in hero:
    start = hero.find('<<<<<<<')
    end = hero.find('>>>>>>>') + 7
    print(hero[start:end+20])

print("\n--- InteractiveGallery.tsx (End) ---")
gallery = read_file('components/InteractiveGallery.tsx')
print(gallery[-300:])

print("\n--- CardStack.tsx (End) ---")
cardstack = read_file('components/CardStack.tsx')
print(cardstack[-200:])

print("\n--- Footer2026.tsx (Start) ---")
footer = read_file('components/Footer2026.tsx')
print(footer[:200]) # Error is at line 49, so start is better
print_context(footer, 49)
