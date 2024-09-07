// const express = require('express')
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import 'express-async-errors';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobsRoutes from './routes/jobsRoute.js';
import errorMiddleware from './middelwares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
// Dot ENV config
dotenv.config();

// connection mongodb
connectDB();

// rest object
const app = express();


//middleware
app.use(express.json());
// app.use(cors()); 
// routes
// app.get('/', (req, res) => {
//     res.send("<h1> Welcome to my Job Portal </h1>");
// });
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);
app.use(errorMiddleware);

// port 
const PORT = process.env.PORT || 8785

// listen
app.listen(8785, ()=>{
    console.log(`Node Server Running In ${process.env.DEV_MODE} Mode on port ${PORT}`.bgWhite.yellow);
});  