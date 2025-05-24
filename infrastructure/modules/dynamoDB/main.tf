provider "aws" {
  region = var.region
}

resource "aws_dynamodb_table" "this" {
    name = var.table_name
    billing_mode = "PROVISIONED"
    read_capacity = var.read_capacity
    write_capacity = var.write_capacity
    hash_key = var.hash_key

   attribute {
    name = "LockID"
    type = "S"
  }

    tags = {
      Environment = "dev"
      Name        = var.table_name
    }
}