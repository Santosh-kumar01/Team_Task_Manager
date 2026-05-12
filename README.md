# TaskFlow - Team Task Manager 🚀

TaskFlow is a robust, full-stack role-based task management application designed to streamline project collaboration, task assignment, and progress tracking for teams.

## 🌟 Features

- **Role-Based Access Control (RBAC):** Distinct privileges for **Admins** and **Members**.
- **Project Management:** Create, view, and manage team projects.
- **Task Tracking:** Assign tasks, update statuses (Todo, In-Progress, Completed), and track deadlines.
- **Secure Authentication:** JWT-based authentication with secure HTTP-only cookies and bcrypt password hashing.
- **Modern User Interface:** Premium, responsive UI built with Next.js, Tailwind CSS, and a custom glassmorphic design system.
- **State Management:** Centralized client state using Redux Toolkit.
- **Performance Optimized:** API caching using Redis and server-side rendering with Next.js.
- **Containerized Database:** Simple setup with Docker Compose for MongoDB and Redis.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js (14.2)
- **Library:** React 18
- **State Management:** Redux Toolkit & React-Redux
- **Styling:** Tailwind CSS & PostCSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Date Formatting:** date-fns

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment Management:** dotenv

## 📁 Project Structure

```bash
Team_Task_Manager/
├── backend/                # Node.js / Express API
│   ├── src/
│   │   ├── config/         # DB & Redis connection setups
│   │   ├── controllers/    # API Request handlers
│   │   ├── middleware/     # Auth & Error handling middlewares
│   │   ├── models/         # Mongoose schemas (User, Project, Task)
│   │   ├── routes/         # Express API routes
│   │   ├── services/       # Business logic (if separated)
│   │   └── utils/          # Helper functions
│   ├── .env                # Server environment variables
│   ├── package.json        # Server dependencies
│   └── server.js           # Server entry point
│
├── frontend/               # Next.js Application
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # Reusable React components (Navbar, Auth, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API clients & utilities
│   ├── store/              # Redux slices & store configuration
│   ├── .env.local          # Client environment variables
│   ├── package.json        # Client dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
│
└── docker-compose.yml      # Docker config for MongoDB and Redis
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker Desktop (for running MongoDB and Redis)

### 1. Clone & Install Dependencies

```bash
# Install root/server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/taskflow
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Start the Application
We have configured a `concurrently` script so you can start both the frontend and backend with just one command!

Open a terminal in the root `Team_Task_Manager` directory and run:

```bash
npm run dev
```

- Your **Frontend** will be running at [http://localhost:3000](http://localhost:3000).
- Your **Backend API** will be running at [http://localhost:5001](http://localhost:5001).

## 🔒 User Roles

- **Admin:** Can create projects, add members, assign tasks, and monitor overall progress.
- **Member:** Can view assigned projects, update task statuses, and collaborate with the team.

## 🤝 Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow.

---
*Developed with 🩵 by the TaskFlow Team.*
