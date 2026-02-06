import re

path = 'components/PerformanceOptimizer.tsx'
with open(path, 'r') as f:
    c = f.read()

# Locate the second reduce which is inside setState(prev => ...)
# We want to replace  with
# But be careful matching.
# The code is:
#           return pendingUpdates.current.reduce((currentState, update) => {
#             return typeof update === 'function' ? (update as any)(currentState) : update;
#           }, prev);

# I'll match  and replace it, but only the one inside the file (there are two reduces, but the first one is ).
# The second one uses .

new_c = c.replace('}, prev);', '}, prev) as T;')

if new_c != c:
    with open(path, 'w') as f:
        f.write(new_c)
    print(f"Updated {path}")
else:
    print("Could not find '}, prev);'")
