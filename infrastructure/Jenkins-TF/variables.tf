variable "vpc_name" {
  type        = string
  description = "Name tag for the VPC"
}

variable "igw_name" {
  type        = string
  description = "Name for the Internet Gateway"
}

variable "region_name" {
  type        = string
  description = "AWS region for deployment"
  default     = "us-east-1"
}

variable "subnet_name_AZ1" {
  type        = string
  description = "Name for subnet in availability zone 1"
}

variable "subnet_name_AZ2" {
  type        = string
  description = "Name for subnet in availability zone 2"
}

variable "rtb_name" {
  type        = string
  description = "Name tag for the route table"
}

variable "sg_name" {
  type        = string
  description = "Name for the security group"
}

variable "instance_type_name" {
  type        = string
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "keypair_name" {
  type        = string
  description = "Existing EC2 key pair for SSH"
}

variable "ec2_name" {
  type        = string
  description = "Name tag for the Jenkins EC2 instance"
}
