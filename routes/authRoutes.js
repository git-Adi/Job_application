import express from 'express'
import { registerController , loginController} from '../controllers/authController.js';

//router
const router = express.Router();

//routes
router.post('/register', registerController)
router.post('/login', loginController)

export default router