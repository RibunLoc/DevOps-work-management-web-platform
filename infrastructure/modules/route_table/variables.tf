variable "vpc_id" {
  description = "ID của VPC mà Route Tabble sễ được tạo."
  type        = string
}

variable "routes" {
  description = "Danh sách các route trong Route Table."
  type = list(object({
    cidr_block     = string
    gateway_id     = optional(string)
    nat_gateway_id = optional(string)
  }))
}

variable "name" {
  description = "Tên của Route Table muốn đặt."
  type        = string
}

variable "subnet_ids" {
  description = "Danh sách subnet muốn gắn vào Route Table."
  type        = list(string)
}

