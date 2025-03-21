// @ts-ignore
import {RequestHandler} from 'express';
import * as express from 'express';
import {updateUserData, fetchUserData, registerUser} from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/register-user', registerUser as RequestHandler);
router.get('/fetch-user-data/:userId', authMiddleware as RequestHandler, fetchUserData as RequestHandler);
router.put('/update-user-data/:userId', authMiddleware as RequestHandler, updateUserData as RequestHandler);

export default router;
