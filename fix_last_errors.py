import re

path = 'components/PerformanceOptimizer.tsx'
with open(path, 'r') as f:
    c = f.read()

new_c = c.replace('typeof update === \'function\' ? update(currentState) : update',
                  'typeof update === \'function\' ? (update as any)(currentState) : update')

if new_c != c:
    with open(path, 'w') as f:
        f.write(new_c)
    print(f"Updated {path}")
else:
    print(f"No changes to {path} (search string not found)")
    # Print context to debug if failed
    idx = c.find('typeof update ===')
    if idx != -1:
        print(f"Found nearby: {c[idx:idx+50]}")
