resource "time_sleep" "wait_for_kubernetes_longhorn" {
    depends_on = [ aws_eks_cluster.eks-cluster ]
    create_duration = "200s"
}

resource "kubernetes_namespace" "longhorn" {
  depends_on = [ time_sleep.wait_for_kubernetes_longhorn ]
  metadata {
    name = "longhorn-system"
  }
}

resource "helm_release" "longhorn" {
    depends_on = [ kubernetes_namespace.longhorn, time_sleep.wait_for_kubernetes_longhorn ]

    name       = "longhorn"
    repository = "https://charts.longhorn.io"
    chart      = "longhorn"
    create_namespace = false
    namespace  = kubernetes_namespace.longhorn.id
    version    = "1.9.0"
    values = [
        file("./longhorn-values.yaml")
    ]
    timeout = 2000

    # cấu hình đường dẫn lưu trữu longhorn
    set {
      name = "defaultSettings.defaultDataPath"
      value = "/var/lib/longhorn"
    }

    #
    set {
      name = "persistent.defaultClass"
      value = "true"
    }

    set {
      name = "defaultSettings.defaultReplicaCount"
      value = "2"
    }

    set {
      name = "defaultSettings.replicaAutoBalance"
      value = "best-effort"
    }
}