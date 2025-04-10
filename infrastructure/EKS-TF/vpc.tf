// Tạo VPC cho EKS Cluster
module "vpc" {
  source = "../modules/vpc"

  vpc-name = var.vpc-name
  cidr_block = "10.0.0.0/16"
  azs = [var.region-az1, var.region-az2]
  subnet_public_name = ["10.0.1.0/24", "10.0.2.0/24"]
  subnet_private_name = ["10.0.3.0/24", "10.0.4.0/24"]
}

// Tạo Internet Gateway cho VPC
resource "aws_internet_gateway" "igw" {
  vpc_id = module.vpc.vpc_id
  tags = {
    Name = var.igw-name
  }
}

// Tạo NAT Gateway cho subnet private backend AZ1
module "nat-gateway-az1" {
  source = "../modules/natgw"
  public_subnet_id = module.vpc.public_subnet_ids[0] # Subnet public AZ1
  depends_on = [ aws_internet_gateway.igw]
}

// Tạo NAT Gateway cho subnet private backend AZ2
module "nat-gateway-az2" {
  source = "../modules/natgw"
  public_subnet_id = module.vpc.public_subnet_ids[1] # Subnet public AZ2 
  depends_on = [aws_internet_gateway.igw]
}

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
  subnet_ids = [module.vpc.private_subnet_ids[0]]

  routes = [{
    cidr_block = "0.0.0.0/0",
    nat_gateway_id = module.nat-gateway-az1.aws_nat_gateway_id
  }]
}

// Tạo Route Table cho private backend AZ2
module "route-table-priavte-az2" {
  source = "../modules/route_table"
  name = "private-rtb-az2"
  vpc_id = module.vpc.vpc_id
  subnet_ids = [module.vpc.private_subnet_ids[1]]

  routes =[{
    cidr_block = "0.0.0.0/0",
    nat_gateway_id = module.nat-gateway-az2.aws_nat_gateway_id
  }]
}

// Tạo Security Group cho ALB (External)
module "security_group_ALB" {
  source = "../modules/security_group"
  name = var.ALB-SG-name
  description = "Cho phep luu luong HTTP và HTTPS truy cap vao ALB."
  vpc_id = module.vpc.vpc_id

  ingress_rules = [
    {
      from_port = 80
      to_port = 80
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      from_port = 443
      to_port = 443
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]

  egress_rules = [
    {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
  
  tags = {
    Name = "SG-vpc-3tier"
  }
}

// Tạo Security Group cho Public subnet 
module "security_group_subnet_public" {
  source = "../modules/security_group"
  description = "Cho phep luu luong mang truy cap tu ALB den tang subnet public"
  name = var.Web-FrontEnd-SG-name
  vpc_id = module.vpc.vpc_id

  ingress_rules = [
    {
      from_port = 0
      to_port = 0
      protocol = "-1"
      source_security_group_id = module.security_group_ALB.security_group_id
      description = "Cho phep luu luong mang truy cap tu ALB den tang subnet public"
    }
  ]

  egress_rules = [
    {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]

  tags = {
      Name = "SG-vpc-3tier"
  }
}


// Tạo Security Group cho ALB phía sau Frontend Web (dự phòng)
# resource "aws_security_group" "ALB_SG_Internal" {
#   name       = var.ALB-SG-name-internal
#   //description = "Cho phep luu luong HTTP và HTTPS truy cap vao ALB internal"
#   vpc_id  = module.vpc.vpc_id

#   ingress {
#     //description = "Cho phép mọi truy cập từ Web FrontEnd tới ALB internal"
#     from_port = 0
#     to_port = 0
#     protocol = "-1"
#     cidr_blocks = [aws_security_group.Web_Front_End.id]
#   }

#   egress {
#     //description = "Cho phép truy cập ra mọi port"
#     from_port = 0
#     to_port = 0
#     protocol = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = var.ALB-SG-name-internal
#   }
# }

// Tạo Security Group cho tầng Backend từ public subnet xuống
module "security_group_Worker_Node" {
  source = "../modules/security_group"

  name = var.Web-BackEnd-SG-name
  description = "Cho phep luu luong truy cap tu ALB internal đen tang backend."
  vpc_id = module.vpc.vpc_id

  ingress_rules = [
    {
      description = "Cho phep luu luong tu public subnet den"
      from_port = 0
      to_port = 0
      protocol = "-1"
      source_security_group_id = module.security_group_subnet_public.security_group_id

    }
  ]

  egress_rules = [
    {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]

  tags = {
    Name = "SG-vpc-3tier"
  }

}


// Tạo Security Group cho Database
# resource "aws_security_group" "Database" {
#   name = var.Database-SG-name
#   description = "Cho phep luu luong truy cap tu tang backend den database"
#   vpc_id = module.vpc.vpc_id

#   ingress {
#     description = "Cho phep moi truy cap tu Web BackEnd toi Database"
#     from_port = 0
#     to_port = 0
#     protocol = "-1"
#     security_groups = [aws_security_group.Web_Back_End.id]
#   }

#   egress {
#     description = "Cho phep truy cap ra moi port"
#     from_port = 0
#     to_port = 0
#     protocol = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
  
#   tags = {
#     Name = var.Database-SG-name
#   }
# }

// Lấy thông tin Security Group mặc định của VPC
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


