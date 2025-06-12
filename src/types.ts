export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  group: string;
  subject: string;
  paidMonths: number[];
  isPaidCurrentMonth: boolean;
}
