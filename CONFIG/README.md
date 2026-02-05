# Evolution API Configuration Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Security Warnings](#security-warnings)
3. [Setup Instructions](#setup-instructions)
4. [Configuration Files](#configuration-files)
5. [Phone Number Format](#phone-number-format)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [API Reference](#api-reference)

## 🔍 Overview

This directory contains configuration files for integrating Evolution API (WhatsApp Business API) with the ENSIDE system. The Evolution API allows you to:

- Send and receive WhatsApp messages programmatically
- Generate QR codes for WhatsApp connection
- Check connection status
- Manage WhatsApp instances

## ⚠️ Security Warnings

### Critical Security Issues

**DO NOT hardcode credentials in source code!**

The following practices are **DANGEROUS** and should be avoided:

- ❌ Hardcoding API keys in JavaScript files
- ❌ Committing credentials to version control (Git)
- ❌ Using ngrok URLs with exposed credentials
- ❌ Sharing credentials in public repositories
- ❌ Storing credentials in localStorage without encryption (not secure for production)

### Why localStorage is NOT Secure

- Anyone with browser access can read localStorage
- Browser extensions can access localStorage
- Credentials are stored in plain text
- No encryption or protection
- **Use only for development/testing**

### Secure Alternatives for Production

1. **Backend Proxy** (Recommended)
   - Route all API calls through your secure backend server
   - Store credentials server-side only
   - Never expose API keys to client browser
   - Example architecture:
     ```
     Browser → Your Backend API → Evolution API
     (No credentials)   (Has credentials)   (Protected)
     ```

2. **Environment Variables**
   - Store credentials in server environment variables
   - Use `.env` files (not committed to Git)
   - Load credentials server-side only

3. **API Gateway**
   - Use AWS API Gateway, Cloudflare, or similar
   - Add authentication layer
   - Rate limiting and monitoring
   - DDoS protection

4. **OAuth/JWT Authentication**
   - Implement proper authentication flow
   - Short-lived tokens
   - Refresh token mechanism

## 🚀 Setup Instructions

### Step 1: Deploy Evolution API Server

Choose one deployment option:

#### Option A: Docker (Local Development)

```bash
# Pull Evolution API Docker image
docker pull atendai/evolution-api:latest

# Run Evolution API
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=your-secure-key-here \
  atendai/evolution-api:latest
```

#### Option B: Render.com (Free Hosting)

1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect to Evolution API repository
4. Deploy with environment variables:
   - `AUTHENTICATION_API_KEY`: Your secure API key
   - `PORT`: 8080

#### Option C: Railway.app (Free Hosting)

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Deploy Evolution API
4. Add environment variables

### Step 2: Access Evolution API Manager

1. Open your Evolution API URL in browser
   - Example: `https://your-server.com/manager`
2. Login with your API key
3. Create a new instance:
   - Click "Create Instance"
   - Give it a name (e.g., "MYCOMPANY")
   - Save the instance name

### Step 3: Configure ENSIDE System

1. **Copy the example configuration file:**
   ```bash
   cd CONFIG
   cp EVOLUTION_API_INTEGRATION.example.js EVOLUTION_API_INTEGRATION.js
   ```

2. **Edit the configuration file:**
   ```javascript
   let evolutionConfig = {
     url: "https://your-evolution-server.com",
     apiKey: "YOUR-SECURE-API-KEY-HERE",
     instance: "MYCOMPANY"
   };
   ```

3. **Test the configuration:**
   - Open your ENSIDE system in browser
   - Go to Evolution API settings page
   - Fill in the configuration form
   - Click "Test Connection"
   - Should show: ✅ Conexão OK

### Step 4: Connect WhatsApp

1. In ENSIDE system, click "Generate QR Code"
2. Wait for QR code to appear
3. Open WhatsApp on your phone
4. Go to: Settings → Linked Devices → Link a Device
5. Scan the QR code
6. Wait for connection confirmation

### Step 5: Send Test Message

1. Enter phone number in international format: `+5511999999999`
2. Type a test message
3. Click "Send Message"
4. Check if message was received

## 📁 Configuration Files

### `EVOLUTION_API_INTEGRATION.js`

Main integration file with security fixes:

- ✅ No hardcoded credentials
- ✅ Input validation for all fields
- ✅ Phone number format validation
- ✅ URL format validation
- ✅ API key validation
- ✅ Proper error handling with descriptive messages
- ✅ Console logging for debugging
- ✅ Fetch timeout protection (10 seconds)
- ✅ DOM safety checks
- ✅ JSDoc comments for all functions
- ✅ Security warnings in comments

### `EVOLUTION_API_INTEGRATION.example.js`

Template configuration file:

- Empty credential placeholders
- Detailed setup instructions
- Security best practices
- Example values (clearly marked)
- Troubleshooting guide
- Phone number format examples

### What Changed from Original

**Security Fixes:**
- ❌ Removed: `"https://isa-unawed-marquetta.ngrok-free.dev"`
- ❌ Removed: `"B6D711FCDE4D4FD5936544120E713976"`
- ❌ Removed: `"ENSIDE2"` as default
- ✅ Added: Empty string defaults
- ✅ Added: Security warning comments
- ✅ Added: Validation functions

**Code Quality Improvements:**
- Better error messages (✅/❌/⚠️ emojis)
- Console logging for debugging
- Input validation before API calls
- DOM element existence checks
- Try-catch blocks for error handling
- JSDoc documentation
- API endpoint constants
- Timeout protection

## 📱 Phone Number Format

### International Format Required

All phone numbers **MUST** include:
1. Plus sign (`+`)
2. Country code
3. Area code (if applicable)
4. Local number

### Format Examples by Country

| Country | Format | Example |
|---------|--------|---------|
| 🇧🇷 Brazil | +55 [DDD] [9XXXX-XXXX] | `+5511999999999` |
| 🇺🇸 USA | +1 [XXX] [XXX-XXXX] | `+15551234567` |
| 🇦🇷 Argentina | +54 [9] [XX] [XXXX-XXXX] | `+5491123456789` |
| 🇵🇹 Portugal | +351 [9XX] [XXX XXX] | `+351911234567` |
| 🇬🇧 UK | +44 [7XXX] [XXX XXX] | `+447911123456` |
| 🇲🇽 Mexico | +52 [XX] [XXXX XXXX] | `+5215512345678` |
| 🇨🇱 Chile | +56 [9] [XXXX XXXX] | `+56912345678` |

### Validation Rules

The system validates phone numbers using this regex:
```javascript
/^\+\d{8,15}$/
```

- Must start with `+`
- Must have 8-15 digits total
- No spaces, dashes, or parentheses (automatically removed)

### Common Mistakes

❌ Wrong formats:
- `11999999999` (missing country code)
- `5511999999999` (missing + sign)
- `+55 (11) 99999-9999` (has formatting - will be auto-cleaned)
- `+55-11-99999-9999` (has dashes - will be auto-cleaned)

✅ Correct formats:
- `+5511999999999`
- `+55 11 99999 9999` (spaces auto-removed)
- `+55 (11) 99999-9999` (formatting auto-cleaned)

## 🔧 Troubleshooting

### Issue: "Erro ao conectar" or Timeout

**Possible causes:**
- Evolution API server is down
- URL is incorrect
- Firewall blocking connection
- Network issues

**Solutions:**
1. Check if server is running:
   ```bash
   curl https://your-server.com/manager
   ```
2. Verify URL in configuration (no typos, no trailing slash)
3. Try accessing URL directly in browser
4. Check server logs for errors
5. Verify firewall settings

### Issue: "API Key inválida" or 401 Unauthorized

**Possible causes:**
- API Key is wrong
- API Key expired
- Extra spaces in API Key

**Solutions:**
1. Copy API Key again from Evolution Manager
2. Check for extra spaces or characters
3. Regenerate API Key if necessary
4. Verify API Key in Evolution Manager settings

### Issue: "Instância não existe"

**Possible causes:**
- Instance not created in Manager
- Instance name doesn't match
- Instance was deleted

**Solutions:**
1. Create instance in Evolution Manager
2. Verify instance name matches exactly (case-sensitive)
3. Check instance status in Manager
4. Try recreating the instance

### Issue: "WhatsApp desconectado"

**Possible causes:**
- WhatsApp not connected yet
- QR code expired
- Phone lost connection

**Solutions:**
1. Generate new QR Code
2. Scan with WhatsApp (Settings → Linked Devices)
3. Check phone internet connection
4. Wait 10-30 seconds after scanning
5. Try disconnecting and reconnecting

### Issue: "Número inválido"

**Possible causes:**
- Missing country code
- Missing + sign
- Wrong format

**Solutions:**
1. Use international format: `+[country][area][number]`
2. Include + sign at start
3. Include country code (e.g., 55 for Brazil)
4. Examples:
   - Brazil: `+5511999999999`
   - USA: `+15551234567`

### Issue: "Request timeout"

**Possible causes:**
- Server is slow or overloaded
- Network latency
- Server is starting up (cold start on free hosting)

**Solutions:**
1. Wait for server to warm up (30-60 seconds on free hosting)
2. Try again in a few moments
3. Check server status/logs
4. Consider upgrading hosting plan

### Issue: localStorage not saving

**Possible causes:**
- Browser privacy mode
- Browser blocking localStorage
- Storage quota exceeded

**Solutions:**
1. Disable private/incognito mode
2. Check browser settings for storage
3. Clear browser storage and try again
4. Try different browser

## ✅ Best Practices

### For Development

1. **Use example configuration file**
   - Copy `EVOLUTION_API_INTEGRATION.example.js`
   - Keep example file in Git
   - Add actual config to `.gitignore`

2. **Test thoroughly**
   - Test connection before sending messages
   - Use test phone numbers
   - Check console logs for errors

3. **Monitor API usage**
   - Check Evolution Manager for usage
   - Monitor rate limits
   - Watch for errors

### For Production

1. **Never expose credentials**
   - Use backend proxy
   - Environment variables only
   - No client-side credentials

2. **Implement rate limiting**
   - Prevent API abuse
   - Protect against spam
   - Queue message requests

3. **Add proper authentication**
   - User login system
   - Session management
   - Permission controls

4. **Monitor and log**
   - Log all API calls
   - Monitor for errors
   - Set up alerts

5. **Use HTTPS only**
   - Encrypt all traffic
   - Valid SSL certificates
   - No mixed content

6. **Implement error recovery**
   - Retry failed requests
   - Queue messages for later
   - Graceful degradation

### Code Organization

1. **Separate concerns**
   - Config in separate file
   - Validation functions isolated
   - API calls in own module
   - UI updates separate

2. **Document everything**
   - JSDoc comments
   - README files
   - Inline explanations
   - Example usage

3. **Validate all inputs**
   - Before API calls
   - Before saving
   - Before displaying

## 📚 API Reference

### Functions

#### `validarNumeroTelefone(numero)`
Validates phone number format (must include country code).

**Parameters:**
- `numero` (string) - Phone number to validate

**Returns:** `boolean` - True if valid, false otherwise

**Example:**
```javascript
validarNumeroTelefone("+5511999999999"); // returns true
validarNumeroTelefone("11999999999"); // returns false
```

#### `validarURL(url)`
Validates URL format.

**Parameters:**
- `url` (string) - URL to validate

**Returns:** `boolean` - True if valid, false otherwise

**Example:**
```javascript
validarURL("https://example.com"); // returns true
validarURL("not-a-url"); // returns false
```

#### `validarAPIKey(key)`
Validates API key is not empty.

**Parameters:**
- `key` (string) - API key to validate

**Returns:** `boolean` - True if valid, false otherwise

#### `fetchWithTimeout(url, options, timeout)`
Creates a fetch request with timeout.

**Parameters:**
- `url` (string) - Request URL
- `options` (Object) - Fetch options
- `timeout` (number) - Timeout in milliseconds (default: 10000)

**Returns:** `Promise<Response>` - Fetch response

**Throws:** Error if timeout or network error

#### `testarConexaoEvolution()`
Tests connection to Evolution API.

**Returns:** `Promise<void>`

**Side effects:**
- Updates UI status element
- Shows alert with result
- Logs to console

#### `salvarConfigEvolution()`
Saves Evolution API configuration to localStorage.

**Returns:** `void`

**Side effects:**
- Saves to localStorage
- Updates evolutionConfig object
- Shows alert with result

#### `gerarQRCode()`
Generates QR Code for WhatsApp connection.

**Returns:** `Promise<void>`

**Side effects:**
- Updates qrCodeContainer element
- Shows alert with result
- Logs to console

#### `enviarMensagemEvolution()`
Sends text message via Evolution API.

**Returns:** `Promise<void>`

**Side effects:**
- Sends message via API
- Clears message form on success
- Shows alert with result

### Constants

#### `API_ENDPOINTS`
API endpoint paths.

```javascript
{
  CONNECTION_STATE: "/instance/connectionState/",
  CONNECT: "/instance/connect/",
  SEND_TEXT: "/message/sendText/"
}
```

#### `REQUEST_TIMEOUT`
Default request timeout in milliseconds: `10000` (10 seconds)

### Configuration Object

#### `evolutionConfig`
Main configuration object.

```javascript
{
  url: string,      // Evolution API server URL
  apiKey: string,   // API authentication key
  instance: string  // Instance name
}
```

## 📞 Support

### Getting Help

1. **Check documentation first**
   - Read this README
   - Check troubleshooting section
   - Review example configuration

2. **Check Evolution API documentation**
   - [Evolution API Docs](https://doc.evolution-api.com/)
   - [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)

3. **Common resources**
   - Evolution API Discord community
   - GitHub Issues
   - Stack Overflow

### Reporting Issues

When reporting issues, include:

1. **Error message** - Exact error text
2. **Console logs** - Browser console output
3. **Steps to reproduce** - How to trigger the error
4. **Configuration** - Server type, browser, etc. (NO credentials!)
5. **Screenshots** - If relevant

**⚠️ NEVER share your API key or credentials in issues!**

## 📝 License

This configuration is part of the ENSIDE MASTER system.

## 🔄 Updates

**Version:** 2.0 (Security Update)
**Last Updated:** 2024
**Changes:**
- Removed hardcoded credentials
- Added input validation
- Improved error handling
- Added security warnings
- Created example configuration
- Added comprehensive documentation

---

**Remember:** Security is not optional. Protect your credentials!
