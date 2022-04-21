export interface IPrepayment {
  id: string;
  userId: string;
  sum: string | number;
  isApproved: boolean | null;
  createdAt?: Date | string;
}
