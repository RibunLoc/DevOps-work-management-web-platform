resource "time_sleep" "wait_for_kubernetes_prometheus" {
    depends_on = [aws_eks_cluster.eks-cluster]
    create_duration = "200s"
}

resource "kubernetes_namespace" "name" {
  depends_on = [time_sleep.wait_for_kubernetes_prometheus]
  metadata {
    name = "monitoring"
  }
}


resource "helm_release" "prometheus" {
    depends_on = [ kubernetes_namespace.name, time_sleep.wait_for_kubernetes_prometheus, helm_release.grafana_kubernetes_operator ]
    name = "prometheus-stack"
    repository = "https://prometheus-community.github.io/helm-charts"
    chart = "kube-prometheus-stack"
    create_namespace = false
    namespace = kubernetes_namespace.name.id
    version = "72.8.0"
    values = [
        file("./prometheus-values.yaml")
    ]
    timeout = 2000

    set {
        name  = "grafana.resources.limits.cpu"
        value = "200m"
    }

    set {
        name  = "grafana.resources.limits.memory"
        value = "512Mi"
    }

    set {
        name  = "grafana.resources.requests.cpu"
        value = "100m"
    }

    set {
        name  = "grafana.resources.requests.memory"
        value = "256Mi"
    }
}

# Ref - https://artifacthub.io/packages/helm/grafana/grafana-operator
resource "helm_release" "grafana_kubernetes_operator" {
    depends_on = [helm_release.aws-load-balancer-controller]
    name = "grafana-operator"
    repository = "oci://ghcr.io/grafana/helm-charts"
    chart = "grafana-operator"
    create_namespace = false
    namespace = kubernetes_namespace.name.id
    version = "5.18.0"

    set {
        name = "crds.create"
        value = "true"
    }

}
