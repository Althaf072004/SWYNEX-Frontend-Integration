# SWYNEX — Public Distribution Service (Frontend Integration)

React frontend for a digital Public Distribution System (ration-card) portal, integrated with the Express/MySQL API in `../Backend`.

## Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env
npm start
```

Set `REACT_APP_API_URL` in `Frontend/.env` to the backend API base URL, including `/api`. The default is `http://localhost:5000/api`. Restart the React dev server after changing environment variables.

## Backend setup

```bash
cd Backend
npm install
cp .env.example .env
```

Fill in the MySQL credentials and a strong `JWT_SECRET` in `Backend/.env`, then create the database and tables expected by the backend models before starting it:

```bash
npm run dev
```

The API listens on port `5000` by default. Configure `FRONTEND_ORIGIN` when the frontend is served from a different origin. `GET /api/health` reports API/database availability. The frontend displays a non-blocking connection status and keeps the UI visible if the API is unavailable.

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/admin/login` | Admin sign-in |
| POST | `/api/auth/user/verify` | Verify ration card |
| POST | `/api/auth/user/biometric` | Biometric verification |
| GET | `/api/products` | List products |
| GET | `/api/families/:cardNumber` | Family details for a card |
| POST | `/api/transactions` | Create purchase transaction |
| GET | `/api/transactions/card/:cardNumber` | Card transaction history |
| GET | `/api/health` | API/database health check |

Admin-only product, family, and transaction routes require the JWT bearer token returned by admin login.

## Notes

- Never commit `.env` files, database credentials, JWT secrets, or real personal data.
- API errors and offline/time-out failures are surfaced as readable messages by the shared Axios client.
- For deployment, set `REACT_APP_API_URL` to the deployed backend URL and configure CORS with the deployed frontend origin.

## Internship submission checklist

1. Create a GitHub repository named `SWYNEX-Frontend-Integration`.
2. Upload this project without `node_modules`, `.env`, or private credentials.
3. Add a screenshot or short screen recording showing the UI and API connection indicator.
4. Publish a short LinkedIn explanation and submit both links to the task portal.
