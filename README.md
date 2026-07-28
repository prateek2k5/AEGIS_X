# 🛡️ AEGIS-X
### AI-Powered Security Operations Center (SOC)

AEGIS-X is an AI-powered Security Operations Center (SOC) built to monitor system resources, detect suspicious processes, provide AI-based threat analysis, and generate security reports in real time.

The project combines system monitoring, AI-driven insights, authentication, incident management, and reporting into a single modern security dashboard.

---

# ✨ Features

## 🔐 Authentication
- JWT-based secure login
- Protected API endpoints
- Automatic session validation
- Logout functionality

---

## 📊 System Monitoring

- Live CPU Monitoring
- Memory Usage Monitoring
- Disk Usage Monitoring
- Network Traffic Monitoring
- Running Process Monitoring
- Live Performance Charts
- System Health Score

---

## 🤖 AI Security Analysis

- AI Risk Score
- Threat Level Detection
- AI Confidence Score
- AI Security Advisor
- AI Explainability
- Threat Assessment
- Recommended Actions

---

## 🚨 Incident Management

- Automatic High-Risk Process Detection
- AI Generated Incident Cards
- Resolve Suspicious Processes
- Live Incident Updates

---

## 📜 Security Audit Logs

- Login Logs
- Incident Logs
- Report Generation Logs
- Process Resolution Logs
- Clear Audit Logs

---

## 📄 Reporting

- Generate Security Report
- PDF Report Export
- System Statistics Summary
- AI Analysis Summary

---

## ⚙️ Dashboard Features

- Dark / Light Theme
- Configurable Refresh Interval
- Toast Notifications
- Loading Screen
- Error Handling
- Responsive Dashboard

---

# 🏗️ Project Architecture

```
                User
                  │
                  ▼
        Frontend Dashboard
      (HTML • CSS • JavaScript)
                  │
             REST API
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┼────────────┐
      │           │            │
      ▼           ▼            ▼
 Process      AI Analysis   Audit Logs
 Monitoring      (Groq)
      │
      ▼
 PDF Report Generator
```

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js

## Backend

- FastAPI
- Python

## AI

- Groq API (Llama Model)

## Authentication

- JWT (JSON Web Token)
- python-jose
- passlib

## Libraries

- psutil
- ReportLab
- python-multipart

---

# 📂 Project Structure

```
AEGIS-X
│
├── backend
│   ├── api
│   ├── routes
│   ├── services
│   ├── reports
│   └── main.py
│
├── frontend
│   ├── css
│   ├── js
│   ├── login.html
│   └── index.html
│
├── requirements.txt
├── README.md
└── LICENSE
```

---

# 🔑 Authentication Flow

```
Login
   │
   ▼
JWT Token Generated
   │
   ▼
Token Stored in Browser
   │
   ▼
Protected API Requests
   │
   ▼
Dashboard Access
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd AEGIS-X
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Backend

```bash
uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

---

## Start Frontend

Run `login.html` using VS Code Live Server.

Frontend:

```
http://127.0.0.1:5500/login.html
```

---

# 🔐 Default Credentials

```
Username : admin

Password : admin123
```

---

# 📌 Core Functionalities

- Secure JWT Authentication
- Live System Monitoring
- AI Threat Detection
- AI Explainability
- Incident Management
- Security Audit Logs
- PDF Security Report
- Theme Support
- Refresh Interval Management
- Responsive Dashboard

---

# 🔮 Future Enhancements

- Multi-User Authentication
- Role-Based Access Control (RBAC)
- Email Alerts
- Database Integration
- SIEM Integration
- Malware Detection
- Docker Deployment
- Cloud Deployment
- Real-Time Notifications
- Machine Learning Based Threat Prediction

---

# 🎯 Learning Outcomes

- FastAPI REST API Development
- JWT Authentication
- System Monitoring with psutil
- AI Integration using Groq
- Frontend Dashboard Development
- Report Generation
- Incident Management
- Secure API Design

---

# 👨‍💻 Author

**Prateek Verma**

B.Tech Information Technology

AI & Software Developer

---

# 📄 License

This project is developed for educational and academic purposes.
