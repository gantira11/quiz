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
}

export interface UpdateVideoPayload {
  name?: string;
  file_url?: string;
}

interface Options {
  name: string;
  is_correct: boolean;
}

interface Quetions {
  name: string;
  discuss: string;
  options: Options[]
}

export interface CreateQuizzesPayload {
  name: string;
  subject_id: string;
  quetions: Quetions[]
}

export interface UpdateQuizzessPayload {
  name: string;
}

export interface UpdateQuetionPayload {
  name?: string;
  discuss?: string;
}

export interface UpdateOptionPayload {
  name?: string;
  is_correct?: boolean;
}