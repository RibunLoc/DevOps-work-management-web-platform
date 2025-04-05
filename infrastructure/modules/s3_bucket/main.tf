provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  acl    = "private"

  versioning {
    enabled = var.versioning_enabled
  }

  tags = {
    Name        = var.bucket_name
    Environment = "development"
  }
}
