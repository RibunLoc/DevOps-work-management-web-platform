resource "aws_eks_cluster" "eks-cluster" {
  name   = var.cluster-name
  role_arn = aws_iam_role.EKSClusterRole.arn
  
  vpc_config {
    subnet_ids          = [
                            data.aws_subnet.subnetPublicAz1.id,
                            data.aws_subnet.subnetPublicAz2.id,
                            aws_subnet.subnetPrivateAz1.id,
                            aws_subnet.subnetPrivateAz2.id,
                        ]
    security_group_ids  = [
                            // viet lai
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