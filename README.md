# AlumniConnect

AlumniConnect is a full-stack alumni networking platform designed to connect students with alumni for mentorship, professional networking, career guidance, events, and knowledge sharing.

The backend is built using Node.js, Express.js, MongoDB, and JWT authentication.

---

## Features

### Authentication

- Student and alumni registration
- User login
- JWT-based authentication
- Role-based authorization
- Protected API routes

### Alumni Discovery

- View alumni profiles
- Search and filter alumni
- View professional and academic information

### Mentorship

- Students can send mentorship requests
- Alumni can view received requests
- Alumni can accept or reject requests
- Students can view mentorship request status

### Posts

- Create posts
- View all posts
- Update own posts
- Delete own posts
- Like and unlike posts
- Add comments
- Delete own comments

### Connections

- Send connection requests
- View received requests
- Accept or reject requests
- View accepted connections
- Remove connections
- Prevent duplicate requests
- Prevent users from connecting with themselves

### Events

- Alumni can create events
- Students and alumni can view upcoming events
- Students can register for events
- Prevent duplicate event registration
- Students can view registered events
- Students can cancel event registration
- Event creators can view registered students
- Event creators can update events
- Event creators can delete events

### Security

- Password hashing
- JWT authentication
- Role-based authorization
- Ownership authorization
- Helmet security headers
- API rate limiting
- CORS configuration
- Global error handling
- 404 route handling

---

## Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication and Security

- JSON Web Token
- bcrypt
- Helmet
- Express Rate Limit
- CORS

### Development Tools

- Visual Studio Code
- Thunder Client
- MongoDB Atlas
- Git
- GitHub
- Nodemon

---

## Project Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── alumniController.js
│   ├── authController.js
│   ├── connectionController.js
│   ├── eventController.js
│   ├── mentorshipController.js
│   └── postController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── Connection.js
│   ├── Event.js
│   ├── MentorshipRequest.js
│   ├── Post.js
│   └── User.js
│
├── routes/
│   ├── alumniRoutes.js
│   ├── authRoutes.js
│   ├── connectionRoutes.js
│   ├── eventRoutes.js
│   ├── mentorshipRoutes.js
│   └── postRoutes.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js