resource "aws_iam_instance_profile" "iam-instance-profile" {
  name = "Jenkins-instance-profile"
  role = aws_iam_role.iam_role.name
}