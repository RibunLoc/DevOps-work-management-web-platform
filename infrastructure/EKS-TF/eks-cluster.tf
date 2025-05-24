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

  version = 1.28
  depends_on = [ 
    aws_iam_role_policy_attachment.AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.AmazonEKSServicePolicy,
    aws_iam_role_policy_attachment.AmazonEKSNetworkingPolicy,
    aws_iam_role_policy_attachment.AmazonEKSLoadBalancingPolicy,
    aws_iam_role_policy_attachment.AmazonEKSComputePolicy,
    aws_iam_role_policy_attachment.AmazonEKSBlockStoragePolicy
    ]
}


data "aws_eks_cluster" "default" {
  name = aws_eks_cluster.eks-cluster.id
}

//
data "aws_eks_cluster_auth" "default" {
  name = aws_eks_cluster.eks-cluster.id
}

provider "kubernetes" {
  host = data.aws_eks_cluster.default.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.default.certificate_authority[0].data)
  

  exec {
    // https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", data.aws_eks_cluster.default.id]
  }
}