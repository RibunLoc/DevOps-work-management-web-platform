// Tạo VPC cho EKS Cluster
module "vpc" {
  source = "../modules/vpc"
  vpc-name = var.vpc-name
  cidr_block = "10.0.0.0/16"
  azs = [var.region-az1, var.region-az2]
  subnet_public_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
  subnet_private_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]
}

// Tạo Internet Gateway cho VPC
resource "aws_internet_gateway" "igw" {
  vpc_id = module.vpc.vpc_id
  tags = {
    Name = "VPC-2tier-IGW"
  }
}

// Tạo NAT Gateway cho subnet private backend AZ1
module "nat-gateway-az1" {
  source = "../modules/natgw"
  public_subnet_id = module.vpc.public_subnet_ids[0] # Subnet public AZ1
  depends_on = [ aws_internet_gateway.igw]
}

# Không cần thiết cho môi trường development 
# // Tạo NAT Gateway cho subnet private backend AZ2
# module "nat-gateway-az2" {
#   source = "../modules/natgw"
#   public_subnet_id = module.vpc.public_subnet_ids[1] # Subnet public AZ2 
#   depends_on = [aws_internet_gateway.igw]
# }

// Tạo Route Table cho public
module "route-table-public" {
  source = "../modules/route_table"
  name = "public-rtb"
  vpc_id = module.vpc.vpc_id
  subnet_ids = [module.vpc.public_subnet_ids[0], module.vpc.public_subnet_ids[1]]
  routes = [{
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.igw.id
    }]
  
}

// Tạo Route Table cho private backend AZ1
module "route-table-private-az1" {
  source = "../modules/route_table"
  name = "private-rtb-az1"
  vpc_id = module.vpc.vpc_id
  subnet_ids = [module.vpc.private_subnet_ids[0], module.vpc.private_subnet_ids[1]]
  depends_on = [module.nat-gateway-az1]

  routes = [{
    cidr_block = "0.0.0.0/0",
    nat_gateway_id = module.nat-gateway-az1.aws_nat_gateway_id
  }]
}

# // Tạo Route Table cho private backend AZ2
# module "route-table-private-az2" {
#   source = "../modules/route_table"
#   name = "private-rtb-az2"
#   vpc_id = module.vpc.vpc_id
#   subnet_ids = [module.vpc.private_subnet_ids[1]]

#   routes =[{
#     cidr_block = "0.0.0.0/0",
#     nat_gateway_id = module.nat-gateway-az1.aws_nat_gateway_id
#   }]
# }

// Tạo Security Group cho ALB (External)
module "security_group_ALB" {
  source = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name = var.ALB-SG-name-external
  description = "Cho phep luu luong HTTP va HTTPS truy cap vao ALB"
  vpc_id = module.vpc.vpc_id
  
  ingress_with_cidr_blocks = [
  {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = "0.0.0.0/0"
  },
  {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = "0.0.0.0/0"
  }
]
   
  egress_rules = ["all-all"]
  
  tags = {
    Name = "SG-vpc-3tier"
  }
}

// Tạo Security Group cho Public subnet 
module "security_group_FrontEnd" {
  source = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  # depends_on = [module.aws_load_balancer]
  description = "Cho phep luu luong ALB den tang subnet public"
  name = var.Web-FrontEnd-SG-name
  vpc_id = module.vpc.vpc_id
  
  # Ingress: cho phép HTTP và HTTPS từ Internet
  ingress_with_source_security_group_id = [
    {
      description               = "Cho phep luu luong HTTP truy cap tu ALB den public subnet"
      from_port                 = 80
      to_port                   = 80
      protocol                  = "tcp"
      source_security_group_id  = module.security_group_ALB.security_group_id
    },
    {
      description               = "Cho phep luu luong HTTPS truy cap tu ALB den public subnet"
      from_port                 = 443
      to_port                   = 443
      protocol                  = "tcp"
      source_security_group_id  = module.security_group_ALB.security_group_id
    }
  ]
 
  # Egress: cho phép all-outbound ra Internet
  egress_rules = [ "all-all" ]
  
  tags = {
      Name = "SG-vpc-3tier"
  }
}

// Tạo Security Group cho tầng Backend từ public subnet xuống
module "security_group_BackEnd" {
  source = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  depends_on = [module.security_group_FrontEnd]
  name = var.Web-BackEnd-SG-name
  description = "Cho phep luu luong truy cap tu ALB internal den tang backend"
  vpc_id = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      description = "Cho phep luu luong tu public subnet den"
      from_port = 0
      to_port = 0
      protocol = "tcp"
      source_security_group_id = module.security_group_FrontEnd.security_group_id
    }
  ]

  egress_rules = [ "all-all" ]
  
  tags = {
    Name = "SG-vpc-3tier"
  }
}


/*Lấy thông tin Security Group mặc định của VPC để gắn vào eks cluster mặc định
 chỉ phù hợp cho môi trường development*/
data "aws_security_group" "sg-default" {
  filter {
    name   = "vpc-id"
    values = [module.vpc.vpc_id]
  }

  filter {
    name   = "group-name"
    values = ["default"]
  }
}

# Tạo security Group cho EKS Cluster
module "eks_cluster_sg" {
  source         = "terraform-aws-modules/security-group/aws"

  name           = "eks-cluster-sg"
  vpc_id         = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      description = "Quy dinh ip cu the duoc phep truy cap den EKS Cluster"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0" # thay bằng IP của bạn hoặc CIDR block của mạng nội bộ
    },
    {
      description = "Cho phep HTTP truy cap den EKS Cluster"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  egress_with_cidr_blocks = [
    {
      from_port  = 0
      to_port    = 0
      protocol   = "-1"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = {
    Name = "SG-vpc-3tier"
  }
}

output "security_group_BackEnd" {
  value = module.security_group_BackEnd.security_group_id
}

output "security_group_FrontEnd" {
  value = module.security_group_FrontEnd.security_group_id
}

