resource "aws_route_table" "route_table" {
  vpc_id = var.vpc_id
  
  tags = {
    Name = var.name
  }
}

resource "aws_route" "route_table" {
  for_each = {
    for idx, r in var.routes : idx => r
  }

  route_table_id = aws_route_table.route_table.id
  destination_cidr_block = each.value.cidr_block
  gateway_id = try(each.value.gateway_id, null)
  nat_gateway_id = try(each.value.nat_gateway_id, null)
  
}


resource "aws_route_table_association" "association" {
  for_each = {
    for idx, subnet_id in var.subnet_ids : idx => subnet_id
  }

  subnet_id      = each.value
  route_table_id = aws_route_table.route_table.id
}
