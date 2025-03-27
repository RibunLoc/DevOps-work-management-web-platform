resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = var.vpc_name
  }
}

// Tạo internet gateway
resource "aws_internet_gateway" "igw"{
    vpc_id = aws_vpc.vpc.id

    tags = {
        Name = var.igw_name
    }
}

// Tạo 2 subnet cho 2 zone khác nhau 
// subnet AZ1
resource "aws_subnet" "public-subnet-Jenkins-AZ1" {
  vpc_id                    = aws_vpc.vpc.id
  cidr_block                = "10.0.1.0/24"
  availability_zone         = "us-east-1a"
  map_public_ip_on_launch   = true

  tags = {
    Name = var.subnet_name_AZ1
  }
}
//subnet AZ2
resource "aws_subnet" "public-subnet-Jenkins-AZ2" {
    vpc_id = aws_vpc.vpc.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = true

    tags = {
        Name = var.subnet_name_AZ2
    }
}

// Tạo route table
resource "aws_route_table" "rtb" {
    vpc_id = aws_vpc.vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw.id
    }

    tags = {
        Name = var.rtb_name
    }
}

resource "aws_route_table_association" "rtb_association_subnet_AZ1" {
    route_table_id = aws_route_table.rtb.id
    subnet_id = aws_subnet.public-subnet-Jenkins-AZ1.id  
}

resource "aws_route_table_association" "rtb_association_subnet_AZ2" {
    route_table_id = aws_route_table.rtb.id
    subnet_id = aws_subnet.public-subnet-Jenkins-AZ2.id
}

//Tạo security group cho VPC Jenkins
// Cho phép ingress port 22, 80, 8080, 9000
// Cho phép egress all 
resource "aws_security_group" "sg" {
    vpc_id = aws_vpc.vpc.id
    description = "Allow port 22, 80, 8080, 9000"

    ingress {
        from_port = 22
        to_port   = 22
        protocol  = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # Cho phép SSH 
    }

    ingress {
        from_port = 80
        to_port   = 80
        protocol  = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # Cho phép HTTP
    }

    ingress {
        description = "Port Jenkins"
        from_port = 8080
        to_port   = 8080
        cidr_blocks = ["0.0.0.0/0"] # Cho phép 8080
        protocol  = "tcp"
    }

    ingress {
        from_port = 9000
        to_port   = 9000
        cidr_blocks = ["0.0.0.0/0"] # Cho phép 9000
        protocol  = "tcp"
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = var.sg_name
    }

} 