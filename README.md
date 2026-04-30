# Insighta Labs+ Web Portal

Insighta Labs+ is the secure, multi-interface version of the Profile Intelligence System. This repository contains the **web portal** for non-technical users. It connects to the Insighta backend API and uses the same profile data, authentication, authorization, filtering, pagination, export, and natural language search behavior.

## Web Portal Features

- GitHub OAuth login page.
- Protected application routes.
- Dashboard with basic profile metrics.
- Profiles list with filters and pagination.
- Profile detail view.
- Natural language search page.
- Account page showing the signed-in user.
- Admin-only create profile entry point.
- CSV export from the profiles list.
- Shared API client that sends `X-API-Version: 1` on every backend request.
- CSRF header support through the `csrftoken` cookie.


### Web Flow

1. The user opens `/login`.
2. The user clicks **Continue with GitHub**.
3. The web portal creates:
   - `state`
   - `code_verifier`
   - `code_challenge`
4. The browser is redirected to:

```text
GET /auth/github?state=...&code_challenge=...&code_verifier=...
```

5. The backend redirects the user to GitHub OAuth.
6. GitHub redirects back to the backend callback endpoint.
7. The backend validates the OAuth response, creates or updates the user, and establishes the web session using HTTP-only cookies.
8. The web portal calls `/auth/me` to load the authenticated user.
9. Protected routes become available only when a valid user is returned.

### Token Handling Approach

- Tokens are not stored in `localStorage`, `sessionStorage`, or React state.
- Browser requests include backend cookies through Axios `withCredentials: true`.
- CSRF protection is supported by reading the non-HTTP-only `csrftoken` cookie and sending it as `X-CSRFToken`.
- Logout calls `POST /auth/logout`, then clears local user state and returns the user to `/login`.

## Role Enforcement Logic

The backend is the source of truth for authorization.

Required roles:

| Role | Permissions |
| --- | --- |
| `admin` | Full access. Can create and delete profiles, read profiles, export CSV, and search. |
| `analyst` | Read-only access. Can list, filter, paginate, view, export, and search profiles. |

The web portal reflects role permissions in the interface:

- `admin` users see the **Create Profile** action.
- Non-admin users do not see the create profile link.
- The backend must still enforce permissions on every `/api/*` request, even if UI controls are hidden.

## API Integration

The shared Axios client is defined in `src/api/axios.js`.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "X-API-Version": "1",
  },
});
```

### Required Backend Endpoints

Authentication:

- `GET /auth/github`
- `GET /auth/github/callback`
- `GET /auth/me`
- `POST /auth/refresh`
- `POST /auth/logout`

Profiles:

- `GET /api/profiles`
- `GET /api/profiles/:id`
- `GET /api/profiles/search`
- `POST /api/profiles`
- `GET /api/profiles/export?format=csv`

Every `/api/*` request must require:

```text
X-API-Version: 1
```

Requests without the version header must return:

```json
{
  "status": "error",
  "message": "API version header required"
}
```

## Pagination Contract

Paginated profile responses must use this shape:

```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "total_pages": 203,
  "links": {
    "self": "/api/profiles?page=1&limit=10",
    "next": "/api/profiles?page=2&limit=10",
    "prev": null
  },
  "data": []
}
```

The web portal reads:

- `data`
- `page`
- `total`
- `total_pages`

## Natural Language Parsing Approach

Natural language parsing belongs to the backend so the API, CLI, and web portal stay consistent.

The web portal sends the raw query to:

```text
GET /api/profiles/search?q=young males from nigeria
```

The backend should parse the query into the same structured filters supported by `GET /api/profiles`, such as:

- gender
- country
- age group
- minimum age
- maximum age
- sorting
- pagination

Example:

```text
young males from nigeria
```

Expected backend interpretation:

```json
{
  "gender": "male",
  "country_id": "NG",
  "age_group": "adult"
}
```

## Local Development

Install dependencies:

```bash
npm install
```

Create or update `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run the development server:

```bash
npm run dev
```