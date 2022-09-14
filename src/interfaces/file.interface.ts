export interface IFile {
  _id: string;
  path: string;
  originalname: string;
  createdAt?: Date;
  ext: string;
  metadata?: Record<string, string>;
}
