resource "aws_iam_role" "EKSClusterRole" {
   name = "EKSClusterRole"
   assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Principal = {
                    Service = "eks.amazonaws.com"
                }
                Action = "sts:AssumeRole"
            },
        ]
   })
   tags = {
     Name = "EKSClusterRole"
     Environment = "dev"
   }
}

resource "aws_iam_role" "NodeGroupRole" {
  name = "EKSNodeGroupRole"
  assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
                Action = "sts:AssumeRole"
            }
        ]
  })
  tags = {
    Name = "EKSNodeGroupRole"
    Environment = "dev"
  }
}

# Đây là kỹ thuật giúp cấp quyền IAM trực tiếp cho từng Pod trong EKS,
# thường dùng để gắn S3, DynamoDB, CloudWatch vào app.
# data "aws_iam_policy_document" "irsaAssumeRolePolicy" {
#    statement {
#     effect = "Allow"

#     principals {
#       type = "Federated"
#       identifiers = [ aws_iam_openid_connect_provider.eks.id ]
#     }

#     actions = ["sts:AssumeRoleWithWebIdentity"]

#     condition {
#         test = ["StringEquals"]
#         variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
#         values = ["system:serviceaccount:default:my-service-account"]
#     }
#    }
# }