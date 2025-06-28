# EKS service assume để tạo và quản lý cluster.
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

# Role cho các EC2 instance (worker node) trong EKS cluster sử dụng
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
    Name = "${var.cluster_name}-nodegroup-role"
    Environment = "dev"
  }
}

# Giúp IAM role có quyền truy xuất thông tin cluster để dùng để dùng CLI
module "allow_eks_access_iam_policy" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  version = "5.55.0"
  name = "Allow_EKS_Access"

  create_policy = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "eks:DescribeCluster",
        ]
        Effect = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Tạo iam role eks-admin-iam-role
module "eks_admins_iam_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  version = "5.55.0"

  role_name = "eks-admin-iam-role"
  create_role = true
  role_requires_mfa = false

  custom_role_policy_arns = [module.allow_eks_access_iam_policy.arn]
  
  trusted_role_arns = [
    "arn:aws:iam::${module.vpc.vpc_owner_id}:root"
  ]
}

# Tạo iam user user-1
module "iam_iam-user" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-user"
  version = "5.55.0"
  
  name = "user-1"
  create_iam_access_key = true
  create_iam_user_login_profile = true

  force_destroy = true
}

# Tạo iam policy allow_assume_eks_admin_iam_policy
module "allow_assume_eks_admin_iam_policy" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  version = "5.55.0"

  name = "allow-assume-eks-admin-iam-policy"
  create_policy = true
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sts:AssumeRole",
        ]
        Effect = "Allow"
        Resource = module.eks_admins_iam_role.iam_role_arn 
      }
    ]
  })
}

# Tạo iam group eks-admin
module "eks_admins_iam_group" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-group-with-policies"
  version = "5.55.0"

  name = "eks-admin"
  attach_iam_self_management_policy = false
  create_group = true
  group_users = [
    module.iam_iam-user.iam_user_name
  ]
  custom_group_policy_arns = [
    module.allow_assume_eks_admin_iam_policy.arn
  ]
}
