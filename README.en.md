# Django-Vue-Admin (French & Multilingual Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python >= 3.8](https://img.shields.io/badge/Python-%3E%3D%203.8-blue.svg)](https://python.org/)
[![Django 3.2+ / 4.x / 5.x / 6.x](https://img.shields.io/badge/Django-3.2%20--%206.x-green.svg)](https://www.djangoproject.com/)
[![Node.js >= 14.x](https://img.shields.io/badge/Node.js-%3E%3D%2014.x-brightgreen.svg)](https://nodejs.org/)
[![Vue.js 2.6](https://img.shields.io/badge/Vue.js-2.6.x-4fc08d.svg)](https://vuejs.org/)

**[Français](./README.md)** | **[English](./README.en.md)** | **[GitHub Repository](https://github.com/noumegniedmond237-sketch/django-vue-admin)**

---

## 📌 Overview

**Django-Vue-Admin (DVA)** is an open-source rapid development platform for enterprise management systems and admin dashboards.

This edition has been fully **localized into French**, modernized, and optimized for smooth execution on Windows, Linux, and macOS:
* **Frontend**: Vue 2 + Element-UI + D2Admin + VXE-Table.
* **Backend**: Python + Django + Django REST Framework (DRF) + SimpleJWT.
* **Internationalization**: Native support for **French (default)** and **English**.
* **Automatic Launcher**: Smart `run.bat` script for Windows with automated dependency verification and setup.

---

## 🚀 1-Click Quickstart (Windows)

The repository includes an intelligent startup script [`run.bat`](./run.bat) located at the root directory that handles the entire setup lifecycle:
1. Validates Python and Node.js installations.
2. Creates and activates the Python virtual environment (`backend\.venv_sys`).
3. Automatically installs required dependencies (`requirements.txt` and `package.json`).
4. Executes database migrations and loads initial fixtures.
5. Starts both Django backend and Vue frontend development servers simultaneously.
6. Automatically opens your default web browser to the dashboard.

```cmd
:: Simply double-click run.bat or execute from a terminal:
.\run.bat
```

---

## ⚙️ Manual Setup

### Prerequisites
* **Python**: `>= 3.8.0` (compatible with Python 3.10, 3.11, 3.12, 3.13)
* **Node.js**: `>= 14.0.0` (with npm)
* **Database**: SQLite by default (ready to use out of the box) or MySQL / PostgreSQL

---

### 1. Starting the Backend (Django)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv .venv_sys

# On Windows:
.\.venv_sys\Scripts\activate
# On Linux / macOS:
# source .venv_sys/bin/activate

# 3. Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Initialize system fixtures and regional data (first time only)
python manage.py init
python manage.py init_area

# 6. Start backend development server
python manage.py runserver 127.0.0.1:8000
```

> **Swagger / OpenAPI Documentation** available at: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

---

### 2. Starting the Frontend (Vue.js)

```bash
# 1. Navigate to web directory
cd web

# 2. Install Node.js dependencies
npm install

# 3. Start development server
# (NODE_OPTIONS variable is required with Node.js 17+)
npm run dev
```

> **Web Application** accessible at: [http://localhost:8080/](http://localhost:8080/)

---

## 🔑 Default Credentials

| Parameter | Value |
|---|---|
| **Username** | `superadmin` |
| **Password** | `admin123456` |
| **Role** | Super Administrator |

---

## ✨ Key Features

1. **📊 Customizable Workbench / Dashboard**:
   * 13 modular widgets (traffic analytics, ECharts charts, geographic distribution, real-time clock, system stats).
   * Drag-and-drop widget layout, ordering, and visibility management.
2. **👥 User & Role Management**:
   * Full CRUD, role assignment, password reset, avatar upload, departmental allocation.
   * Role-Based Access Control (RBAC) with fine-grained permission matrix.
3. **🏢 Department & Organization Structure**:
   * Tree-structured hierarchical organization (company, subsidiary, department, team).
4. **🧭 Dynamic Menu & Button Permissions**:
   * Database-driven navigation, FontAwesome/SVG icons, individual button-level authorization.
5. **📖 System Data Dictionaries**:
   * Hierarchical key-value lookups and system configuration codes.
6. **🗺️ Administrative & Regional Management**:
   * Full administrative divisions (provinces, cities, districts).
7. **📁 File & Attachment Manager**:
   * Document and image uploads, integrated cropping tool, file preview, and download.
8. **🛡️ API Whitelist & Security**:
   * Public endpoint configuration requiring no authentication token.
9. **📑 Audit & Login Logs**:
   * Login access logs (IP address, location, user-agent, authentication status).
   * Operation logs tracking user actions and database modifications.
10. **🎨 Visual Customization**:
    * Predefined themes, compact/medium/mini sizing, dynamic accent color selector.

---

## 🐳 Docker Deployment (Optional)

```bash
# Start containers with Docker Compose
docker-compose up -d

# Initialize database within the container
docker exec -ti dvadmin-django bash
python manage.py makemigrations
python manage.py migrate
python manage.py init_area
python manage.py init
exit
```

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it for personal and commercial projects.
