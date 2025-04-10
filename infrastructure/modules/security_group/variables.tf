variable "name" {
    description = "Tên của Security Group"
    type = string
}

variable "description" {
    description = "Mô tả của Security Group"
    type = string
  
}

variable "vpc_id" {
    description = "ID của VPC mà Security Group sẽ được tạo trong đó"
    type = string
}

variable "ingress_rules" {
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string 
    cidr_blocks  = optional(list(string), []) 
    source_security_group_id = optional(string) 
    description = optional(string)
  }))
  default = []
}

variable "egress_rules" {
  type = list(object({
    from_port    = number
    to_port      = number 
    protocol     = string 
    cidr_blocks  = optional(list(string), []) 
    source_security_group_id = optional(string) 
    description  = optional(string)
  }))
  default = []
}

variable "tags" {
    description = "Tags cho Security Group"
    type = map(string)
    default = {}
}