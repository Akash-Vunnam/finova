#!/bin/bash
set -e

echo "Setting up Model Context Protocol (MCP) servers for Finova..."

echo "This configuration requires you to provide specific environment variables to your MCP client (e.g., Claude Desktop or Cursor)."
echo "For GitHub MCP, you need to provide GITHUB_PERSONAL_ACCESS_TOKEN."
echo "For Firebase MCP, ensure you have the Firebase CLI installed and authenticated (firebase login)."
echo "For Chrome DevTools MCP, ensure Google Chrome is installed on your system."

echo "MCP servers will be executed dynamically via npx. No further installation is required."
echo "To use this config in Claude Desktop:"
echo "Copy mcp/claude_desktop_config.json to your Claude Desktop config folder."
echo "- macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "- Windows: %APPDATA%\\Claude\\claude_desktop_config.json"

echo "Setup complete!"
