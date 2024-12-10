import mongoose, { mongo } from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../error/appError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import QueryBuilder from '../builder/queryBuilder';
import { studentSearchableFields } from './student.constant';


const getAllStudentFromDB = async (query: Record<string, unknown>) => {


  //searching ---------------------
  // const queryObj = { ...query }
  // let studentSearchableField = ['email', 'name.firstName', 'presentAddress']
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  //filterring------
  // const excludeFields = ['searchTearm', 'sort', 'limit', 'page', 'fields']
  // excludeFields.forEach(el => delete queryObj[el]);



  // const searchQuery = Student.find({
  //   $or: studentSearchableField.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' }
  //   })),
  // })

  // const filterquery = searchQuery.find().populate('admissionSemester').populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty'
  //   }
  // });

  //sorting  data

  // let sort = '-createdAt'

  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterquery.sort(sort);
  //set limit of data


  // let page = 1;
  // let limit = 1;
  // let skip = 0;
  // if (query.limit) {

  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)

  // const limitQuery = paginateQuery.limit(limit);

  //pagination
  // let fields = '-__V'
  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields)
  // return fieldQuery;


  const studentQuery = new QueryBuilder(Student.find().populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  }), query).search(studentSearchableFields).filter().sort().paginate().fields();


  const result = await studentQuery.modelQuery;

  return result;


};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.findById(id).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};
const updateStudentIntoBD = async (id: string, payload: Partial<TStudent>) => {
  // const result = await Student.findOne({ id });

  const { name, guardian, localGuardian, ...remainingStudentData } = payload
  const modifiedupdatedData: Record<string, unknown> = {
    ...remainingStudentData
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedupdatedData[`name.${key}`] = value
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedupdatedData[`guardian.${key}`] = value
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedupdatedData[`localGuardian.${key}`] = value
    }
  }
  const result = await Student.findByIdAndUpdate(id, modifiedupdatedData, { new: true, runValidators: true }).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();


    const deletedStudent = await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')


    }
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User')

    }
    await session.commitTransaction();
    await session.endSession();
    return deletedUser;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

  }
};

export const StudentServices = {

  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoBD,
};
