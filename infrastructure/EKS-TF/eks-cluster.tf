resource "aws_eks_cluster" "eks-cluster" {
  name   = var.cluster-name
  role_arn = aws_iam_role.EKSClusterRole.arn
  
  vpc_config {
    subnet_ids          = [
                            module.vpc.public_subnet_ids[0],
                            module.vpc.public_subnet_ids[1],
                            module.vpc.private_subnet_ids[0],
                            module.vpc.private_subnet_ids[1]
                        ]
    security_group_ids  = [
                            data.aws_security_group.sg-default.id
                        ]
  }

  version = 1.31
  depends_on = [ 
    aws_iam_role_policy_attachment.AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.AmazonEKSServicePolicy,
    aws_iam_role_policy_attachment.AmazonEKSNetworkingPolicy,
    aws_iam_role_policy_attachment.AmazonEKSLoadBalancingPolicy,
    aws_iam_role_policy_attachment.AmazonEKSComputePolicy,
    aws_iam_role_policy_attachment.AmazonEKSBlockStoragePolicy
    ]

}