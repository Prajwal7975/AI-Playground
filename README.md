# 🤖 ModelLab – AI Model Playground

ModelLab is an AI Model Playground that allows you to test multiple AI models through a single interface.

You can select an AI model, enter a prompt, and view the generated response directly in the application.

The application uses a React frontend, Node.js/Express backend, Docker, and the Nexus AI API.

---

## ✨ Features

- 🤖 Test multiple AI models
- 🔄 Switch between models easily
- 💬 Simple prompt interface
- ⚡ Real-time AI responses
- 📋 Copy generated responses
- 🧹 Clear prompts and responses
- 🔐 API key stored securely on the backend
- 🐳 Docker support
- 📦 Easy setup for other users

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### AI API

- Nexus AI API
- OpenAI-compatible API interface

### DevOps

- Docker
- Docker Compose
- GitHub

---

## 📁 Project Structure

```text
ai-model-playground/
│
├── server/
│   ├── server.cjs
│   ├── .env.example
│   └── .env                 # Not included in GitHub
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```
