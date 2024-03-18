interface Videos {
  name: string;
  file_url: string;
}

export interface CreateSubjectPayload {
  name: string;
  content: string;
  videos: Videos[];
}

export interface UpdateSubjectPayload {
  name?: string;
  content?: string;
  videos?: Videos[],
  quizzes?: UpdateQuizzessPayload[]
}

export interface UpdateVideoPayload {
  name?: string;
  file_url?: string;
}

interface Options {
  name: string;
  is_correct: boolean;
}

interface OptionsUpdate {
  id?: string;
  name?: string;
  is_correct?: boolean;
}

interface Quetions {
  name: string;
  discuss: string;
  options: Options[]
}

interface QuetionsUpdate {
  id?: string;
  name?: string;
  discuss?: string;
  options?: OptionsUpdate[]
}

export interface CreateQuizzesPayload {
  name: string;
  subject_id: string;
  quetions: Quetions[]
}

export interface UpdateQuizzessPayload {
  name?: string;
  quetions?: QuetionsUpdate[]
}

export interface UpdateQuetionPayload {
  name?: string;
  discuss?: string;
  options?: QuetionsUpdate[]
}

export interface UpdateOptionPayload {
  name?: string;
  is_correct?: boolean;
}

interface Answer {
  quetion_id: string;
  option_id: string;
}

export interface CreateAnswerPayload {
  quiz_id: string;
  quetions: Answer[];
} 