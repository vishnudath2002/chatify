import { Router } from 'express';
import { getUsers , getUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get("/:userId", getUser)

export default router;