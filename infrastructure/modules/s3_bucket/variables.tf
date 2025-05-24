variable "bucket_name" {
  description = "Tên của S3 bucket"
  type        = string
}

variable "region" {
  description = "Region AWS cho bucket"
  type        = string
  default     = "us-east-1"
}

variable "versioning_enabled" {
  description = "Bật hay tắt versioning cho bucket"
  type        = bool
  default     = false
}
