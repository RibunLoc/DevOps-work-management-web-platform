resource "time_sleep" "wait_for_kubernetes" {
    depends_on = [ aws_eks_cluster.eks-cluster ]
    create_duration = "30s"
}

resource "kubernetes_namespace" "longhorn" {
  depends_on = [ time_sleep.wait_for_kubernetes ]
  metadata {
    name = "longhorn-system"
  }
}

resource "helm_release" "longhorn" {
    depends_on = [ kubernetes_namespace.longhorn ]

    name       = "longhorn"
    repository = "https://charts.longhorn.io"
    chart      = "longhorn"
    namespace  = kubernetes_namepsace.longhorn.metadata[0].name
    version    = "1.6.2"
    values = [
        file("./longhorn-values.yaml")
    ]

    set {
        name = "defaultSettings.defaultReplicaCount"
        value = "2"
    }

    set {
        name = "defaultSettings.replicaAutoBalance"
        value = "best-effort"
    }


}