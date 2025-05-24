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
# module "security_group_ALB" {
#   source = "terraform-aws-modules/security-group/aws"
#   version = "~> 4.0"

#   name = var.ALB-SG-name
#   description = "Cho phep luu luong HTTP va HTTPS truy cap vao ALB"
#   vpc_id = module.vpc.vpc_id
  

#   ingress_with_cidr_blocks = [
#     {
#       from_port   = 0
#       to_port     = 0
#       protocol    = "-1"
#       description = "User-service ports"
#       cidr_block  = "0.0.0.0/0"
#     }
#   ]
   
#   egress_rules = ["all-all"]
  
#   tags = {
#     Name = "SG-vpc-3tier"
#   }
# }

// Tạo Security Group cho Public subnet 
module "security_group_subnet_public" {
  source = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  # depends_on = [module.aws_load_balancer]
  description = "Cho phep luu luong mang truy cap tu ALB den tang subnet public"
  name = var.Web-FrontEnd-SG-name
  vpc_id = module.vpc.vpc_id
  

  # ingress_with_source_security_group_id = [
  #   {
  #     description               = "Allow alb inbound traffic to public subnet"
  #     from_port                 = 0
  #     to_port                   = 0
  #     protocol                  = "-1"
  #     source_security_group_id  = module.aws_load_balancer.security_group_id
  #   }
  # ]

  ingress_rules = [ "all-all" ]

  // Egress: cho phép all-outbound ra Internet
  egress_rules = [ "all-all" ]
  
  tags = {
      Name = "SG-vpc-3tier"
  }
}


// Tạo Security Group cho tầng Backend từ public subnet xuống
module "security_group_Worker_Node" {
  source = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  depends_on = [module.security_group_subnet_public]
  name = var.Web-BackEnd-SG-name
  description = "Cho phep luu luong truy cap tu ALB internal den tang backend"
  vpc_id = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      description = "Cho phep luu luong tu public subnet den"
      from_port = 0
      to_port = 0
      protocol = "-1"
      source_security_group_id = module.security_group_subnet_public.security_group_id
    }
  ]

  egress_rules = [ "all-all" ]
  

  tags = {
    Name = "SG-vpc-3tier"
  }

}

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

# module "aws_load_balancer"{
#   source  = "terraform-aws-modules/alb/aws"
#   version = "9.16.0"

#   name = "alb-public-subnet"

#   vpc_id = module.vpc.vpc_id
#   subnets = [module.vpc.public_subnet_ids[0], module.vpc.public_subnet_ids[1]]

#   security_group_ingress_rules = {
#     all_http = {
#       from_port   = 80
#       to_port     = 80
#       ip_protocol = "tcp"
#       description = "HTTP web traffic"
#       cidr_ipv4   = "0.0.0.0/0"
#     }
#     all_https = {
#       from_port = 443
#       to_port   = 443
#       ip_protocol = "tcp"
#       description = "HTTPS web traffic"
#       cidr_ipv4   = "0.0.0.0/0"
#     }
#   }
#   security_group_egress_rules = {
#     all = {
#       ip_protocol = "-1"
#       cidr_ipv4 = "10.0.0.0/16"
#     }
#   }

#   access_logs = {
#     bucket = "terraform-task-management-2222"
#   }

#   target_groups = [
#     {
#       name_prefix = "h1"
#       protocol = "HTTP"
#       backend_port     = 80
#       target_type = "ip"
#       vpc_id = module.vpc.vpc_id
#       health_check = {
#         path = "/"
#         interval = 30
#         timeout  = 5
#         healthy_threshold = 2
#         unhealthy_threshold = 2
#       }

#       targets = [
#         {
#           target_id = "10.0.1.10"      # hoặc module.app.private_ip
#           port      = 80
#         }
#       ]
#     }
#   ]

#   listeners = [
#     {
#       port     = 80
#       protocol = "HTTP"

#       default_action = {
#         type = "forward"
#         target_group_index = 0
#       }
#     }
    
#   ]

#   tags = {
#     Environment = "dev"
#     Project     = "vpc-3tier"
#   }
# }


