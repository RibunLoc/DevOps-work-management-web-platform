resource "aws_security_group" "this" {
  name        = var.name
  description = var.description
  vpc_id      = var.vpc_id
  tags        = merge({
    Name = var.name
  }, var.tags)

}

resource "aws_security_group_rule" "ingress" {
  security_group_id = aws_security_group.this.id

  for_each = {
    for idx, rule in var.ingress_rules : idx => rule
  }

  type        = "ingress"
  from_port   = each.value.from_port
  to_port     = each.value.to_port
  protocol    = each.value.protocol
  description = try( each.value.description, null)
  
  cidr_blocks               = can(each.value.source_security_group_id) ? null : each.value.cidr_blocks
  source_security_group_id = try(each.value.source_security_group_id, null)

  depends_on  = [aws_security_group.this]
}

resource "aws_security_group_rule" "egress" {
  security_group_id = aws_security_group.this.id

  for_each = {
    for idx, rule in var.egress_rules : idx => rule
  }
  type        = "egress"
  from_port   = each.value.from_port
  to_port     = each.value.to_port
  protocol    = each.value.protocol
  description = try(each.value.description, null)

  cidr_blocks               = can(each.value.source_security_group_id) ? null : each.value.cidr_blocks
  source_security_group_id = try(each.value.source_security_group_id, null)

  depends_on = [aws_security_group.this]

}
