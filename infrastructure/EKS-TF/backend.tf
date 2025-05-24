terraform {
  backend "s3" {
    bucket         = "terraform-task-management-2222"
    region         = "us-east-1"
    key            = "Task-Management/EKS-TF/terraform.tfstate"
    dynamodb_table = "Lock-Files"
    encrypt =    true
  }
   required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "> 4.0"
    }
    helm = {
      source = "hashicorp/helm"
      version = " ~> 2.0"
    }
    kubectl = {
      source = "gavinbunney/kubectl"
      version = "~> 1.0"
    }
   }
   required_version = ">= 1.0.0"
}