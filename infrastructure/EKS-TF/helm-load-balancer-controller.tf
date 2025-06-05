resource "aws_iam_openid_connect_provider" "eks" {
  url = aws_eks_cluster.eks-cluster.identity[0].oidc[0].issuer
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0cbed6f99"]
}

module "aws_load_balancer_controller_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "5.55.0"

  role_name = "aws-load-balancer-controller"

  attach_load_balancer_controller_policy = true

  oidc_providers = {
    ex = {
      provider_arn = aws_iam_openid_connect_provider.eks.arn
      namespace_service_accounts  = ["kube-system:aws-load-balancer-controller"]
    }
  }
}

resource "kubernetes_service_account" "aws-lb_sa" {
  metadata {
    name     = "aws-load-balancer-controller"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = module.aws_load_balancer_controller_irsa_role.iam_role_arn
    }
  }
}

resource "helm_release" "aws-load-balancer-controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "1.8.0"

  namespace = "kube-system"

  depends_on = [ 
    module.aws_load_balancer_controller_irsa_role,
    aws_iam_openid_connect_provider.eks,
    kubernetes_service_account.aws-lb_sa
   ]

  set {
    name  = "replicaCount"
    value = 1
  }

  set {
    name  = "clusterName"
    value = aws_eks_cluster.eks-cluster.name
  }

  set {
    name  = "region"
    value = var.region
  }

  set {
    name  = "vpcId"
    value = aws_eks_cluster.eks-cluster.vpc_config[0].vpc_id
  }

  set {
    name  = "serviceAccount.name"
    value = kubernetes_service_account.aws-lb_sa.metadata[0].name 
  }

  set {
    name = "serviceAccount.create"
    value = false
  }
}