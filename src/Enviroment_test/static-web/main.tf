terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.44.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "static" {
  bucket        = "terraform-hothanhloc-static-web-1221"
  force_destroy = true

}

resource "aws_s3_bucket_acl" "static" {
  bucket = aws_s3_bucket.static.id
  acl    = "public-read"
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

locals {
  mime_types = {
    html = "text/html"
    css  = "text/css"
    ttf  = "font/ttf"
    woff = "font/woff"
    woff2= "font/woff2"
    js   = "application/javascript"
    map  = "application/javascript"
    json = "application/json"
    jpg  = "image/jpeg"
    png  = "image/png"
    svg  = "image/svg+xml"
    eot  = "application/vnd.ms-fontobject"
  }
}

resource "aws_s3_object" "object" {
  for_each = fileset(path.module, "static-web-main/**/*")
  bucket = aws_s3_bucket.static.id
  key = replace(each.value, "static-web-main/", "")
  source = each.value
  etag = filemd5("${each.value}")
  content_type = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1])
  
}