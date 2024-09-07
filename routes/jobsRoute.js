import express from 'express'
import userAuth from "../middelwares/authMiddleware.js";
import { CreateJobController, getAllJobsController } from '../controllers/jobsController.js';

const router = express.Router()

//routes

// CREATE JOB || POST
router.post('/create-job', userAuth, CreateJobController);

// Get jobs || GET
router.get('/get-job', userAuth, getAllJobsController)

export default router