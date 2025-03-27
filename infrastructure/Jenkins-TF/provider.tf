provider "aws" {
  region = var.region_name
}

resource "aws_s3_bucket" "static" {
  bucket = var.bucket-name
  force_destroy = true

  tags = {
    Name = var.bucket-name
  }
}

resource "aws_s3_bucket_acl" "static" {
  bucket = aws_s3_bucket.static.id
  acl = "public-read"
}

resource "aws_s3_bucket_website_configuration" "static" {
  bucket = aws_s3_bucket.static.bucket
  
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }

}

resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id
  policy = file("s3_static_policy.json")
}