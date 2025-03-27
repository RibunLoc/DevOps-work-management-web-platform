resource "aws_instance" "ec2-Jenkins" {
  ami = data.aws_ami.ami.image_id
  instance_type = var.instance_type_name
  key_name         = var.keypair_name
  subnet_id        = aws_subnet.public-subnet-Jenkins-AZ1.id
  vpc_security_group_ids = [ aws_security_group.sg.id]
  iam_instance_profile = aws_iam_instance_profile.iam-instance-profile.name
  root_block_device {
    volume_size = 30
  }
  user_data = templatefile("./init-Jenkins-server.sh", {})
  tags = {
    Name = var.ec2_name
  }
}