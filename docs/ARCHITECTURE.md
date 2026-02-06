# ARTEMCV Portfolio - Architecture Documentation

## Overview

This document provides a comprehensive overview of the ARTEMCV portfolio application's architecture, design patterns, and best practices.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 | UI component library |
| Language | TypeScript 5.8 | Type safety and developer experience |
| Build Tool | Vite 6.2 | Fast development and optimized builds |
| Styling | Tailwind CSS 4.1 | Utility-first CSS framework |
| Animation | Framer Motion 12 | Declarative animations |
| 3D Graphics | Three.js + React Three Fiber | 3D visualizations |
| Backend | Vercel Serverless Functions | API endpoints |
| Database | Neon PostgreSQL | Data persistence |
| Testing | Vitest + Testing Library | Unit and integration tests |

## Directory Structure

```
ARTEMCV/
├── api/                    # Vercel serverless functions
│   ├── send-telegram.ts   # Contact form handler
│   └── analytics.ts       # Analytics endpoint
├── components/            # React components
│   ├── *.tsx             # UI components
│   ├── home/             # Home page sections
│   └── __tests__/        # Component tests
├── lib/                   # Utility libraries
│   ├── hooks.ts          # Custom React hooks
│   ├── utils.ts          # Utility functions
│   ├── validation.ts     # Input validation
│   ├── api-client.ts     # API client
│   ├── logger-enhanced.ts# Logging system
│   ├── db.ts             # Database connection
│   └── contact-db.ts     # Contact form DB operations
├── pages/                 # Page components
├── tests/                 # Test suites
├── public/               # Static assets
├── docs/                 # Documentation
└── scripts/              # Build/dev scripts
```

## Architectural Patterns

### 1. Component Architecture

#### Container/Presentational Pattern
```typescript
// Container Component (Smart)
const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({});
  const handleSubmit = async () => { /* ... */ };
  
  return <ContactForm data={formData} onSubmit={handleSubmit} />;
};

// Presentational Component (Dumb)
const ContactForm: React.FC<Props> = ({ data, onSubmit }) => {
  return <form>{/* ... */}</form>;
};
```

#### Compound Component Pattern
```typescript
const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
};

// Usage
<Card.Root>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card.Root>
```

### 2. State Management

#### Local State (useState)
- Form inputs
- UI toggles (modals, menus)
- Component-specific data

#### Context API
- Theme preferences
- Language/i18n
- Accessibility settings
- User authentication

#### External State (Future)
- Zustand or Redux for complex global state
- React Query for server state

### 3. Data Fetching

#### API Client Pattern
```typescript
// lib/api-client.ts
const api = createApiClient({
  baseUrl: '/api',
  retries: 3,
  timeout: 12000,
});

// Usage in components
const response = await api.post('/send-telegram', formData);
```

#### Error Handling Strategy
```typescript
try {
  const result = await api.post('/endpoint', data);
} catch (error) {
  if (error instanceof ApiRequestError) {
    // Handle specific API errors
    if (error.status === 429) {
      showRateLimitError();
    }
  } else if (error instanceof NetworkError) {
    // Handle network issues
    showOfflineMessage();
  }
}
```

### 4. Performance Optimizations

#### Code Splitting
```typescript
// Route-based splitting
const DetailingHub = lazy(() => import('./pages/DetailingHub'));

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

#### Memoization Strategy
```typescript
// Memoize expensive computations
const filteredData = useMemo(() => 
  data.filter(item => item.active),
  [data]
);

// Memoize callbacks
const handleSubmit = useCallback(() => {
  submitForm(data);
}, [data]);

// Memoize components
const ListItem = memo(({ item }) => <div>{item.name}</div>);
```

#### Virtualization (for long lists)
```typescript
// Use react-window for lists > 50 items
import { FixedSizeList } from 'react-window';
```

### 5. Styling Architecture

#### Tailwind Organization
```typescript
// Base styles
const baseStyles = "flex items-center justify-center";

// Conditional styles with clsx + tailwind-merge
const className = cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
);
```

#### Design Tokens
```css
/* index.css */
:root {
  --color-primary: #10B981;
  --color-secondary: #06B6D4;
  --spacing-unit: 0.25rem;
  --radius-sm: 0.375rem;
}
```

## Security Best Practices

### 1. Input Validation
```typescript
// Server-side validation
const result = validateObject(body, {
  name: isValidName,
  email: isEmail,
  message: isValidMessage,
});

if (!result.valid) {
  return res.status(400).json({ errors: result.errors });
}
```

### 2. XSS Prevention
```typescript
// Sanitize user input
const safeHtml = escapeHtml(userInput);

// Use dangerouslySetInnerHTML with caution
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

### 3. CSRF Protection
```typescript
// Use SameSite cookies
res.setHeader('Set-Cookie', 'session=abc; SameSite=Strict; Secure');

// Validate Origin header
const allowedOrigins = ['https://artem.dev'];
if (!allowedOrigins.includes(origin)) {
  return res.status(403).json({ error: 'Invalid origin' });
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('validation', () => {
  it('validates email format', () => {
    expect(isEmail('test@example.com')).toEqual({ valid: true });
    expect(isEmail('invalid')).toEqual({ valid: false, error: '...' });
  });
});
```

### Integration Tests
```typescript
describe('ContactForm', () => {
  it('submits form successfully', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText('Name'), 'John');
    await userEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Success')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
// Using Playwright
test('user can submit contact form', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="name"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Deployment Architecture

### Vercel Platform
```
┌─────────────────┐
│   Vercel Edge   │
│   (CDN/Cache)   │
└────────┬────────┘
         │
┌────────▼────────┐
│  Serverless     │
│  Functions      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Neon PostgreSQL│
└─────────────────┘
```

### Environment Configuration
```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
ALLOWED_ORIGINS=https://artem.dev

# Development
NODE_ENV=development
DATABASE_URL=postgresql://localhost/...
```

## Monitoring & Observability

### Logging
```typescript
const logger = createLogger({ context: 'ContactForm' });

logger.info('Form submitted', { email: userEmail });
logger.error('Submission failed', error, { formData });
```

### Error Tracking
- ErrorBoundary catches React errors
- API errors logged with correlation IDs
- Client-side errors reported to analytics endpoint

### Performance Monitoring
- Web Vitals tracking (LCP, FID, CLS)
- Custom performance marks for key user journeys
- Bundle size monitoring

## Future Enhancements

### Planned Architecture Improvements
1. **Micro-frontends**: Split large sections into independent deployables
2. **Edge Functions**: Move API routes to Edge for lower latency
3. **GraphQL**: Replace REST with GraphQL for flexible data fetching
4. **Real-time**: Add WebSocket support for live features
5. **PWA**: Service worker for offline support

### Scalability Considerations
- Database connection pooling
- Redis caching layer
- CDN asset optimization
- Image optimization pipeline

---

Last Updated: 2026-02-06
