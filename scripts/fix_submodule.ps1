# Remove empty directory causing git submodule warning
Remove-Item -Path "c:\Users\WW\ARTEMCV\mcp-workflowy" -Recurse -Force
git rm --cached mcp-workflowy
