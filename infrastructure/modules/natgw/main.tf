resource "aws_eip" "natgw" {
  domain = "vpc"
  tags = {
    Name = "NAT-Gateway-EIP-${var.public_subnet_id}"
  }
}

resource "aws_nat_gateway" "natgw" {
    allocation_id = aws_eip.natgw.id
    subnet_id = var.public_subnet_id

    tags = {
      Name = "NAT-Gateway-${var.public_subnet_id}"
    }
}
