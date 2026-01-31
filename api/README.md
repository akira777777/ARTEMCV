# Backend API Documentation

## Overview

The ARTEMCV backend is a serverless API built on Vercel that handles contact form submissions by forwarding them to Telegram.

## API Endpoint

### POST `/api/send-telegram`

Sends a contact form submission to a configured Telegram chat.

#### Request Headers

- `Content-Type`: `application/json` (required)
- `Origin`: Your application origin (for CORS)

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services..."
}
```

**Fields:**
- `name` (string, required): Sender's name (min 2 chars, max 100 chars)
- `email` (string, required): Valid email address (max 254 chars per RFC 5321)
- `subject` (string, optional): Message subject (max 200 chars)
- `message` (string, required): Message content (min 10 chars, max 5000 chars)
- `hp` (string, optional): Honeypot field for spam detection (must be empty)

#### Response Codes

- **200 OK**: Message sent successfully
  ```json
  {
    "ok": true,
    "message": "Message sent successfully"
  }
  ```

- **400 Bad Request**: Invalid request data
  ```json
  {
    "error": "Missing required fields: name, email"
  }
  ```

- **413 Payload Too Large**: Request exceeds 100KB
  ```json
  {
    "error": "Request too large"
  }
  ```

- **415 Unsupported Media Type**: Invalid Content-Type
  ```json
  {
    "error": "Content-Type must be application/json"
  }
  ```

- **429 Too Many Requests**: Rate limit exceeded (5 requests per minute per IP)
  ```json
  {
    "error": "Too many requests. Please try again later."
  }
  ```

- **502 Bad Gateway**: Telegram API error
  ```json
  {
    "error": "Failed to send message"
  }
  ```

- **504 Gateway Timeout**: Request timeout (12 seconds)
  ```json
  {
    "error": "Request timeout"
  }
  ```

- **500 Internal Server Error**: Unexpected server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

## Security Features

### Rate Limiting
- Maximum 5 requests per minute per IP address
- Old rate limit entries are automatically cleaned up when map size exceeds 1000 entries

### Input Validation
- All fields are sanitized and validated
- Maximum length enforced on all inputs
- Email format validation using RFC-compliant regex
- HTML escaping to prevent XSS in Telegram messages

### Request Size Limiting
- Maximum request size: 100KB
- Prevents DOS attacks via large payloads

### CORS Protection
- Configurable allowed origins via `ALLOWED_ORIGINS` environment variable
- If not configured, allows all origins (suitable for public APIs)
- Includes security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Vary: Origin` (to prevent cache issues)

### Honeypot Field
- Hidden `hp` field to detect bot submissions
- Bots that fill this field receive a silent success response

### Timeout Protection
- 12-second timeout on Telegram API requests
- Uses AbortController to cancel hanging requests

## Environment Variables

Required environment variables (set in Vercel dashboard or `.env.local`):

```bash
# Telegram Bot Configuration (Required)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# CORS Configuration (Optional)
# Comma-separated list of allowed origins
# Leave empty to allow all origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Setting Up Telegram

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow instructions
   - Save the bot token provided

2. **Get Your Chat ID:**
   - Start a chat with your bot
   - Send a message
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat.id` in the response

3. **Set Environment Variables:**
   - Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to Vercel project settings
   - Or add them to `.env.local` for local development

## Logging

The API logs all requests in JSON format for monitoring:

```json
{
  "timestamp": "2026-01-31T11:22:00.000Z",
  "action": "success",
  "method": "POST",
  "ip": "192.168.1.1",
  "email": "user@example.com"
}
```

**Log Actions:**
- `preflight`: CORS preflight request
- `invalid_method`: Non-POST request received
- `rate_limited`: IP exceeded rate limit
- `validation_failed`: Request validation failed
- `field_validation_failed`: Field validation failed
- `telegram_api_error`: Telegram API returned error
- `timeout`: Request timed out
- `error`: Unexpected error occurred
- `success`: Message sent successfully

## Testing

Run the comprehensive test suite:

```bash
npm run test:run
```

The test suite includes:
- 32 backend-specific tests covering:
  - Email validation
  - HTML escaping
  - String sanitization
  - Field validation
  - Rate limiting
  - CORS configuration
  - IP extraction
  - Telegram message formatting
  - Timeout handling
  - Constants validation

## Development

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with required variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Test the API locally:
   ```bash
   curl -X POST http://localhost:5173/api/send-telegram \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello from local!"}'
   ```

### Type Checking

```bash
npm run typecheck
```

## Architecture

### Request Flow

1. **CORS Preflight** → Handle OPTIONS request
2. **Method Validation** → Ensure POST method
3. **Rate Limiting** → Check IP-based rate limits
4. **Request Validation** → Validate headers and body structure
5. **Field Validation** → Validate and sanitize all fields
6. **Telegram API Call** → Send formatted message
7. **Response** → Return success or error

### Key Components

- **`escapeHtml()`**: Escapes HTML special characters for Telegram
- **`validateEnvironment()`**: Validates required env vars on startup
- **`isRateLimited()`**: Checks and enforces rate limits
- **`getClientIp()`**: Extracts client IP from headers
- **`setCorsHeaders()`**: Sets CORS and security headers
- **`sanitizeString()`**: Trims and limits string length
- **`validateRequest()`**: Validates request structure
- **`validateFields()`**: Validates and sanitizes form fields
- **`sendToTelegram()`**: Sends message to Telegram API
- **`buildTelegramMessage()`**: Formats message with HTML
- **`logRequest()`**: Logs request for monitoring
- **`handler()`**: Main request handler

## Performance

- **Stateless**: No database required
- **Fast**: Serverless functions with edge caching
- **Scalable**: Automatic scaling with Vercel
- **Efficient**: Memory-efficient rate limiting with cleanup

## Maintenance

### Monitoring

Check Vercel logs for:
- Rate limiting patterns
- Telegram API errors
- Validation failures
- Timeout issues

### Common Issues

1. **"Server configuration error"**
   - Check that `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set
   - Verify environment variables in Vercel dashboard

2. **"Failed to send message"**
   - Verify Telegram bot token is valid
   - Check that chat ID is correct
   - Ensure bot has permission to send messages to the chat

3. **"Too many requests"**
   - IP is making more than 5 requests per minute
   - Wait 60 seconds before retrying

4. **CORS errors in browser**
   - Add your domain to `ALLOWED_ORIGINS` environment variable
   - Or leave `ALLOWED_ORIGINS` empty to allow all origins
