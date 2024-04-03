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

export interface Category {
  id: number;
  name: string;
}
