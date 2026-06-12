# Full Stack MERN Online Cake Shop

A complete, responsive, modern UI-based, production-level structured MERN stack application for an online cake shop.

## Project Structure
- `client/`: React Frontend (Vite)
- `server/`: Node.js/Express Backend

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (already set in `server/.env` to a demo database, you can change it to your own MongoDB Atlas connection)

### 1. Backend Setup
```bash
cd server
npm install
npm run start (or node server.js)
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Features
- **Modern UI**: Built with React, Tailwind CSS, and Lucide React icons.
- **Responsive Design**: Looks great on mobile, tablet, and desktop.
- **Backend APIs**: RESTful API endpoints for cakes, users, orders, and cart using Express and Mongoose.
- **Authentication**: JWT based authentication.
- **Pages Included**: Home, Catalog, Login/Register.
- **State Management**: Scalable structure designed for React Context API or Redux.

## Environment Variables
The `.env` file in the `server` directory should have:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
PORT=5000
```
*(An example `.env` file is already created in the server folder)*
