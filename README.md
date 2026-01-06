# NEPSE Trading Simulator 📈

A comprehensive, full-stack trading simulation platform designed for the Nepalese stock market (NEPSE). This application allows users to practice trading, manage portfolios, and compete in trading challenges without financial risk.

## 🚀 Features

### **User Dashboard**
- **Live Market Feed**: Real-time simulated stock prices and market trends.
- **Trading Journal**: Track your trades with strategies, notes, and performance metrics.
- **Portfolio Management**: Real-time tracking of holdings, profit/loss, and transaction history.
- **Competition Arena**: Join trading competitions, view leaderboards, and climb the ranks.
- **Strategy Tester**: Analyze and test your trading strategies against historical or simulated data.

### **Admin Dashboard**
- **User Management**: Monitor and manage user accounts and activity.
- **Market Control**: Add, update, or remove stocks; configure price simulation algorithms.
- **Competition Management**: Create and oversee trading competitions.
- **System Monitoring**: Track server performance, logs, and system health.

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS, Bootstrap, Framer Motion (for animations)
- **State Management**: React Hooks
- **Data Visualization**: Chart.js, Recharts, React-icons
- **Date Handling**: Nepali Date Converter, Nepali Datepicker

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), Bcryptjs
- **Monitoring**: Systeminformation
- **Other**: Nodemailer (for emails)

## 📦 Installation

To run this project locally, follow these steps:

### **Prerequisites**
- Node.js installed
- MongoDB installed and running

### **1. Clone the repository**
```bash
git clone <your-repository-url>
cd trading
```

### **2. Backend Setup**
Navigate to the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your configurations (e.g., `MONGODB_URI`, `JWT_SECRET`, `PORT`).

Start the backend server:
```bash
npm run dev
```

### **3. Frontend Setup**
Navigate to the `frontend` directory:
```bash
cd ../frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ for Nepalese Traders.*
