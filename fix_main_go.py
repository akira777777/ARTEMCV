import sys

file_path = 'render-mcp-server-source/main.go'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    '// Start the server\n\tcmd.Serve(transport)',
    '// Start the server\n\tif err := cmd.Serve(transport); err != nil {\n\t\tfmt.Fprintf(os.Stderr, "Error: %v\\n", err)\n\t\tos.Exit(1)\n\t}'
)

with open(file_path, 'w') as f:
    f.write(content)
