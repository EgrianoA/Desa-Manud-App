import userRouter from './user'
import { Router } from 'express';

const router: Router = Router();

router.use('/users', userRouter)

export default router
