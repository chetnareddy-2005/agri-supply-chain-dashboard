# 🌱 Farm2Trade — Agri Supply Chain Platform  

![React](https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge&logo=react)  
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-green?style=for-the-badge&logo=springboot)  
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge&logo=mysql)  
![Docker](https://img.shields.io/badge/Deployment-Docker-blue?style=for-the-badge&logo=docker)  
![Render](https://img.shields.io/badge/Hosted%20On-Render-black?style=for-the-badge&logo=render)  
![GitHub Pages](https://img.shields.io/badge/Frontend%20Host-GitHub%20Pages-purple?style=for-the-badge&logo=github)  

---

## 🚀 Live Demo  

🔗 **Frontend:** [https://chetnareddy-2005.github.io/agri-supply-chain-dashboard/ ](http://localhost:5173/agri-supply-chain-dashboard/app/) 

🔗 **Backend API:** https://agri-backend-xz72.onrender.com  

⚠️ *Note: Backend is hosted on free tier (Render), first load may take ~30–50 seconds.*  

---

## 📌 Overview  

**Farm2Trade** is a full-stack web application built to **eliminate middlemen** and directly connect:  

👨‍🌾 Farmers → 🛒 Retailers  

It provides a **secure, transparent, and efficient agricultural marketplace** with:  
- Role-based dashboards  
- Admin verification system  
- Secure transactions  
- Real-time analytics  

---

## 🧠 Key Features  

### 🔐 Role-Based Access Control (RBAC)
- Farmers → Add crops, manage orders  
- Retailers → Browse & purchase products  
- Admin → Full system control  

---

### 🧾 Admin Verification System
- Farmers/Retailers upload documents  
- Admin can:
  - ✅ Approve  
  - ❌ Reject  

---

### 💬 Complaint & Messaging System
- Ticket-based issue tracking  
- Admin-user chat system  
- Unread notification badges  

---

### 📊 Data Analytics Dashboard
- Interactive charts using Recharts  
- Track:
  - User distribution  
  - Transaction statuses  

---

### 💳 Payment Integration
- Cashfree Payment Gateway (Sandbox mode)  
- Simulated transaction flows  

---

### 📄 PDF Report Generation
- Export reports using:
  - html2canvas  
  - jsPDF  

---

## 🛠️ Tech Stack  

### 🎨 Frontend  
- React 19  
- Vite  
- React Router DOM  
- Recharts  
- Lucide Icons  
- CSS3 (No Tailwind)  

---

### ⚙️ Backend  
- Java 17  
- Spring Boot 3  
- Spring Security  
- Hibernate + JPA  

---

### 🗄️ Database  
- MySQL  

---

### ☁️ Deployment  
- Docker  
- Render (Backend)  
- GitHub Pages (Frontend)  

---

## 🔐 Authentication  

- Cookie-based session authentication  
- Uses `JSESSIONID`  
- Config:
  - SameSite=None  
  - Secure cookies  

--- 

## 📸 Screenshots
<img width="1920" height="1080" alt="Screenshot 2026-01-20 105614" src="https://github.com/user-attachments/assets/34973cd8-4745-42b7-8148-3afc25165a8b" />

<img width="1920" height="1080" alt="Screenshot 2026-01-20 105845" src="https://github.com/user-attachments/assets/62a4b940-111f-44e4-9501-04397d40bfcc" />


---

## ⚡ Getting Started (Local Setup)  

### 🔹 Prerequisites  
- Node.js (v18+)  
- Java 17  
- MySQL  

---

### 🔹 Run Backend  
cd backend
./mvnw spring-boot:run

---

### 🔹 Run Frontend  
cd frontend
npm install
npm run dev

---

### 🔹 Deploy Frontend  
npm run deploy

---

## 🧪 Demo Credentials  

| Role     | Email                     | Password     |
|----------|---------------------------|--------------|
| Admin    | admin@agriconnect.com     | Admin@123    |
| Farmer   | farmer@test.com           | 1234         |
| Retailer | retailer@test.com         | 1234         |

---

## 🧩 Project Architecture  
Frontend (React)
↓
REST APIs (Spring Boot)
↓
Database (MySQL)

---

## 🚀 Future Enhancements  

- 📱 Mobile App (React Native)  
- 🤖 AI-based crop price prediction  
- 🌍 Multi-language support  
- 📦 Order tracking with maps  
---

## 📜 License  

This project is licensed under the MIT License  

---

## 💡 Author  

👩‍💻 **C Y Chetna Reddy**  

- GitHub: https://github.com/chetnareddy-2005  

---

## ⭐ If you like this project  

Give it a ⭐ on GitHub — it helps a lot! 🚀  





