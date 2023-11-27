export interface IFile {
  _id: string;
  path: string;
  originalname: string;
  createdAt?: string;
  updatedAt?: string;
  ext: string;
  metadata?: Record<string, string>;
}
