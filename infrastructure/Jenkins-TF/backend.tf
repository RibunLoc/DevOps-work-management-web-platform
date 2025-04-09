terraform {
  backend "s3" {
    bucket = "terraform-task-management-1234"
    region = "us-east-1"
    key    = "Jenkins/terraform.tfstate"
    dynamodb_table = "Lock-Files"
    encrypt = true
  } 
  required_version = ">=1.2.0"
  required_providers {
    aws = {
      version = ">= 3.0.0"
      source = "hashicorp/aws"
    }
  }
}

