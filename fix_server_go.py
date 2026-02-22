import sys
import re

file_path = 'render-mcp-server-source/cmd/server.go'
with open(file_path, 'r') as f:
    content = f.read()

# Add fmt to imports if not present
if '"fmt"' not in content:
    content = content.replace('"log"', '"fmt"\n\t"log"')

# Change function signature (already done by sed but let's be sure)
content = re.sub(r'func Serve\(transport string\) \*server.MCPServer', 'func Serve(transport string) error', content)

# Replace panic(err) with error return
content = re.sub(
    r'c, err := client.NewDefaultClient\(\)\s+if err != nil \{\s+// TODO:.*?\s+panic\(err\)\s+\}',
    'c, err := client.NewDefaultClient()\n\tif err != nil {\n\t\treturn fmt.Errorf("failed to create default client: %w", err)\n\t}',
    content,
    flags=re.DOTALL
)

# Replace log.Fatalf with return fmt.Errorf
content = content.replace('log.Fatalf("failed to initialize Redis session store: %v", err)', 'return fmt.Errorf("failed to initialize Redis session store: %w", err)')
content = content.replace('log.Fatalf("Starting Streamable server: %v\\n:", err)', 'return fmt.Errorf("starting Streamable server: %w", err)')
content = content.replace('log.Fatalf("Starting STDIO server: %v\\n", err)', 'return fmt.Errorf("starting STDIO server: %w", err)')

# Change return s to return nil
content = re.sub(r'return s\s+\}', 'return nil\n}', content)

with open(file_path, 'w') as f:
    f.write(content)
