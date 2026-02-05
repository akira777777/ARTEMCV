import re

with open('components/EnhancedElements.tsx', 'r') as f:
    content = f.read()

# Pattern to find the GlowCard component body
# We look for "export const GlowCard" and then replace the state and handler
# and usage.

# 1. Replace useState for mousePosition
pattern_state = r'const \[mousePosition, setMousePosition\] = useState\(\{ x: 0, y: 0 \}\);'
replacement_state = 'const mouseX = useMotionValue(0);\n  const mouseY = useMotionValue(0);\n  const glowLeft = useTransform(mouseX, x => x - 100);\n  const glowTop = useTransform(mouseY, y => y - 100);'

if pattern_state not in content:
    print("State pattern not found")
    # It might be formatted differently?
    # Let's try to match loosely.

# 2. Replace handleMouseMove
pattern_handler = r'const handleMouseMove = useCallback\(\(e: React.MouseEvent\) => \{\s*if \(!cardRef.current\) return;\s*const rect = cardRef.current.getBoundingClientRect\(\);\s*setMousePosition\(\{\s*x: e.clientX - rect.left,\s*y: e.clientY - rect.top,\s*\}\);\s*\}, \[\]\);'

replacement_handler = 'const handleMouseMove = useCallback((e: React.MouseEvent) => {\n    if (!cardRef.current) return;\n    const rect = cardRef.current.getBoundingClientRect();\n    mouseX.set(e.clientX - rect.left);\n    mouseY.set(e.clientY - rect.top);\n  }, [mouseX, mouseY]);'

# 3. Replace style usage
pattern_style = r'left: mousePosition.x - 100,\s*top: mousePosition.y - 100,'
replacement_style = 'left: glowLeft,\n              top: glowTop,'

# Use string replace if exact match, or regex.
# Regex is safer for whitespace.

new_content = re.sub(pattern_state, replacement_state, content)
new_content = re.sub(pattern_handler, replacement_handler, new_content)
new_content = re.sub(pattern_style, replacement_style, new_content)

if new_content == content:
    print("No changes made. Patterns might be incorrect.")
else:
    with open('components/EnhancedElements.tsx', 'w') as f:
        f.write(new_content)
    print("Optimization applied.")
