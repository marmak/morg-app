export interface Question {
  id: number;
  question: string;
  questionHead?: string;
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


export interface PendingCounts {
  [key: string]: number;
}
