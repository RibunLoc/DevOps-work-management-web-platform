resource "aws_eks_node_group" "eks_node_group_private" {
  cluster_name = aws_eks_cluster.eks-cluster.name
  node_group_name = var.eks-node-group-name
  node_role_arn = aws_iam_role.NodeGroupRole.arn
  subnet_ids = [module.vpc.private_subnet_ids[0], module.vpc.private_subnet_ids[1]]
  
scaling_config {
    desired_size = 1
    max_size = 1
    min_size = 1
}

  ami_type = "AL2_x86_64"
  instance_types = ["t2.medium"]
  disk_size      = 20

    depends_on = [ 
        aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
        aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
        aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly
     ]

    tags = {
        Name = "${var.cluster-name}-node-group-priavte"
        Environment = "dev" 
    }
}


resource "aws_eks_node_group" "eks_node_group_public" {
  cluster_name = aws_eks_cluster.eks-cluster.name
  node_group_name = "node-group-public-group"
  node_role_arn = aws_iam_role.NodeGroupRole.arn
  subnet_ids = [module.vpc.public_subnet_ids[0], module.vpc.public_subnet_ids[1]]
  
scaling_config {
    desired_size = 1
    max_size = 1
    min_size = 1
}

  ami_type = "AL2_x86_64"
  instance_types = ["t2.medium"]
  disk_size      = 20

    depends_on = [ 
        aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
        aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
        aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly
     ]

    tags = {
        Name = "${var.cluster-name}-node-group-public"
        Environment = "dev" 
    }
}