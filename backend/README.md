# CarDoc Backend (Spring Boot)

## What is scaffolded
- JWT auth: `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/auth/me`
- Car profile CRUD: `POST /api/cars`, `GET /api/cars/me`, `PUT /api/cars/{id}`
- Metrics ingestion/history: `POST /api/metrics/ingest`, `GET /api/metrics/{carId}/latest`, `GET /api/metrics/{carId}/history`
- Recommendations:
  - `GET /api/insurance/{carId}/quotes`
  - `GET /api/maintenance/{carId}/next-service`
  - `GET /api/alerts/{carId}`
  - `GET /api/ai/error-code/{code}`
- Scheduled service alerts every 6 hours.

## Environment variables
- `DB_URL` (default `jdbc:postgresql://127.0.0.1:5432/postgres`)
- `DB_USERNAME` (default `postgres`)
- `DB_PASSWORD` (default `postgres`)
- `JWT_SECRET` (set a strong secret in real environments)
- `JWT_EXPIRATION_MS` (default `86400000`)
- `SERVER_PORT` (default `8080`)

Notes:
- If you want a dedicated database, set `DB_URL=jdbc:postgresql://127.0.0.1:5432/cardoc` and ensure `cardoc` exists.
- Docker Compose in repo provisions `cardoc` on first DB initialization.

## Run
This environment currently does not have Maven installed (`mvn` not found).

Once Maven is installed:
```bash
cd backend
mvn spring-boot:run
```

## Frontend auth pages
- `http://localhost:4200/signin`
- `http://localhost:4200/signup`

The Angular frontend expects backend auth at `http://localhost:8080/api/auth`.
