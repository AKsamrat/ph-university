import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../middleware/validateRequest';
import { updateStudentValidationSchema } from './student.zodValidation';

const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.delete('/:id', StudentController.deleteStudent);
router.get('/:id', StudentController.getSingleStudents);
router.patch('/:id', validateRequest(updateStudentValidationSchema), StudentController.updateStudent);

export const StudentRoutes = router;
