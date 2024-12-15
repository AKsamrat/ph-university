import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../middleware/validateRequest';
import { createStudentValidationSchema } from '../student/student.zodValidation';
import auth from '../middleware/auth';
import { USER_ROLE } from './user.constant';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';


const router = express.Router();

router.post('/create-student', auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;