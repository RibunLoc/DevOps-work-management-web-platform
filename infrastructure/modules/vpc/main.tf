resource "aws_vpc" "this" {
  cidr_block = var.cidr_block

  tags = {
    Name = var.vpc-name
  }
}

resource "aws_subnet" "public" {
  for_each = toset(var.subnet_public_cidrs)
  
  vpc_id   = aws_vpc.this.id
  cidr_block = each.value
  availability_zone = var.azs[index(var.subnet_public_cidrs, each.value)]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.vpc-name}-public-${each.value}"
    "kubernetes.io/role/elb"              = "1"
    "kubernetes.io/cluster/Task-Management-Cluster" = "shared"
  }
}

resource "aws_subnet" "private" {
  for_each = toset(var.subnet_private_cidrs)

  vpc_id  = aws_vpc.this.id 
  cidr_block = each.value 
  availability_zone = var.azs[index(var.subnet_private_cidrs, each.value)]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.vpc-name}-private-${each.value}"
    "kubernetes.io/role/internal-elb"     = "1"
    "kubernetes.io/cluster/Task-Management-Cluster"   = "shared"
  }
  
}
