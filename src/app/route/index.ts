import { Router } from 'express';
import { UserRoutes } from '../user/user.route';
import { StudentRoutes } from '../student/student.route';

import { AcademicSemesterRoutes } from '../academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../academicDepartment/academicDepertment.route';
import { FacultyRoutes } from '../faculty/faculty.route';
import { AdminRoutes } from '../admin/admin.route';
import { CourseRoutes } from '../course/course.route';
import { semesterRegistrationRoutes } from '../semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../OfferedCourse/OfferedCourse.route';
import { AuthRoutes } from '../auth/auth.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/studentsacademic_semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;