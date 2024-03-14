export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
  role_id: number;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  role_id?: number;
}

export interface UpdatePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}