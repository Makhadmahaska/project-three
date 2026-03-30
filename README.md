# Grade Management Application

This project is a grade management application with:

- a `backend` built with Express, Prisma, and Firebase token verification
- a `frontend` built with React, TypeScript, Vite, and Firebase Authentication
- role-based access for `ADMIN` and `STUDENT` users

Administrators can manage students, subjects, and grades. Students can log in and view only their own grades.

## Project Structure

```text
.
├── backend
│   ├── prisma
│   ├── src
│   └── tests
├── frontend
│   ├── src
│   └── public
└── README.md
```

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod, Jest
- Frontend: React, TypeScript, Vite, Firebase Authentication
- Auth: Firebase ID tokens verified on the backend

## Requirements

- Node.js 20+ recommended
- npm
- PostgreSQL database
- Firebase project configured for email/password authentication

## Environment Variables

Create `backend/.env` with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/grade_management"
PORT=3001
FIREBASE_PROJECT_ID="project-three-99cba"
```

Notes:

- `PORT=3001` matches the frontend API base URL in [frontend/src/services/api.ts](/Users/makhadmahaska/Downloads/project-three-main%203/frontend/src/services/api.ts).
- `DATABASE_URL` must point to a working PostgreSQL database.
- `FIREBASE_PROJECT_ID` must match your Firebase project.

## Installation

Install dependencies for both apps:

```bash
cd backend
npm install
npm run prisma:generate

cd ../frontend
npm install
```

## Database Setup

From the `backend` folder:

```bash
npx prisma migrate dev
npm run prisma:generate
```

This creates the database tables from the Prisma schema and generates the Prisma client.

## Running The App

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Authentication Flow

1. The user signs in on the frontend using Firebase Authentication.
2. Firebase returns an ID token for the signed-in user.
3. The frontend sends that token in the `Authorization: Bearer <token>` header.
4. The backend verifies the Firebase token using Google JWKS.
5. The backend looks up the matching application user in the database.
6. The backend authorizes access based on the user role:
   - `ADMIN` can access admin routes
   - `STUDENT` can access student-only routes and their own grade view

## API Overview

All API routes are under `/api`.

### Session

- `GET /api/session`
  - Requires authentication
  - Returns the current authenticated user and role information

### Students

- `GET /api/students`
  - Admin only
  - Returns all students
- `POST /api/students`
  - Admin only
  - Creates a student account
- `PUT /api/students/:studentId`
  - Admin only
  - Updates student details
- `GET /api/students/:studentId/grades`
  - Admin only
  - Returns grades for a specific student
- `GET /api/students/me/grades`
  - Student only
  - Returns the logged-in student's grades

### Subjects

- `GET /api/subjects`
  - Authenticated users
  - Returns all subjects
- `POST /api/subjects`
  - Admin only
  - Creates a subject
- `PUT /api/subjects/:subjectId`
  - Admin only
  - Updates a subject

### Grades

- `GET /api/grades`
  - Admin only
  - Returns all grades
- `POST /api/grades`
  - Admin only
  - Creates or updates a grade for a student-subject pair

## Example Request

```http
POST /api/grades
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "studentId": "ck_example_student",
  "subjectId": "ck_example_subject",
  "value": 85,
  "comment": "Strong work"
}
```

## Validation And Error Handling

- Request bodies are validated with Zod in controllers.
- Authentication failures return `401`.
- Authorization failures return `403`.
- Missing routes return `404`.
- Known application errors use structured messages through `HttpError`.

## Tests

Run backend tests:

```bash
cd backend
npm test
```

Current automated tests focus on:

- missing bearer token
- invalid token handling
- admin/student role enforcement
- blocked access for the wrong role

## Build Commands

Backend build:

```bash
cd backend
npm run build
```

Frontend build:

```bash
cd frontend
npm run build
```

## CI

GitHub Actions runs the following checks on pushes and pull requests:

- install backend dependencies
- generate the Prisma client
- run backend tests
- build the backend
- install frontend dependencies
- build the frontend

See [.github/workflows/ci.yml](/Users/makhadmahaska/Downloads/project-three-main%203/.github/workflows/ci.yml).

