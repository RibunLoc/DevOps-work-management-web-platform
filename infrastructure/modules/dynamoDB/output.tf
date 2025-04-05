output "table_name" {
  description = "Tên của bảng DynamoDB đã tạo"
  value = aws_dynamodb_table.this.name
}

output "table_arn" {
  description = "ARN của bảng DynamoDB đã tạo"
  value = aws_dynamodb_table.this.arn 
}