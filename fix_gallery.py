import re

path = 'components/InteractiveGallery.tsx'
with open(path, 'r') as f:
    c = f.read()

# Look for }; followed by displayName assignment
# This handles the missing ) before the semicolon
if 'InteractiveGallery.displayName' in c:
    # Pattern: }; whitespace InteractiveGallery.displayName
    new_c = re.sub(r'\}\;\s*InteractiveGallery\.displayName', '});\n\nInteractiveGallery.displayName', c)
    if new_c != c:
        with open(path, 'w') as f:
            f.write(new_c)
        print("Updated InteractiveGallery.tsx")
    else:
        print("Regex failed for InteractiveGallery.tsx")
        # Print snippet to debug
        idx = c.find('InteractiveGallery.displayName')
        print(f"Context: {c[idx-20:idx+20]!r}")
