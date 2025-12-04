# Real TodoList Backend — Utitbest

This is the backend API for the Real TodoList application, built with Node.js and PostgreSQL. It handles task creation, retrieval, updates, deletion, and reordering. The backend is deployed on [Railway](https://railway.app) and connected to a Neon PostgreSQL database.

---

## 🚀 Features

- Create new tasks
- Fetch all tasks
- Update task completion status
- Delete completed tasks
- Reorder tasks by drag-and-drop
- Fully RESTful API
- CORS-enabled for frontend integration

---

## 🛠 Tech Stack

- **Node.js** (HTTP server)
- **PostgreSQL** (via Neon)
- **pg** (PostgreSQL client for Node)
- **Railway** (backend deployment)
- **Neon** (cloud-hosted database)

---

## 📦 Installation

```bash
git clone https://github.com/Utitbest/Real_TodoList_Utitbest_Backend
cd Real_TodoList_Utitbest_Backend
npm install

DATABASE_URL=postgresql://your-neon-connection-string/tododatabase?sslmode=require
NODEPORT=5000


🌐 API Endpoints
Method	Endpoint	Description
GET	/todo	Fetch all tasks
POST	/todo	Add a new task
PUT	/todo/:id	Update task completion status
PUT	/todo/order	Reorder tasks
DELETE	/todo/clear	Delete completed tasks
All responses are in JSON format.

🚀 Deployment
This backend is deployed on Railway. To deploy your own version:

Push your code to GitHub

Create a new Railway project

Link your GitHub repo

Set environment variables:

DATABASE_URL (your Neon connection string)

Railway will auto-deploy and give you a public URL like:
https://your-app-name.up.railway.app

🧠 Author
Built by Utitbest
Location: Uyo, Akwa Ibom State, Nigeria Year: 2025

