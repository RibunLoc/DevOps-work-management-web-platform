# Đợi EKS cluster sẵn sàng trước
resource "time_sleep" "wait_for_kubernetes_argocd" {
    depends_on = [ aws_eks_cluster.eks-cluster ]
    create_duration = "200s" 
}

resource "kubernetes_namespace" "argocd" {
    depends_on = [ time_sleep.wait_for_kubernetes_argocd ]
    metadata {
        name = "argocd"
    }
}

# Cài đặt ArgoCD bằng Helm
resource "helm_release" "argocd" {
    depends_on = [kubernetes_namespace.argocd, time_sleep.wait_for_kubernetes_argocd]

    name      = "argocd"
    repository = "https://argoproj.github.io/argo-helm"
    chart      = "argo-cd"
    create_namespace = false
    namespace = kubernetes_namespace.argocd.id
    version    = "8.0.12" # Nhớ kiểm tra phiên bản mới nhất

    values = [
        file("./argocd-values.yaml")
    ]
    timeout = 2000
}

# Cung cấp data resource cho argocd_ui_url
data "kubernetes_service" "argocd_server" {
    depends_on = [ helm_release.argocd ]

    metadata {
      name = "argocd-server"
      namespace = "argocd"
    }
}

# # Xuất là đường dẫn web url
# output "argocd_ui_url" {
#     value = "http://${data.kubernetes_ingress.argocd.status.0.load_balancer.0.ingress.0.hostname}/argocd"
#     description = "UI URL truy cập đến ArgoCD"
# }