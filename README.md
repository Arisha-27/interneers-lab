# Interneers Lab

A full-stack experimental environment for building and testing scalable application architectures. This repository serves as an active development ground for exploring modern backend patterns (FastAPI, Django) alongside a React + TypeScript frontend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the FastAPI Server](#running-the-fastapi-server)
  - [Running the React Frontend](#running-the-react-frontend)
  - [Running the Django Backend](#running-the-django-backend)
- [Development Workflow](#development-workflow)

---

## Overview

Interneers Lab started as a minimal full-stack starter kit and has grown into a primary testing ground for architectural patterns and real-world API integrations. The project emphasizes clean code principles, clear separation of concerns, and modular design that scales.

---

## Features

### 1. Hexagonal Architecture User API (FastAPI)

A standalone REST API built from scratch implementing Hexagonal Architecture (Ports & Adapters) principles.

- **Core Domain Isolation** — Business logic in `use_cases.py` and `domain.py` is fully decoupled from infrastructure concerns.
- **Ports & Adapters** — Abstract interfaces defined in `ports.py` govern all external communication, making the system technology-agnostic.
- **Swappable Persistence** — An `InMemoryUserRepository` (`adapters.py`) is used for development. Due to the hexagonal design, swapping in a PostgreSQL or MongoDB adapter requires no changes to core domain logic.
- **Structured Error Handling** — Proper differentiation between `400 Bad Request` (invalid input, e.g. negative IDs) and `404 Not Found`.
- **Auto-generated Docs** — Interactive Swagger UI available at `/docs` via FastAPI.

### 2. Real-Time Weather Integration

A weather module that fetches live data from the OpenWeather API.

- **Secure Configuration** — API keys managed through environment variables via `python-dotenv`. No credentials are hardcoded or committed to source control.
- **Clean Data Formatting** — External API responses are parsed and serialized into structured, frontend-ready JSON.

### 3. Frontend & Traditional Backend

- **React + TypeScript** — A single-page application in the `frontend/` directory with custom SCSS styling and fluid UI animations.
- **Django Backend** — A traditional MVC Python backend in `backend/python/` for comparison and experimentation alongside the FastAPI service.

---

## Project Structure

```
.
├── frontend/                  # React + TypeScript SPA
├── backend/
│   └── python/                # Django MVC backend
├── domain.py                  # Core business model (User dataclass)
├── ports.py                   # Driving/Driven adapter interfaces
├── use_cases.py               # Application business rules & validation
├── adapters.py                # InMemoryRepository & external integrations
├── main.py                    # FastAPI entry point & route definitions
├── weather.py                 # OpenWeather API integration module
└── requirements.txt           # Python dependencies
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine before proceeding:

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | Latest LTS |
| Yarn | Latest |
| Git | Any recent version |

### Installation

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/Arisha-27/interneers-lab.git
cd interneers-lab
```

### Environment Variables

The weather module requires an OpenWeather API key.

1. Create a `.env` file in the project root:
   ```bash
   touch .env
   ```
2. Add your API key:
   ```env
   API_KEY=your_actual_openweather_api_key
   ```

> **Note:** The `.env` file is listed in `.gitignore` and will never be committed to version control.

### Running the FastAPI Server

Install Python dependencies and start the Uvicorn development server:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

| Endpoint | URL |
|----------|-----|
| Users API | `http://127.0.0.1:8000/users/{id}` |

### Running the React Frontend

Navigate to the frontend directory and start the development server:

```bash
cd frontend
yarn install
yarn start
```

The application will be available at `http://localhost:3000` by default.

### Running the Django Backend

Navigate to the Django backend directory and follow the setup instructions in its dedicated README:

```bash
cd backend/python
```

---

## Development Workflow

This project follows a feature-branch Git workflow to maintain clean commit history and safe pull requests.

**1. Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

**2. Stage and commit with a descriptive message:**
```bash
git add .
git commit -m "feat: describe what you implemented"
```

**3. Push and open a pull request:**
```bash
git push -u origin feature/your-feature-name
```
