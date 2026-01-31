# Neon PostgreSQL Database Integration

This project integrates **Neon PostgreSQL** for storing contact form submissions and analytics.

## 🚀 Quick Setup

### 1. Create a Neon Project

1. Visit [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:password@host/database`)

### 2. Set Environment Variables

#### Local Development (.env.local)
```bash
DATABASE_URL=postgresql://user:password@your-neon-host/yourdb
ANALYTICS_API_KEY=your-secret-key-for-analytics-endpoint
```

#### Vercel Deployment
Add to Vercel Project Settings → Environment Variables:
- `DATABASE_URL` - Your Neon connection string
- `ANALYTICS_API_KEY` - Secret key for `/api/analytics` endpoint
- `TELEGRAM_BOT_TOKEN` - For contact form Telegram integration
- `TELEGRAM_CHAT_ID` - Telegram chat ID

### 3. Run Database Migrations

```bash
npm run db:migrate
```

This creates the following tables:
- **contact_submissions** - Stores all form submissions
- **contact_analytics** - Daily statistics (honeypot catches, rate limits)
- **contact_audit_log** - Audit trail of status changes

## 📊 Features

### Contact Submissions Stored
- Name, email, subject, message
- IP address and user agent
- Submission timestamp
- Status (new/read/archived)
- Admin notes

### Analytics Tracking
- Daily submission count
- Unique visitor tracking
- Honeypot catches
- Rate limit hits
- Response time metrics

### Security
- All submissions validated and sanitized
- Honeypot form field detection
- Rate limiting (5 requests/60 seconds per IP)
- HTML escaping for Telegram
- CORS protection

## 🔌 API Endpoints

### Contact Form Submission
**POST** `/api/send-telegram`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services"
}
```

### Analytics Endpoint (Protected)
**GET** `/api/analytics?type=summary&apiKey=YOUR_KEY`

Query Parameters:
- `type`: `summary` (default) | `submissions` | `analytics`
- `days`: Number of days to analyze (default: 30)
- `limit`: Results per page (default: 50, max: 100)
- `offset`: Pagination offset (default: 0)

Authorization:
```
Authorization: Bearer YOUR_ANALYTICS_API_KEY
```

Response Examples:

**Summary:**
```json
{
  "today": {
    "total_submissions": 3,
    "honeypot_catches": 1,
    "rate_limit_hits": 0
  },
  "weekSummary": {
    "total_submissions": 15,
    "unique_visitors": 12,
    "honeypot_catches": 2
  },
  "totalSubmissions": 127,
  "recentSubmissions": [...]
}
```

**Submissions:**
```json
{
  "data": [...submissions],
  "pagination": {
    "total": 127,
    "limit": 50,
    "offset": 0
  }
}
```

## 🗄️ Database Schema

### contact_submissions
```sql
id UUID PRIMARY KEY
name VARCHAR(100) NOT NULL
email VARCHAR(254) NOT NULL
subject VARCHAR(200)
message TEXT NOT NULL
ip_address INET
user_agent TEXT
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
status VARCHAR(20) -- 'new', 'read', 'archived'
notes TEXT
```

### contact_analytics
```sql
id UUID PRIMARY KEY
date DATE UNIQUE
total_submissions INT
unique_visitors INT
avg_response_time_ms FLOAT
honeypot_catches INT
rate_limit_hits INT
updated_at TIMESTAMP WITH TIME ZONE
```

### contact_audit_log
```sql
id UUID PRIMARY KEY
submission_id UUID (FOREIGN KEY)
event_type VARCHAR(50) -- 'submitted', 'status_changed', etc.
event_data JSONB
created_at TIMESTAMP WITH TIME ZONE
```

## 🛡️ Security Practices

### Input Validation
- Email format validation (RFC 5322 regex)
- Length limits on all fields
- Type checking for all inputs
- HTML escaping for Telegram

### Rate Limiting
- 5 submissions per IP per 60 seconds
- Tracked in-memory with timestamp resets
- Logged to analytics for monitoring

### Honeypot Protection
- Hidden form field (`hp`) catches bots
- Silent success response (returns 200 OK)
- Tracked in analytics

### CORS Protection
- Configurable allowed origins
- Proper CORS headers set
- Preflight handling

## 📈 Monitoring

### Daily Stats Dashboard
Check analytics via the protected endpoint:
```bash
curl -H "Authorization: Bearer YOUR_ANALYTICS_API_KEY" \
  http://localhost:3000/api/analytics?type=summary
```

### Database Queries
View recent submissions:
```sql
SELECT id, name, email, created_at, status
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 10;
```

View today's stats:
```sql
SELECT * FROM contact_analytics
WHERE date = CURRENT_DATE;
```

## 🧹 Data Cleanup

Automatically archive/delete old submissions (optional):
```sql
-- Archive submissions older than 90 days
UPDATE contact_submissions
SET status = 'archived'
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';

-- Delete archived submissions after 6 months
DELETE FROM contact_submissions
WHERE status = 'archived'
AND created_at < CURRENT_TIMESTAMP - INTERVAL '180 days';
```

## 🐛 Troubleshooting

### Connection Timeout
- Check DATABASE_URL format
- Verify IP is whitelisted in Neon (usually automatic for public projects)
- Check network connectivity

### Migration Errors
- Ensure DATABASE_URL is set correctly
- Verify you have permissions to create tables
- Check Neon dashboard for quota limits

### Analytics Not Recording
- Verify DATABASE_URL is set in production environment
- Check Vercel function logs
- Ensure `pg` package is installed

## 📚 Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Vercel & Neon Guide](https://vercel.com/guides/neon)

## 🔄 Integration with Existing Setup

The Neon integration works alongside:
- ✅ Telegram bot notifications (continues to work)
- ✅ Contact form validation (continues to work)
- ✅ Rate limiting (now also tracked in DB)
- ✅ All 3 languages (en/ru/cs) supported
