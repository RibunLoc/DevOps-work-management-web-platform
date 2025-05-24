resource "time_sleep" "wait_for_kubernetes"{
    depends_on = [aws_eks_cluster.eks-cluster]
    create_duration = "20s"
}

resource "kubernetes_namespace" "name" {
  depends_on = [time_sleep.wait_for_kubernetes]
  metadata {
    name = "monitoring"
  }
}

resource "helm_release" "prometheus" {
    depends_on = [ kubernetes_namespace.name, time_sleep.wait_for_kubernetes ]
    name = "prometheus"
    repository = "https://prometheus-community.github.io/helm-charts"
    chart = "kube-prometheus-stack"
    create_namespace = false
    namespace = kubernetes_namespace.name.id
    version = "70.10.0"
    values = [
        file("./monitoring-values.yaml")
    ]
    timeout = 2000

    set {
        name = "podSecurityPplicy.enabled"
        value = true
    }

    set {
        name = "server.persitentVolume.enabled"
        value = true
    }

    set {
        name = "server\\.resources"
        value = yamlencode({
            limits = {
                cpu = "200m"
                memory = "512Mi"
            }
            requests = {
                cpu = "100m"
                memory = "256Mi"
            }
        })
    }
}

