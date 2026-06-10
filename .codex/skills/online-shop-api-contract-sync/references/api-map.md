# API Map

Use this reference to find the right files before changing or reviewing an API.

## Backend Entry Points

- Root router: `backend/src/routers/index.ts`
- Routers: `backend/src/routers/*Routes.ts`
- Controllers: `backend/src/controllers/*Controller.ts`
- Services: `backend/src/services/*Service/*Service.ts`
- Models: `backend/src/models/*.ts`
- Validation utilities: `backend/src/utils/validation/validation.ts`
- Integration tests: `backend/tests/integration/*.test.ts`

## Frontend Entry Points

- Axios client: `frontend/src/shared/api/axios.ts`
- Entity API services: `frontend/src/entities/**/api/*`
- Redux thunks: `frontend/src/entities/**/model/asyncThunks/*`
- Redux slices: `frontend/src/entities/**/model/*Slice.ts` and `slice.ts`
- Routes and guards: `frontend/src/app/routes/*`
- Shared API-facing types: `frontend/src/shared/types/*`

## API Zones

- Auth/Yandex: backend `authRoutes`, `authController`, `AuthService`; frontend `entities/user/api`, `shared/lib/yandexAuth.ts`, auth routes.
- Products catalog: backend `productsRoutes`, `productsController`, `ProductService`; frontend product API/thunks/slices/cards/lists.
- Single product/admin product CRUD: backend `productRoutes`, `productController`; frontend admin product service and create/edit pages.
- Categories: backend `categoriesRoutes`, `categoriesController`, `CategoryService`; frontend categories service, thunks, slice, category constants.
- Favorites: backend `favoritesRoutes`, `favoriteItemsRoutes`, `favoritesController`, `favoriteItemsController`, `FavoriteService`; frontend favorites API, thunks, slice, drawer/list/card UI.
- Cart: backend `cartRoutes`, `cartItemsRoutes`, `cartController`, `cartItemsController`; frontend cart API, thunks, slice, drawer/list/card UI.
- Orders/checkout: backend `orderRoutes`, `orderController`, `OrderService`; frontend checkout page, form, order notification hook.
- Admin: backend `adminRoutes`, `adminController`, `AuthService.hasAdminRights`; frontend `AdminService`, admin protected route, admin pages/tabs.
- Promocodes: backend `promocodesRoutes`, `promocodeRoutes`, controllers/services; frontend admin promocode service, slice, thunks, modal/list/card UI.

## Search Patterns

- Backend route mount: `router.use(` in `backend/src/routers/index.ts`
- Endpoint method: `router.get`, `router.post`, `router.put`, `router.patch`, `router.delete`
- Frontend callers: `api.get(`, `api.post(`, `api.put(`, `api.patch(`, `api.delete(`
- User identity coupling: `storage.getUserInfo`, `userInfo.id`, `psuid`
- Admin checks: `hasAdminRights`, `checkAdmin`, `ProtectionAdminRouter`
