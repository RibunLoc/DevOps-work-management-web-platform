output "cluster_name" {
  description = "Tên của EKS Cluster"
  value       = aws_eks_cluster.eks-cluster.name
}

output "cluster_endpoint" {
  description = "Endpoint để truy cập control plane của EKS"
  value       = aws_eks_cluster.eks-cluster.endpoint
}

output "cluster_arn" {
  description = "ARN của EKS Cluster"
  value       = aws_eks_cluster.eks-cluster.arn
}

output "cluster_certificate_authority_data" {
  description = "Certificate Authority data để kết nối Kubernetes"
  value       = aws_eks_cluster.eks-cluster.certificate_authority[0].data
}

output "cluster_security_group_id" {
  description = "ID của Security Group gắn với EKS Cluster"
  value       = module.eks_cluster_sg.security_group_id
}