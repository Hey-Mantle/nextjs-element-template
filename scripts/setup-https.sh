#!/bin/bash

# Setup HTTPS certificates for local development
# This script generates self-signed certificates if they don't already exist

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CERT_DIR="certificates"
CERT_FILE="$CERT_DIR/localhost.crt"
KEY_FILE="$CERT_DIR/localhost.key"
DOMAIN="localhost"

echo -e "${BLUE}🔐 Setting up HTTPS certificates for local development...${NC}"

# Check if certificates already exist
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo -e "${GREEN}✅ Certificates already exist at:${NC}"
    echo -e "   📄 Certificate: $CERT_FILE"
    echo -e "   🔑 Private Key: $KEY_FILE"
    
    # Check if certificates are still valid (not expired)
    if openssl x509 -in "$CERT_FILE" -noout -checkend 86400 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Certificates are valid and not expired${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Certificates exist but are expired or will expire soon${NC}"
        echo -e "${YELLOW}   Regenerating certificates...${NC}"
    fi
fi

# Create certificates directory if it doesn't exist
mkdir -p "$CERT_DIR"

echo -e "${BLUE}🔧 Generating new self-signed certificates...${NC}"

# Generate private key
echo -e "${BLUE}   Generating private key...${NC}"
openssl genrsa -out "$KEY_FILE" 2048

# Generate certificate signing request
echo -e "${BLUE}   Generating certificate signing request...${NC}"
openssl req -new -key "$KEY_FILE" -out "$CERT_DIR/localhost.csr" -subj "/C=US/ST=Development/L=Local/O=Development/OU=IT/CN=$DOMAIN"

# Generate self-signed certificate
echo -e "${BLUE}   Generating self-signed certificate...${NC}"
openssl x509 -req -days 365 -in "$CERT_DIR/localhost.csr" -signkey "$KEY_FILE" -out "$CERT_FILE" -extensions v3_req -extfile <(
cat <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Development
L = Local
O = Development
OU = IT
CN = $DOMAIN

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DOMAIN
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF
)

# Clean up the CSR file
rm -f "$CERT_DIR/localhost.csr"

# Set appropriate permissions
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo -e "${GREEN}✅ HTTPS certificates generated successfully!${NC}"
echo -e "${GREEN}   📄 Certificate: $CERT_FILE${NC}"
echo -e "${GREEN}   🔑 Private Key: $KEY_FILE${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Run ${BLUE}npm run dev${NC} to start the development server with HTTPS"
echo -e "   2. Visit ${BLUE}https://localhost:3000${NC} in your browser"
echo -e "   3. Accept the security warning for the self-signed certificate"
echo ""
echo -e "${YELLOW}⚠️  Note:${NC} You'll need to accept the security warning in your browser"
echo -e "   since this is a self-signed certificate for development only."
