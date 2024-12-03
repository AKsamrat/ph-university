import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../middleware/validateRequest';
import { createStudentValidationSchema } from '../student/student.zodValidation';


const router = express.Router();

router.post('/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent);

export const UserRoutes = router;