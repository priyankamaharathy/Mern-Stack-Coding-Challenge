# Transaction Analytics Dashboard

A full-stack MERN application for analyzing transaction data with filtering, searching, and visualization capabilities.

## 🚀 Live Demo

- Frontend: https://mern-stack-coding-challenge-frontend.vercel.app/
- Backend API: https://mern-stack-coding-challenge-roxiler.vercel.app/

![Dashboard Preview]
![Capture3](https://github.com/user-attachments/assets/6684d152-d233-46c7-9d7b-add7a71a4fa6)
![Capture4](https://github.com/user-attachments/assets/65217e39-2cba-4e1d-be38-86d45e215fae)


## 🌟 Features

- 📊 Real-time transaction analytics
- 🔍 Advanced search functionality
- 📅 Monthly data filtering
- 📈 Interactive charts (Bar & Pie)
- 🌙 Modern dark theme UI
- 📱 Fully responsive design
- 🔄 Real-time data updates

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
## 🔌 API Endpoints

### Transactions
- GET /api/transactions
  - Query params: month, search, page, perPage

### Statistics
- GET /api/statistics
  - Query params: month

### Charts
- GET /api/bar-chart
- GET /api/pie-chart
  - Query params: month

