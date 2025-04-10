resource "aws_vpc" "this" {
  cidr_block = var.cidr_block
  
  tags = {
    Name = var.vpc-name
  }
}

resource "aws_subnet" "public" {
  for_each = toset(var.subnet_public_name)
  
  vpc_id   = aws_vpc.this.id
  cidr_block = each.value
  availability_zone = var.azs[index(var.subnet_public_name, each.value)]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.vpc-name}-public-${each.value}"
  }

}

resource "aws_subnet" "private" {
  for_each = toset(var.subnet_private_name)

  vpc_id  = aws_vpc.this.id 
  cidr_block = each.value 
  availability_zone = var.azs[index(var.subnet_private_name, each.value)]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.vpc-name}-private-${each.value}"
  }
  
}
