variable "vpc-name" {
  description = "Name of the VPC"
  type        = string
  default     = "vpc-default"
}

variable "cidr_block" {
  description = "value of the CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_public_name" {
  description = "Name of the public subnet"
  type        = list(string)
  
}

variable "subnet_private_name" {
  description = "Name of the private subnet"
  type        = list(string)
  
}

variable "azs" {
  description = "value of the availability zones"
  type        = list(string)
}