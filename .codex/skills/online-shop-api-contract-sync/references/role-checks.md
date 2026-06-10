# Role Checks

Use this reference when an endpoint is protected, destructive, admin-facing, or role-sensitive.

## Roles

- `user`: normal shop customer.
- `admin`: can perform admin shop operations such as product and promocode management.
- `super_admin`: has admin rights plus higher-level user/admin management when implemented.

Confirm exact type spelling in `backend/src/types/roles.ts` before changing code.

## Backend Rules

- Frontend route protection is not security. Admin and destructive operations need backend checks.
- Reuse `AuthService.hasAdminRights` for admin/super_admin checks when it fits the endpoint.
- Validate user identifiers with existing validation utilities before database access.
- For destructive admin actions, verify the acting user exists and has admin rights before deleting or mutating data.
- Keep role logic in controller/service layers, not directly in router declarations.

## Frontend Rules

- User-only pages flow through `ProtectionRouter`.
- Admin pages flow through `ProtectionAdminRouter`.
- Admin UI actions should call admin-aware backend endpoints, not normal user endpoints.
- Frontend guards may redirect for UX, but backend errors must still be handled.

## Test Expectations

- Role-sensitive backend changes should cover unauthorized, non-admin, and admin/super_admin success paths when practical.
- Destructive operations should test both permission failure and data mutation success.
- If tests require database env vars and cannot run, report that clearly in the final answer.
