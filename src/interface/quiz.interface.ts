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