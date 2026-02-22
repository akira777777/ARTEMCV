import { routerUtils } from '../src/lib/router';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error('FAIL: ' + message);
    process.exit(1);
  }
  console.log('PASS: ' + message);
};

console.log('--- Testing pathToRegex ---');
assert(routerUtils.pathToRegex('/users').test('/users'), 'matches static path');
assert(!routerUtils.pathToRegex('/users', true).test('/users/123'), 'exact match fails for subpath');
assert(routerUtils.pathToRegex('/users/:id').test('/users/123'), 'matches dynamic segment');
assert(routerUtils.pathToRegex('/users/*').test('/users/anything/really'), 'matches wildcard');

console.log('\n--- Testing pathToRegex Edge Cases (Escaping) ---');
const regex = routerUtils.pathToRegex('/v1.0/users/:id', true);
assert(!regex.test('/v1_0/users/123'), 'should not match dot as wildcard');
assert(regex.test('/v1.0/users/123'), 'should match dot literally');

console.log('\n--- Testing extractParams ---');
const params = routerUtils.extractParams('/users/:id/posts/:postId', '/users/123/posts/456');
assert(params !== null && params.id === '123', 'extracts first param');
assert(params !== null && params.postId === '456', 'extracts second param');

const noMatch = routerUtils.extractParams('/users/:id', '/products/123');
assert(noMatch === null, 'returns null on mismatch');

console.log('\n--- Testing extractParams with Wildcards ---');
const paramsWild = routerUtils.extractParams('/files/*/:filename', '/files/path/to/my.txt');
assert(paramsWild !== null && paramsWild.filename === 'my.txt', 'extracts param after wildcard');

console.log('\n--- Testing buildUrl ---');
const url = routerUtils.buildUrl('/users/:id/posts/:postId', { id: 123, postId: 'abc' });
assert(url === '/users/123/posts/abc', 'interpolates params correctly');

console.log('\nAll tests passed successfully!');
