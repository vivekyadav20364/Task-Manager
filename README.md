# Task Manager Configuration Guide

This document provides step-by-step instructions on how to configure and run the project for both the backend and frontend.

## Backend Configuration

1. **Install Dependencies**
```bash
   npm install
```
2. **Create a .env File**

Navigate to the server directory.
Create a file named .env.
Add the following environment variables to the .env file:
```
MONGO_DB=your-mongo-db-url
token=set-token
PORT=5000
```
3. **Start the Server**
You can start the server using either of the following commands:

```bash
node app.js
```
or, if you have nodemon installed:
```bash
nodemon app.js
```
## Frontend Configuration
1. **Install Dependencies**
Navigate to the frontend directory and run:
```bash
npm install
```
2. **Configure API Base URL**

If you have changed the port in the backend, update the base URL in the **utils/api** file accordingly.
If you haven't changed the port, no further action is needed.

3. **Run the Frontend Application**
Start the frontend application with:
```bash
npm run dev
```
