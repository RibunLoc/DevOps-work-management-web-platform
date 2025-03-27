// Lấy thông tin VPC đã tạo trước đó
data "aws_vpc" "vpc" {
  filter {
    name   = "tag:Name"
    values = [var.vpc-name]
  }
}

// Lấy thông tin Internet Gateway của VPC
data "aws_internet_gateway" "igw" {
  filter {
    name   = "tag:Name"
    values = [var.igw-name]
  }
}

// Lấy thông tin subnet FrontEnd trên VPC zone 1
data "aws_subnet" "subnetPublicAz1" {
  filter {
    name   = "tag:Name"
    values = [var.subnet-name-jenkins-az1]
  }
}

// Lấy thông tin subnet FrontEnd trên VPC zone 2
data "aws_subnet" "subnetPublicAz2" {
  filter {
    name   = "tag:Name"
    values = [var.subnet-name-jenkins-az2]
  }
}

// Tạo subnet Backend Private trên VPC zone 1
resource "aws_subnet" "subnetPrivateAz1" {
  vpc_id                  = data.aws_vpc.vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = var.region-az1
  map_public_ip_on_launch = false

  tags = {
    Name = var.subnet-name-private-backend-az1
  }
}

// Tạo subnet Backend Private trên VPC zone 2
resource "aws_subnet" "subnetPrivateAz2" {
  vpc_id                  = data.aws_vpc.vpc.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = var.region-az2
  map_public_ip_on_launch = false

  tags = {
    Name = var.subnet-name-private-backend-az2
  }
}

// Tạo subnet Database Private trên VPC zone 1
resource "aws_subnet" "subnetDBPrivateAz1" {
  vpc_id                  = data.aws_vpc.vpc.id
  cidr_block              = "10.0.5.0/24"
  availability_zone       = var.region-az1
  map_public_ip_on_launch = false

  tags = {
    Name = var.subnet-name-database-private-az1
  }
}

// Tạo subnet Database Private trên VPC zone 2
resource "aws_subnet" "subnetDBPrivateAz2" {
  vpc_id                  = data.aws_vpc.vpc.id
  cidr_block              = "10.0.6.0/24"
  availability_zone       = var.region-az2
  map_public_ip_on_launch = false

  tags = {
    Name = var.subnet-name-database-private-az2
  }
}

// Tạo Elastic IP cho NAT Gateway
resource "aws_eip" "nat_eip_az1" {
  tags = {
    Name = "EIP-NAT-AZ1"
  }
}

resource "aws_eip" "nat_eip_az2" {
  tags = {
    Name = "EIP-NAT-AZ2"
  }
}

// Tạo NAT Gateway cho subnet private backend AZ1
resource "aws_nat_gateway" "PrivateNatGatewayAz1" {
  allocation_id = aws_eip.nat_eip_az1.id
  subnet_id     = aws_subnet.subnetPrivateAz1.id

  tags = {
    Name = "NAT-Gateway-Private-Backend-AZ1"
  }

  depends_on = [aws_internet_gateway.igw]
}

// Tạo NAT Gateway cho subnet private backend AZ2
resource "aws_nat_gateway" "PrivateNatGatewayAz2" {
  allocation_id = aws_eip.nat_eip_az2.id
  subnet_id     = aws_subnet.subnetPrivateAz2.id

  tags = {
    Name = "NAT-Gateway-Backend-AZ2"
  }

  depends_on = [aws_internet_gateway.igw]
}

// Tạo Route Table cho public
resource "aws_route_table" "public_frontend_rt" {
  vpc_id = data.aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = data.aws_internet_gateway.igw.id
  }

  tags = {
    Name = var.public-rtb-name
  }
}

// Associate Route Table với subnet public AZ1
resource "aws_route_table_association" "public_rt_association_az1" {
  subnet_id      = data.aws_subnet.subnetPublicAz1.id
  route_table_id = aws_route_table.public_frontend_rt.id
}

// Associate Route Table với subnet public AZ2
resource "aws_route_table_association" "public_rt_association_az2" {
  subnet_id      = data.aws_subnet.subnetPublicAz2.id
  route_table_id = aws_route_table.public_frontend_rt.id
}

