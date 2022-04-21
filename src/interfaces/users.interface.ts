export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  secondName: string;
  // contacts
  phone?: string;
  phoneWithMessenger?: string;
  birthDate?: Date;
  country?: string;
  city?: string;
  adress?: string;
  postIndex?: string;
  // legal info
  passNumber?: string;
  passEndDate?: string;
  passOrg?: string;
  familyStatus?: string;
  study?: string;
}
