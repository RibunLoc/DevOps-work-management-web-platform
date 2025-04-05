output "dynamoDB_table_arn" {
  value = module.lock_table.table_arn
  description = "ARN của bảng DynamoDB đã tạo"
}