export interface Question {
  id: number;
  question: string;
  answer: string;
  next: string;
  days: number;
}

export interface Resp {
  status: string,
  data?: string
}
