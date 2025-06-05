variable "region" {
    description = "Khu vực để triển khai EKS trên AWS"
    type = string 
    default = "us-east-1"
}

variable "vpc-name" {
    description = "Tên của VPC"
    type = string
    default = "Jenkins_Server"
}

variable "region-az1" {
    description = "Khu vực 1 để triển khai EKS"
    type = string
    default = "us-east-1a"
}

variable "region-az2" {
  description = "Khu vực 2 để triển khai EKS"
  type = string
  default = "us-east-1d"
}

variable "ALB-SG-name-external" {
    description = "Tên của Security Group cho Application Load Balancer bên ngoài"
    type = string
    default = "Internet-facing-ALB-SG"
}

variable "Web-FrontEnd-SG-name" {
    description = "Tên của Security Group cho Web FrontEnd"
    type = string
    default = "Web-FrontEnd-SG"
}

variable "Web-BackEnd-SG-name" {
  description = "Tên của Security Group cho Web BackEnd"
  type = string
  default = "Web-BackEnd-SG"
}

variable "cluster_name" {
    description = "Tên của EKS Cluster"
    type = string
    default = "My-Cluster"
}

variable "eks-node-group-name" {
    description = "Tên của EKS Node Group"
    type = string
    default = "My-Node-Group"
}

variable "key_name" {
    description = "Tên của Key Pair để truy cập vào các EC2 instances"
    type = string
    default = "sshkey"
}

variable "instance_type" {
    description = "Loại instance EC2 cho EKS Node Group"
    type = string
    default = "t2.medium"
}



