export type TUser = {
  id: string;
  password: string;
  needspasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty'
  isDelete: boolean;
  status: 'in-progress'| 'block';
}

export type NewUser = {
  password: string;
  role: string
  id: string;
}