data "aws_ami" "eks_worker" {
  most_recent = true
  owners      = ["602401143452"]

  filter {
    name   = "name"
    values = ["amazon-eks-node-1.29-v*"]
  }
}


# khai báo lauch tmplate dành cho frontend 
resource "aws_launch_template" "eks_node_group_frontend" {
  name_prefix = "eks-node-group-"
  image_id    = data.aws_ami.eks_worker.id
  instance_type = var.instance_type
  key_name = "ssh_key"
  
  block_device_mappings {
    device_name = "/dev/xvda"   
    ebs {
      volume_size           = 40    
      volume_type           = "gp2"  
      delete_on_termination = true
    }
  } 

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y iscsi-initiator-utils nfs-utils
    sudo systemctl enable --now iscsid
    /etc/eks/bootstrap.sh ${aws_eks_cluster.eks-cluster.name}
  EOF
  )
}

# khai báo launch templatte dành cho backend
resource "aws_launch_template" "eks_node_group_backend" {
  name_prefix = "eks-node-group-"
  image_id    = data.aws_ami.eks_worker.id
  instance_type = var.instance_type
  key_name = "ssh_key"
  
  block_device_mappings {
    device_name = "/dev/xvda"   
    ebs {
      volume_size           = 40    
      volume_type           = "gp2"  
      delete_on_termination = true
    }
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y iscsi-initiator-utils nfs-utils
    sudo systemctl enable --now iscsid
    /etc/eks/bootstrap.sh ${aws_eks_cluster.eks-cluster.name}
  EOF
  )
}

resource "aws_eks_node_group" "eks_node_group_backend" {
  cluster_name = aws_eks_cluster.eks-cluster.name
  node_group_name = "node-group-backend"
  node_role_arn = aws_iam_role.NodeGroupRole.arn
  subnet_ids = module.vpc.private_subnet_ids

  scaling_config {
    desired_size = 3
    max_size = 4
    min_size = 2
  }

  launch_template {
    id = aws_launch_template.eks_node_group_backend.id
    version = aws_launch_template.eks_node_group_backend.latest_version
  }

  depends_on = [ 
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly
  ]

  tags = {
      Name = "${var.cluster_name}-node-group-backend"
      Environment = "dev" 
  }
}

resource "aws_eks_node_group" "eks_node_group_frontend" {
  cluster_name = aws_eks_cluster.eks-cluster.name
  node_group_name = "node-group-frontend"
  node_role_arn = aws_iam_role.NodeGroupRole.arn
  subnet_ids = module.vpc.private_subnet_ids
  
  scaling_config {
      desired_size = 3
      max_size = 4
      min_size = 2
  }

  launch_template {
    id = aws_launch_template.eks_node_group_frontend.id
    version = aws_launch_template.eks_node_group_frontend.latest_version
  }

  depends_on = [ 
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly
  ]

  tags = {
      Name = "${var.cluster_name}-node-group-frontend"
      Environment = "dev" 
  }
}