# Response Shapes

Use this reference when endpoint payloads, query params, or frontend expectations are part of the task. Confirm against current code before editing.

## Known Current Patterns

- Auth create/check returns status plus `message`, and may include `user`, `created`, or `found`.
- Product catalog currently uses a user-scoped route in code: frontend calls `GET /products/{userInfo.id}` with `page`, `limit`, and `categoryId`.
- Product catalog controller returns `{ products, count }` for paginated category results.
- Product search through the catalog controller returns `{ products, message }`.
- Favorites mode in the product catalog returns `{ products, message }`.
- Admin product create/update frontend expects `createdProduct` and `updatedProduct`.
- Delete-style calls often rely on HTTP status or `{ message }`; verify each caller before changing response shape.

## Contract Drift Hotspots

- `API_CONTRACTS.md` may describe older generic routes like `GET /api/products`, while code may require user params such as `/products/:userId`.
- Category docs may refer to slugs or names, while current product filtering uses numeric `categoryId`.
- Some docs mention bearer tokens, while current frontend often passes Yandex `psuid` through path params.
- README may describe planned tools or architecture that are not present in `package.json` or source code.

## Required Comparison Points

- HTTP method.
- Full path after `/api`, including singular vs plural route groups.
- Path params and whether they represent DB `id` or Yandex `psuid`.
- Query params, defaults, and number parsing.
- Request body nesting, for example `{ user }` or `{ product }`.
- Success status and response fields consumed by frontend.
- Error status and response fields asserted by tests.
- Whether inactive products, favorites flags, and admin-only data are included.

## Change Rules

- Do not rename response fields without updating every frontend consumer and test.
- Do not silently switch `id` semantics between DB id and Yandex `psuid`.
- Preserve current status codes unless the task is explicitly to correct them.
- When changing a public response, update `API_CONTRACTS.md` in the same task.
