# Best Practices Guide

A comprehensive guide to coding standards, patterns, and best practices for the ARTEMCV portfolio project.

## Table of Contents

1. [TypeScript Best Practices](#typescript-best-practices)
2. [React Best Practices](#react-best-practices)
3. [Styling Best Practices](#styling-best-practices)
4. [Performance Best Practices](#performance-best-practices)
5. [Testing Best Practices](#testing-best-practices)
6. [Security Best Practices](#security-best-practices)
7. [Git Best Practices](#git-best-practices)

---

## TypeScript Best Practices

### 1. Strict Type Safety

```typescript
// ✅ Good: Explicit return types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad: Implicit any
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. Interface vs Type

```typescript
// ✅ Use interface for object shapes that may be extended
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// ✅ Use type for unions, tuples, or mapped types
type Status = 'loading' | 'success' | 'error';
type Point = [number, number];
```

### 3. Null Safety

```typescript
// ✅ Good: Handle null/undefined explicitly
function getUserName(user: User | null): string {
  return user?.name ?? 'Anonymous';
}

// ✅ Good: Type guards
function isError(response: ApiResponse): response is ErrorResponse {
  return 'error' in response;
}
```

### 4. Generic Constraints

```typescript
// ✅ Good: Constrain generics for type safety
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

---

## React Best Practices

### 1. Component Structure

```typescript
// ✅ Good: Single responsibility, clear naming
interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data, isLoading } = useUser(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <NotFound />;
  
  return (
    <article className="user-profile">
      <UserAvatar src={data.avatar} />
      <UserDetails user={data} />
    </article>
  );
};
```

### 2. Hooks Rules

```typescript
// ✅ Good: Hooks at top level, in order
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  
  useEffect(() => {
    // Effect logic
  }, [count]);
  
  return <div ref={ref}>{count}</div>;
};

// ❌ Bad: Conditional hooks
const Component: React.FC = () => {
  if (condition) {
    const hook = useHook(); // ❌ Never do this
  }
};
```

### 3. useEffect Dependencies

```typescript
// ✅ Good: Include all dependencies
useEffect(() => {
  fetchData(userId, filters);
}, [userId, filters]);

// ✅ Good: Use functional updates to avoid dependency
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1); // Functional update
  }, 1000);
  return () => clearInterval(timer);
}, []); // No dependencies needed
```

### 4. Event Handlers

```typescript
// ✅ Good: Memoized callbacks
const handleSubmit = useCallback((event: FormEvent) => {
  event.preventDefault();
  submitForm(data);
}, [data]);

// ✅ Good: Inline for simple cases (no memoization needed)
<button onClick={() => setOpen(true)}>Open</button>
```

---

## Styling Best Practices

### 1. Tailwind CSS Organization

```typescript
// ✅ Good: Group related classes, use cn() for conditionals
const buttonClass = cn(
  // Layout
  "inline-flex items-center justify-center",
  // Spacing
  "px-4 py-2",
  // Appearance
  "bg-blue-500 text-white rounded-lg",
  // Interactive states
  "hover:bg-blue-600 focus:ring-2 focus:ring-blue-300",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  // Transitions
  "transition-colors duration-200"
);
```

### 2. CSS Custom Properties

```css
/* ✅ Good: Semantic naming */
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --spacing-section: 4rem;
  --radius-card: 1rem;
}

/* Usage */
.card {
  background: var(--color-primary);
  padding: var(--spacing-section);
  border-radius: var(--radius-card);
}
```

### 3. Responsive Design

```typescript
// ✅ Good: Mobile-first approach
<div className="
  w-full                    /* Base: mobile */
  md:w-1/2                  /* Medium screens */
  lg:w-1/3                  /* Large screens */
  xl:w-1/4                  /* Extra large */
">
```

---

## Performance Best Practices

### 1. Memoization Strategy

```typescript
// ✅ Good: Memoize expensive computations
const sortedData = useMemo(() => 
  data.sort((a, b) => b.score - a.score),
  [data]
);

// ✅ Good: Memoize stable callbacks
const handleUpdate = useCallback((id: string) => {
  updateItem(id, newData);
}, [newData]);

// ✅ Good: Memoize components
const ListItem = memo(({ item }) => (
  <div>{item.name}</div>
));
```

### 2. Lazy Loading

```typescript
// ✅ Good: Route-based code splitting
const DetailingHub = lazy(() => import('./pages/DetailingHub'));

// ✅ Good: Component-based splitting with Suspense
<Suspense fallback={<Spinner />}>
  <HeavyChart data={data} />
</Suspense>
```

### 3. Image Optimization

```typescript
// ✅ Good: Use Next.js Image or optimized component
<OptimizedImage
  src="/photo.webp"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 4. List Virtualization

```typescript
// ✅ Good: Virtualize long lists (> 50 items)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={500}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>{items[index]}</div>
  )}
</FixedSizeList>
```

---

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
describe('Calculator', () => {
  it('adds two numbers correctly', () => {
    // Arrange
    const calculator = new Calculator();
    const a = 5;
    const b = 3;
    
    // Act
    const result = calculator.add(a, b);
    
    // Assert
    expect(result).toBe(8);
  });
});
```

### 2. Component Testing

```typescript
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 3. Mocking Best Practices

```typescript
// ✅ Good: Mock at module level
vi.mock('../lib/api', () => ({
  fetchUser: vi.fn(),
}));

// ✅ Good: Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// ✅ Good: Mock with proper types
const mockFetchUser = vi.mocked(fetchUser).mockResolvedValue({
  id: '1',
  name: 'Test User',
});
```

---

## Security Best Practices

### 1. Input Validation

```typescript
// ✅ Good: Validate all user input
const result = validateObject(req.body, {
  email: validators.isEmail,
  password: validators.isStrongPassword,
});

if (!result.valid) {
  return res.status(400).json({ errors: result.errors });
}
```

### 2. XSS Prevention

```typescript
// ✅ Good: Escape HTML output
const safeHtml = escapeHtml(userInput);

// ✅ Good: Use React's built-in XSS protection
// React automatically escapes content in JSX
<div>{userInput}</div> // Safe

// ❌ Bad: Dangerous HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 3. Authentication

```typescript
// ✅ Good: HTTP-only cookies
res.setHeader('Set-Cookie', 
  'token=abc; HttpOnly; Secure; SameSite=Strict; Max-Age=3600'
);

// ✅ Good: Verify JWT properly
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## Git Best Practices

### 1. Commit Messages

```
✅ Good:
feat(contact): add email validation
fix(hero): resolve animation flicker on mobile
docs(api): update rate limit documentation
test(utils): add validation unit tests
refactor(hooks): simplify useScrollPosition logic

❌ Bad:
fix bug
update
WIP
```

### 2. Branch Naming

```
feature/contact-form-validation
bugfix/hero-animation-flicker
hotfix/security-patch
refactor/api-client
docs/architecture-update
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] E2E tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

---

## Code Review Checklist

### Before Submitting
- [ ] Code follows TypeScript strict mode
- [ ] All tests passing
- [ ] No console.log statements
- [ ] Components properly typed
- [ ] No unused imports or variables
- [ ] Accessibility considered (ARIA labels, keyboard nav)
- [ ] Mobile responsive
- [ ] Performance optimized (memoization, lazy loading)

### During Review
- [ ] Logic is correct and efficient
- [ ] Error handling is comprehensive
- [ ] Security considerations addressed
- [ ] Code is readable and maintainable
- [ ] Follows established patterns

---

Last Updated: 2026-02-06
