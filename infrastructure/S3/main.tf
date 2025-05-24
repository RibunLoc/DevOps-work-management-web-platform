module "my_s3_bucket" {
  source            = "../modules/s3_bucket"  # Đường dẫn đến module S3 bucket
  bucket_name       = "terraform-task-management-2222"  # Tên bucket phải là duy nhất trên toàn cầu
  region            = "us-east-1"
  versioning_enabled = true
}