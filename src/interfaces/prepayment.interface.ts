export interface IPrepayment {
  _id: string;
  userId: string;
  sum: string | number;
  isApproved: boolean | null;
  createdAt?: string;
  userComment?: string;
  adminComment?: string;
}
