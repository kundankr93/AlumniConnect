# AlumniConnect

AlumniConnect is a full-stack MERN web application designed to connect students with alumni. It allows students to discover alumni, build professional connections, request mentorship, participate in community discussions, and register for alumni events.

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Student and alumni roles
- Protected routes
- Role-based authorization

### Alumni Discovery

- Browse alumni profiles
- View professional information
- Search alumni
- View skills, company, job title, branch, and graduation year

### Connections

- Send connection requests
- Accept or reject connection requests
- View accepted professional connections

### Mentorship

- Students can send mentorship requests to alumni
- Alumni can accept or reject mentorship requests
- Students can track mentorship request status

### Community Posts

- Create community posts
- Like and unlike posts
- Add comments
- Edit your own posts
- Delete your own posts

### Events

- Alumni can create events
- Alumni can edit or delete their own events
- Students can register for events
- Students can cancel event registration
- Alumni can view registered students

### User Profile

- View profile information
- Update profile details
- Add skills and professional information

## Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt.js

### Security

- Helmet
- Express Rate Limit
- CORS
- JWT authentication
- Role-based authorization

## Project Structure

```text
AlumniConnect/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── README.md