provider "helm" {
  kubernetes {
    host = data.aws_eks_cluster.default.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.default.certificate_authority[0].data)
    exec {
        // https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
        api_version = "client.authentication.k8s.io/v1beta1"
        command = "aws"
        args = ["eks", "get-token", "--cluster-name", data.aws_eks_cluster.default.id]
    }
  }
}