export interface UploadApiResponse {
  success?: boolean;
  url?: string;
  filename?: string;
  urls?: Array<{ url: string; filename: string }>;
  message?: string;
}
