---
name: online-shop-api-contract-sync
description: Synchronize API contracts with the online shop frontend and backend. Use when adding, changing, reviewing, debugging, or documenting API endpoints, request or response shapes, route params, query params, role access, frontend API services, Redux thunks, backend routers/controllers/services, or API_CONTRACTS.md.
---

# Online Shop API Contract Sync

## Overview

Use this skill to prevent API drift between `API_CONTRACTS.md`, Express routes/controllers/services, and React frontend callers. Treat the current code as factual implementation and the contract as required public documentation that may need correction.

## Workflow

1. Identify the API zone and load only the needed reference:
   - `references/api-map.md` for route/controller/service/frontend locations.
   - `references/response-shapes.md` when request/response payloads or query params matter.
   - `references/role-checks.md` when auth, admin access, or route protection matters.
2. Compare the four surfaces before changing behavior:
   - `API_CONTRACTS.md`
   - `backend/src/routers/**`
   - `backend/src/controllers/**` and `backend/src/services/**`
   - `frontend/src/entities/**/api/**`, `frontend/src/entities/**/model/asyncThunks/**`, and direct `api.*` calls
3. Decide the source of truth for the task:
   - If the user asks to document current behavior, update `API_CONTRACTS.md` to match code.
   - If the user asks to implement a documented contract, update backend and frontend to match the contract.
   - If production behavior is ambiguous, preserve existing frontend-visible behavior unless the user explicitly requests a breaking change.
4. Keep API changes synchronized:
   - Update backend route, controller, service, validation, and tests together.
   - Update frontend service/thunk/types for any method, path, params, body, response, or error shape change.
   - Update `API_CONTRACTS.md` whenever public API behavior changes.
5. Verify only the touched side:
   - Backend: `npm run type-check`, `npm run test`, `npm run lint`, `npm run format:check`.
   - Frontend: `npm run build`, `npm run lint`, `npm run format:check`.
   - If dependencies, database, or environment variables block checks, report that explicitly.

## Drift Review Checklist

- Method and path match across contract, backend router, and frontend caller.
- Path params and query params have the same names and types.
- Request body nesting matches exactly, especially `{ user }`, `{ product }`, and item payloads.
- Response body fields match frontend expectations, not just HTTP status.
- Error statuses and messages are tested when behavior changes.
- Role checks happen on backend for admin or destructive operations.
- Protected frontend routes are treated as UX gates, not security.
- No temporary `console.log`, stale mocks, or undocumented contract changes remain.

## Common Tasks

- Add endpoint: implement backend layers, add or update Supertest/Vitest coverage, add frontend caller if needed, document the endpoint.
- Change endpoint: update all frontend usages before changing backend behavior, then document the new shape.
- Fix integration bug: reproduce the mismatch by comparing frontend `api.*` call to backend route/controller parsing.
- Review API drift: list mismatches first, then propose contract/code updates with minimal behavior changes.
- Change roles: update backend role checks, frontend protected flow, tests, and role documentation.

## Project-Specific Defaults

- Prefer the existing Express layering: router -> controller -> service -> model.
- Prefer existing frontend architecture: entity API service -> async thunk -> slice -> page/widget/entity UI.
- Use `@` imports in frontend.
- Do not change `package-lock.json` for API contract work unless dependencies are intentionally changed.
- Mention known contract drift in the final answer when discovered, even if it is outside the edited files.
