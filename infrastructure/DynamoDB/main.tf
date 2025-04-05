provider "aws" {
  region = "us-east-1"
}

module "lock_table" {
  source = "../modules/dynamoDB"
  table_name = "Lock-Files"
  read_capacity = 5
  write_capacity = 5
  hash_key = "LockID"
}