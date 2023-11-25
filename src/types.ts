export interface Error {
  status?: number;
  message?: string;
}

export type EmailDataType = {
  email: string
  subject: string
  html: string
}