// Tạo Route Table cho private backend AZ1
resource "aws_route_table" "private_backend_rt_NATGW_AZ1" {
  vpc_id = data.aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.PrivateNatGatewayAz1.id
  }

  tags = {
    Name = var.private-nat-rtb-name-az1
  }
}

// Associate Route Table với subnet private backend AZ1
resource "aws_route_table_association" "private_rt_association_az1" {
  subnet_id      = aws_subnet.subnetPrivateAz1.id
  route_table_id = aws_route_table.private_backend_rt_NATGW_AZ1.id
}

// Tạo Route Table cho private backend AZ2
resource "aws_route_table" "private_backend_rt_NATGW_AZ2" {
  vpc_id = data.aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.PrivateNatGatewayAz2.id
  }

  tags = {
    Name = var.private-nat-rtb-name-az2
  }
}

// Associate Route Table với subnet private backend AZ2
resource "aws_route_table_association" "private_rt_association_az2" {
  subnet_id      = aws_subnet.subnetPrivateAz2.id
  route_table_id = aws_route_table.private_backend_rt_NATGW_AZ2.id
}

// Tạo Security Group cho ALB (External)
resource "aws_security_group" "ALB_SG_External" {
  name        = var.ALB-SG-name
  description = "Cho phép lưu lượng HTTP và HTTPS truy cập vào"
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description = "Cho phép truy cập vào port 80"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Cho phép truy cập vào port 443"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0", "::/0"]
  }

  egress {
    description = "Cho phép truy cập ra mọi port"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0", "::/0"]
  }

  tags = {
    Name = var.ALB-SG-name
  }
}

// Tạo Security Group cho Frontend Web
resource "aws_security_group" "Web_Front_End" {
  name        = var.Web-FrontEnd-SG-name
  description = "Cho phép lưu lượng truy cập từ ALB đến tầng web."
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description     = "Cho phép truy cập vào từ ALB bên ngoài"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.ALB_SG_External.id]
  }

 
  egress {
    description = "Cho phép truy cập ra mọi port"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0", "::/0"]
  }

  tags = {
    Name = var.Web-FrontEnd-SG-name
  }
}

// Tạo Security Group cho ALB phía sau Frontend Web
resource "aws_security_group" "ALB_SG_Internal" {
  name       = var.ALB-SG-name-internal
  description = "Cho phép lưu lượng truy cập từ tầng web đến tầng backend."
  vpc_id  = data.aws_vpc.vpc.id

  ingress {
    description = "Cho phép mọi truy cập từ Web FrontEnd tới ALB internal"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = [aws_security_group.Web_Front_End.id]
  }

  egress {
    description = "Cho phép truy cập ra mọi port"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0", "::/0"]
  }

  tags = {
    Name = var.ALB-SG-name-internal
  }
}

// Tạo Security Group cho tầng Backend từ ALB internal 
resource "aws_security_group" "Web_Back_End" {
  name = var.Web-BackEnd-SG-name
  description = "Cho phép lưu lượng truy cập từ ALB internal đến tầng backend."
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    description = "Cho phép mọi truy cập từ ALB internal tới Web BackEnd"
    from_port = 0
    to_port = 0
    protocol = "-1"
    security_groups = [aws_security_group.ALB_SG_Internal.id]
  }

  egress {
    description = "Cho phép truy cập ra mọi port"
    from_port = 0
    to_port = 0
    protocol = "-1"
    security_groups = ["0.0.0.0/0", "::/0"]
  }

  tags = {
    Name = var.Web-BackEnd-SG-name
  }
}

// Tạo Security Group cho Database
resource "aws_security_group" "Database" {
  name = var.Database-SG-name
  description = "Cho phép lưu lượng truy cập từ tầng backend đến database."
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    description = "Cho phép mọi truy cập từ Web BackEnd tới Database"
    from_port = 0
    to_port = 0
    protocol = "-1"
    security_groups = [aws_security_group.Web_Back_End.id]
  }

  egress {
    description = "Cho phép truy cập ra mọi port"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0", "::/0"]
  }
  
  tags = {
    Name = var.Database-SG-name
  }
}


