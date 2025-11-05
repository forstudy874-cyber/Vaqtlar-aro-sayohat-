export interface OptionDetail {
  option: string;
  gender: string;
  prompt?: string;
  garment_details?: string;
  environment_details?: string;
  pose_description?: string;
  lighting_description?: string;
  camera_details?: string;
}

export interface TimePeriod {
  period: string;
  options: OptionDetail[];
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}
