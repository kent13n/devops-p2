export interface StudentRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  created_at: string;
  updated_at: string;
}
