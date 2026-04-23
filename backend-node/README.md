# InterviewIQ Node Backend

This backend is built for the existing frontend service layer in `frontend/src/services`.

## 1) Setup

```bash
cd backend-node
cp .env.example .env
npm install
npm run dev
```

## 2) Required environment variables

- `MONGODB_URI` - your MongoDB connection string
- `JWT_SECRET` - long random secret

Optional Firebase Admin sync (for storing users in Firebase Auth):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## 3) Frontend config

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:8081/api
```

## 4) Implemented endpoint groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password` (placeholder)
- `POST /api/auth/reset-password` (placeholder)
- `POST /api/auth/verify-email` (placeholder)
- `POST /api/interviews/start`
- `GET /api/interviews/:id`
- `GET /api/interviews/history`
- `GET /api/interviews/active`
- `PUT /api/interviews/:id/status`
- `POST /api/interviews/:id/answer`
- `POST /api/interviews/:id/complete`
- `DELETE /api/interviews/:id`
- `GET /api/questions/generate`
- `GET /api/results/:interviewId`
- `GET /api/results/history`
