# 📰 PulsePoint

**PulsePoint** is a modern news article reading platform focused on **clean reading**, **simplicity**, and **user experience**.  
It offers a **Free** and **Premium** tier, secure authentication, and seamless payments — all built with **Angular 20** and **Spring Boot 3.5**.

---

## ✨ Features

### 🧠 Reading First
- Clean, distraction-free article reading experience  
- Minimal UI designed for long-form reading  

### 📌 Bookmarks
- Bookmark articles to read later  
- Bookmarks are securely stored per user  

### 🆓 Free vs 💎 Premium

| Feature | Free | Premium |
|------|------|---------|
| Read news articles | Limited | Unlimited |
| Bookmark articles | ✅ | ✅ |
| Clean reading UI | ✅ | ✅ |

Premium removes all article reading limits.

---

## 🔐 Authentication & Payments

- JWT-based authentication
- Secure login & signup
- Stripe integration for premium subscriptions
- Stripe webhooks keep subscription status in sync automatically

---

## 🧱 Architecture

PulsePoint follows a **clean, layered architecture** on the backend:

Controller → Service → Repository → Database

### Backend Highlights
- Spring Boot 3.5
- JWT authentication & authorization
- Stripe webhook handling
- MongoDB for data persistence
- Clear separation of concerns

### Frontend Highlights
- Angular 20
- Modular component-based design
- Auth-aware UI (Free vs Premium)
- Clean and responsive layouts

---

## 📰 News Source

- Articles are fetched using a News API
- Centralized service layer handles fetching and processing
- Designed for easy extension to additional news sources

---

## 📸 Screenshots

### 🏠 Homepage
Clean, readable news feed focused on content.

### 🔐 Login / Signup
Secure authentication with a simple UI.

> Place screenshots inside a `/screenshots` folder and reference them like:
> ![Homepage](screenshots/homepage.png)

---

## ⚙️ Tech Stack

### Frontend
- Angular 20
- TypeScript
- HTML / CSS

### Backend
- Spring Boot 3.5
- Java
- MongoDB
- JWT
- Stripe API

---

## 🔑 Environment Variables

### Backend
JWT_SECRET=your_jwt_secret  
STRIPE_SECRET_KEY=your_stripe_secret_key  
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret  
NEWS_API_KEY=your_news_api_key  

### Frontend
API_BASE_URL=http://localhost:8080

---

## 🚀 Running the Project Locally

### Backend (Spring Boot)
./mvnw spring-boot:run

### Frontend (Angular)
npm install  
ng serve  

App runs on:
- Frontend → http://localhost:4200
- Backend → http://localhost:8080

---

## 📌 Project Status

- Actively developed
- Core features implemented
- UI and feature set open for expansion

---

## 🙌 Why PulsePoint?

PulsePoint is built for:
- People who actually read news
- Developers who value clean architecture
- A scalable foundation for premium content platforms
