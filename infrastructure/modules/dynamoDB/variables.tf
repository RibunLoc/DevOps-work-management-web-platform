variable "region" {
  description = "Vùng AWS nơi bảng DynamoDB sẽ được tạo"
  type        = string
  default = "us-east-1"
}

variable "table_name" {
  description = "Tên của bảng DynamoDB cần tạo"
  type        = string
}

variable "hash_key" {
  description = "Tên của khóa chính (hash key) của bảng"
  type        = string
}

variable "read_capacity" {
  description = "Số đơn vị đọc dự kiến"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Số đơn vị ghi dự kiến"
  type        = number
  default     = 5
}

# variable "attributes" {
#   description = "Danh sách các thuộc tính (attribute) cho bảng"
#   type = list(object({
#     name = string
#     type = string
#   }))
#   default = [
#     {
#       name = "LockID"
#       type = "S"
#     }
#   ]
# }
