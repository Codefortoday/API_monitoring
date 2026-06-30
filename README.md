# API Monitor

A full-stack API monitoring dashboard with user authentication, monitor creation, status tracking, and response history.

## Features

- User registration and login
- JWT-based authentication
- Create and list monitors with custom check intervals
- Background health checks for monitored URLs
- Storage of monitor results and recent checks
- Dashboard UI for monitor management and status details
- Responsive frontend layout

## Tech Stack Used
- Backend: Node.js, Express, MySQL, JWT, bcrypt, Axios
- Frontend: React, Vite, Material UI, React Router, Axios
- Database: MySQL 
- Dev tooling: npm, nodemon, dotenv

## Repository structure

```
API_Monitor/
├── backend/
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── jobs/checker.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── logs/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── public/
└── database.sql
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL server

## Backend setup

1. Open a terminal in `backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```
## Database setup
1. Create root database and start mysql service
2.Create tables users, monitors, monitor_checks
3. Store db_user and password in backend 

## Frontend setup

1. Open a terminal in `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at: `http://localhost:5173`

## Running the app

- Backend API: `http://localhost:4000/api`
- Frontend UI: `http://localhost:5173`

## Notes

- The backend uses a polling job in `backend/jobs/checker.js` to check monitors every 15 seconds and decide which monitor is due.
- The frontend stores JWT tokens in `localStorage` and sends them with protected API requests.
- If you want richer error handling, add more validation feedback in both backend controllers and frontend pages.



## Future improvements

- Add refresh token support for auth
- Add monitor edit/delete features
- Add charts for uptime trends
- Add environment-specific config files for production

Demo:
User register and login:
<img width="653" height="689" alt="image" src="https://github.com/user-attachments/assets/705f8f22-2cd2-4b90-bb6d-d81e3dccdd9b" />

<img width="641" height="636" alt="image" src="https://github.com/user-attachments/assets/54ced72a-fa75-4d0d-92c5-9bc83749bc33" />

<img width="923" height="758" alt="image" src="https://github.com/user-attachments/assets/2fcdfe58-cd67-4009-ab2d-1b460482a96c" />

Monitor created and status and response:
<img width="1285" height="563" alt="image" src="https://github.com/user-attachments/assets/eb93b969-dcb2-45f2-9237-a1c49540dc48" />

<img width="1447" height="666" alt="image" src="https://github.com/user-attachments/assets/61058842-532f-43d4-b14d-dae806a2c806" />

Postman API testing:
Get-monitor:
<img width="1262" height="818" alt="image" src="https://github.com/user-attachments/assets/a7b1dac0-4021-4834-8fe2-70b77c9fcbcd" />

Post-login:
<img width="1245" height="478" alt="image" src="https://github.com/user-attachments/assets/3a0c5bde-31fe-4734-9db9-3f5cd0eed107" />



Post-creating monitors for API:
<img width="1242" height="817" alt="image" src="https://github.com/user-attachments/assets/e6fe75b9-4961-4aec-adcd-2aa510feb3b9" />

Database schema:

users schema:
<img width="971" height="205" alt="image" src="https://github.com/user-attachments/assets/7f7eab89-f433-413f-ab65-e36f6760ee7d" />


monitors schema:
<img width="969" height="242" alt="image" src="https://github.com/user-attachments/assets/4aaa71ad-b0b9-4de8-8974-0a22c0f10b1c" />

monitor_checks schema:
<img width="829" height="234" alt="image" src="https://github.com/user-attachments/assets/9e391484-03aa-4df3-951e-e0251456afc5" />

with api data:
<img width="890" height="160" alt="image" src="https://github.com/user-attachments/assets/7e692d50-fa7d-4250-b89f-eddf64c1f019" />




