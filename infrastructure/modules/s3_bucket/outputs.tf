output "bucket_id" {
  description = "ID của S3 bucket được tạo"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "ARN của S3 bucket"
  value       = aws_s3_bucket.this.arn
}
