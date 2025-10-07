#!/bin/bash

# Local App Bridge React Development Script
# Manages local development for @heymantle/app-bridge-react package
#
# Usage:
#   scripts/local-app-bridge-dev.sh on     - Switch to local package (builds tarball and installs it)
#   scripts/local-app-bridge-dev.sh update - Update local package (rebuilds and reinstalls)
#   scripts/local-app-bridge-dev.sh off    - Switch back to published package from package.json

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXTJS_ELEMENT_DIR="$(dirname "$SCRIPT_DIR")"
APP_BRIDGE_REACT_DIR="$NEXTJS_ELEMENT_DIR/../app-bridge-react"

# Package info
APP_BRIDGE_PACKAGE="@heymantle/app-bridge-react"

log() {
    echo -e "${BLUE}[local-app-bridge]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

check_dirs() {
    if [[ ! -d "$APP_BRIDGE_REACT_DIR" ]]; then
        error "App Bridge React directory not found: $APP_BRIDGE_REACT_DIR"
    fi
    if [[ ! -d "$NEXTJS_ELEMENT_DIR" ]]; then
        error "Next.js Element directory not found: $NEXTJS_ELEMENT_DIR"
    fi
}

get_published_version() {
    local package_json="$NEXTJS_ELEMENT_DIR/package.json"
    
    # Extract version from package.json, handling file: paths
    local version=$(grep "\"$APP_BRIDGE_PACKAGE\"" "$package_json" | sed 's/.*: *"\([^"]*\)".*/\1/' | sed 's/[\^~]*//')
    
    # If it's a file: path, get the published version from git
    if [[ "$version" == file:* ]]; then
        # Get the version from git (last committed package.json)
        version=$(git show HEAD:package.json | grep "\"$APP_BRIDGE_PACKAGE\"" | sed 's/.*: *"\([^"]*\)".*/\1/' | sed 's/[\^~]*//')
    fi
    
    echo "$version"
}

build_app_bridge_react() {
    log "Building app-bridge-react package..."
    cd "$APP_BRIDGE_REACT_DIR"
    
    # Check if we're on the right node version
    if [[ -f .nvmrc ]]; then
        log "Using Node version from .nvmrc"
        # Source nvm if available
        if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
            source "$HOME/.nvm/nvm.sh"
            nvm use || warning "nvm use failed, continuing with current Node version"
        else
            warning "nvm not found, continuing with current Node version"
        fi
    fi
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log "Installing dependencies..."
        npm install
    fi
    
    npm run build
    
    # Remove old tarball and create new one
    rm -f heymantle-app-bridge-react-*.tgz
    npm pack
    
    APP_BRIDGE_TARBALL=$(ls heymantle-app-bridge-react-*.tgz | head -1)
    success "App Bridge React tarball created: $APP_BRIDGE_TARBALL"
}

install_local_package() {
    log "Installing local app-bridge-react package in nextjs-element-template..."
    cd "$NEXTJS_ELEMENT_DIR"
    
    # Switch to correct Node version for nextjs-element-template
    if [[ -f .nvmrc ]]; then
        log "Using Node version from .nvmrc"
        nvm use || warning "nvm use failed, continuing with current Node version"
    fi
    
    # Uninstall existing package
    log "Removing existing package..."
    npm uninstall "$APP_BRIDGE_PACKAGE" 2>/dev/null || true
    
    # Install local tarball
    log "Installing app-bridge-react tarball..."
    npm install "$APP_BRIDGE_REACT_DIR/$APP_BRIDGE_TARBALL"
    
    # Clear Next.js cache
    log "Clearing Next.js cache..."
    rm -rf .next
    
    success "Local app-bridge-react package installed successfully!"
    log "Package version:"
    npm list "$APP_BRIDGE_PACKAGE" || true
}

install_published_package() {
    log "Installing published app-bridge-react package in nextjs-element-template..."
    cd "$NEXTJS_ELEMENT_DIR"
    
    # Switch to correct Node version for nextjs-element-template
    if [[ -f .nvmrc ]]; then
        log "Using Node version from .nvmrc"
        nvm use || warning "nvm use failed, continuing with current Node version"
    fi
    
    # Get published version from git
    APP_BRIDGE_VERSION=$(get_published_version)
    
    log "Installing published version: app-bridge-react@$APP_BRIDGE_VERSION"
    
    # Uninstall existing package
    log "Removing local package..."
    npm uninstall "$APP_BRIDGE_PACKAGE" 2>/dev/null || true
    
    # Install published version
    npm install "${APP_BRIDGE_PACKAGE}@^${APP_BRIDGE_VERSION}"
    
    # Clear Next.js cache
    log "Clearing Next.js cache..."
    rm -rf .next
    
    success "Published app-bridge-react package installed successfully!"
    log "Package version:"
    npm list "$APP_BRIDGE_PACKAGE" || true
}

cmd_on() {
    log "Switching to local app-bridge-react package..."
    check_dirs
    
    # Build app-bridge-react
    build_app_bridge_react
    
    # Install in nextjs-element-template
    install_local_package
    
    success "🎉 Local app-bridge-react package is now active!"
    success "Your nextjs-element-template is now using the local version."
    warning "Remember to refresh your browser to see changes."
}

cmd_update() {
    log "Updating local app-bridge-react package..."
    check_dirs
    
    # Check if we're currently using local package
    cd "$NEXTJS_ELEMENT_DIR"
    local using_local=false
    
    # Check package.json first
    if grep -q "\"$APP_BRIDGE_PACKAGE\": \"file:" package.json 2>/dev/null; then
        using_local=true
    fi
    
    # Check package-lock.json as fallback
    if [[ "$using_local" == "false" ]] && grep -q "\"$APP_BRIDGE_PACKAGE\": \"file:" package-lock.json 2>/dev/null; then
        using_local=true
    fi
    
    if [[ "$using_local" == "false" ]]; then
        warning "It looks like you're not currently using the local package."
        warning "Run 'scripts/local-app-bridge-dev.sh on' first to switch to local package."
        exit 1
    fi
    
    # Build app-bridge-react
    build_app_bridge_react
    
    # Install in nextjs-element-template
    install_local_package
    
    success "🔄 Local app-bridge-react package updated successfully!"
    warning "Remember to refresh your browser to see changes."
}

cmd_off() {
    log "Switching back to published app-bridge-react package..."
    check_dirs
    
    # Install published package in nextjs-element-template
    install_published_package
    
    success "📦 Back to published app-bridge-react package!"
    success "Your nextjs-element-template is now using the published version from npm."
}

cmd_status() {
    log "Checking current package status..."
    cd "$NEXTJS_ELEMENT_DIR"
    
    echo ""
    echo "Current package installation:"
    npm list "$APP_BRIDGE_PACKAGE" 2>/dev/null || true
    
    echo ""
    # Check if we're using local package (check both package.json and package-lock.json for file: paths)
    local using_local=false
    
    # Check package.json first
    if grep -q "\"$APP_BRIDGE_PACKAGE\": \"file:" package.json 2>/dev/null; then
        using_local=true
    fi
    
    # Check package-lock.json as fallback
    if [[ "$using_local" == "false" ]] && grep -q "\"$APP_BRIDGE_PACKAGE\": \"file:" package-lock.json 2>/dev/null; then
        using_local=true
    fi
    
    if [[ "$using_local" == "true" ]]; then
        success "Currently using LOCAL app-bridge-react package (tarball)"
    else
        success "Currently using PUBLISHED app-bridge-react package"
    fi
}

show_help() {
    echo "Local App Bridge React Development Script"
    echo ""
    echo "Usage:"
    echo "  scripts/local-app-bridge-dev.sh on       Switch to local package (builds and installs)"
    echo "  scripts/local-app-bridge-dev.sh update   Update local package (rebuilds and reinstalls)"
    echo "  scripts/local-app-bridge-dev.sh off      Switch back to published package"
    echo "  scripts/local-app-bridge-dev.sh status   Show current package status"
    echo "  scripts/local-app-bridge-dev.sh help     Show this help message"
    echo ""
    echo "This script manages local development for:"
    echo "  • $APP_BRIDGE_PACKAGE (from ../app-bridge-react)"
    echo ""
    echo "The script will automatically:"
    echo "  • Build package when needed"
    echo "  • Handle Node version switching via nvm"
    echo "  • Clear Next.js cache"
    echo "  • Show package status"
}

# Main command dispatch
case "${1:-help}" in
    "on")
        cmd_on
        ;;
    "update")
        cmd_update
        ;;
    "off")
        cmd_off
        ;;
    "status")
        cmd_status
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        error "Unknown command: $1"
        echo ""
        show_help
        ;;
esac
