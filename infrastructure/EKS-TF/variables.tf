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

variable "igw-name" {
    description = "Tên của Internet Gateway"
    type = string
    default = "Jenkins_IGW"
}

variable "subnet-name-public-fronEnd-az1" {
    description = "Tên của subnet public FrontEnd AZ1"
    type = string
    default = "VPC-3tier-subnet-public-AZ1"
}

variable "subnet-name-public-fronEnd-az2" {
    description = "Tên của subnet public FrontEnd AZ2"
    type = string
    default = "VPC-3tier-subnet-public-AZ2"
}

variable "subnet-name-jenkins-az1" {
    description = "Tên của subnet được lấy từ Jenkins AZ1"
    type = string
    default = "Jenkins-subnet-AZ1"
}

variable "subnet-name-jenkins-az2" {
    description = "Tên của subnet được lấy từ Jenkins AZ2"
    type = string 
    default = "Jenkins-subnet-AZ2"
}

variable "region-az1" {
    description = "Khu vực 1 để triển khai EKS"
    type = string
    default = "us-east-1a"
}

variable "subnet-name-private-backend-az1" {
  description = "Tên của subnet private backend AZ1"
  type = string
  default = "Private_Backend_AZ1"
}

variable "region-az2" {
  description = "Khu vực 2 để triển khai EKS"
  type = string
  default = "us-east-1d"
}

variable "subnet-name-private-backend-az2" {
  description = "Tên của subnet private backend AZ2"
  type = string
  default = "Private_Backend_AZ2"
}

variable "subnet-name-database-private-az1" {
  description = "Tên của subnet private database AZ1"
  type = string
  default = "Private_Database_AZ1"
}

variable "subnet-name-database-private-az2" {
    description = "Tên của subnet private database AZ2"
    type = string
    default = "Private_Database_AZ2"
}

variable "public-rtb-name" {
    description = "Tên của route table public"
    type = string
    default = "my-Public-3tier-rtb"
}

variable "private-nat-rtb-name-az1" {
    description = "Tên của route table private NAT AZ1"
    type = string
    default = "my-Private-3tier-rt"
}

variable "private-nat-rtb-name-az2" {
    description = "Tên của route table private NAT AZ2"
    type = string
    default = "my-Private-3tier-rt2"
}

variable "ALB-SG-name" {
    description = "Tên của Security Group cho Application Load Balancer IGW"
    type = string
    default = "ALB-SG"
}

variable "Web-FrontEnd-SG-name" {
    description = "Tên của Security Group cho Web FrontEnd"
    type = string
    default = "Web-FrontEnd-SG"
}

variable "ALB-SG-name-internal" {
    description = "Tên của Security Group cho Application Load Balancer Internal"
    type = string
    default = "ALB-SG-Internal"
}

variable "Web-BackEnd-SG-name" {
  description = "Tên của Security Group cho Web BackEnd"
  type = string
  default = "Web-BackEnd-SG"
}

variable "Database-SG-name" {
  description = "Tên của Security Group cho Database"
  type = string
  default = "Database-SG"
}

variable "cluster-name" {
    description = "Tên của EKS Cluster"
    type = string
    default = "My-Cluster"
}

variable "eks-node-group-name" {
    description = "Tên của EKS Node Group"
    type = string
    default = "My-Node-Group"
}



