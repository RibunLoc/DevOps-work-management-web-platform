terraform {
  backend "s3" {
    bucket         = "terraform-task-management-1234"
    region         = "us-east-1"
    key            = "Task-Management/EKS-TF/terraform.tfstate"
    dynamodb_table = "Lock-Files"
    encrypt =    true
  }
   required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
   }
   required_version = ">= 1.0.0"
}