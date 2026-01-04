# FinTrack - MongoDB Deployment Guide

## Overview

This application now uses MongoDB Atlas for data persistence, allowing for cloud deployment and multi-device access.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account with connection string
- npm or yarn package manager

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:3001/api
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

For production, update `VITE_API_URL` to your deployed backend URL.

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

```bash
npm run server
```

The backend will start on http://localhost:3001

### 3. Start the Frontend (in a new terminal)

```bash
npm run dev
```

The frontend will start on http://localhost:5173

### 4. Or Start Both Together

```bash
npm start
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button
6. Add the connection string to your `.env` file

## Features

- ✅ Cloud-based data storage with MongoDB Atlas
- ✅ User-specific data isolation
- ✅ Offline fallback to localStorage
- ✅ Automatic data synchronization
- ✅ Secure data persistence

## API Endpoints

### Transactions

- `GET /api/transactions/:userEmail` - Get all transactions
- `POST /api/transactions/:userEmail` - Create transaction
- `PUT /api/transactions/:userEmail/:id` - Update transaction
- `DELETE /api/transactions/:userEmail/:id` - Delete transaction

### Expenses

- `GET /api/expenses/:userEmail` - Get all expenses
- `POST /api/expenses/:userEmail` - Create expense
- `PUT /api/expenses/:userEmail/:id` - Update expense
- `DELETE /api/expenses/:userEmail/:id` - Delete expense

### Interest

- `GET /api/interest/:userEmail` - Get all interest transactions
- `POST /api/interest/:userEmail` - Create interest transaction
- `PUT /api/interest/:userEmail/:id` - Update interest transaction
- `DELETE /api/interest/:userEmail/:id` - Delete interest transaction

### Earnings

- `GET /api/earnings/:userEmail` - Get all earnings
- `POST /api/earnings/:userEmail` - Create earning
- `PUT /api/earnings/:userEmail/:id` - Update earning
- `DELETE /api/earnings/:userEmail/:id` - Delete earning

### Health Check

- `GET /api/health` - Check server and database status

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Create a new web service**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 3001 (or your preferred port)
4. **Build command:** `npm install`
5. **Start command:** `node server.js`

### Frontend Deployment (Vercel/Netlify)

1. **Create a new site from GitHub**
2. **Set environment variables:**
   - `VITE_API_URL`: Your deployed backend URL (e.g., https://your-app.onrender.com/api)
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`

## Production Considerations

1. **Security:**

   - Keep `.env` file private and never commit it to Git
   - Use environment-specific URLs
   - Implement rate limiting on API endpoints
   - Add JWT authentication for better security

2. **Performance:**

   - Enable MongoDB Atlas connection pooling
   - Add caching for frequently accessed data
   - Optimize API response sizes

3. **Monitoring:**
   - Set up error logging
   - Monitor MongoDB Atlas metrics
   - Track API response times

## Troubleshooting

### MongoDB Connection Issues

- Check if IP address is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### API Not Responding

- Verify backend server is running
- Check if PORT is available
- Review server logs for errors

### Data Not Syncing

- Check browser console for API errors
- Verify VITE_API_URL is correct
- Ensure MongoDB connection is active

## Support

For issues or questions, check the server logs and browser console for detailed error messages.
