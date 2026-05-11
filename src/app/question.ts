export interface FsrsCard {
  state: number;
  step: number | null;
  stability: number;
  difficulty: number;
  due: string;
  last_review: string;
}

export interface FsrsNextInfo {
  [key: string]: FsrsCard;
}

export interface Question {
  id: number;
  question: any;
  questionHead?: string;
  answer: string;
  images?: string[];
  next: string;
  days: number;
  reps?: number;
  easiness?: number;
  lastAnswer?: string;
  added?: string;
  card?: FsrsCard;
  nextInfo?: FsrsNextInfo;
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
