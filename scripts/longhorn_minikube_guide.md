# HƯỚNG DẪN CÀI ĐẶT LONGHORN TRÊN MINIKUBE (CHI TIẾT TỪNG BƯỚC)

## 🧠 Yêu cầu trước:
- Đã cài Docker Desktop hoặc Minikube hoạt động tốt
- RAM >= 4GB, bật virtualization
- `kubectl`, `helm` đã sẵn sàng

## 🔧 BƯỚC 1: Khởi động Minikube với driver docker (Longhorn cần driver hỗ trợ volume)

```bash
minikube start --driver=docker --memory=8192 --cpus=4 --disk-size=20g
```

📌 Nếu dùng WSL2 + Minikube: **bắt buộc dùng `--driver=docker`**, không dùng `--driver=none`.

## 🔧 BƯỚC 2: Bật tính năng default storage class

```bash
kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

## 🔧 BƯỚC 3: Thêm Helm repo của Longhorn và cập nhật

```bash
helm repo add longhorn https://charts.longhorn.io
helm repo update
```

## 🔧 BƯỚC 4: Tạo namespace và cài đặt Longhorn

```bash
kubectl create namespace longhorn-system

helm install longhorn longhorn/longhorn `
  --namespace longhorn-system `
  --create-namespace `
  --set persistence.defaultClass=true `
  --set persistence.defaultClassReplicaCount=1 `
  --set iscsi.enabled=false `
  --set preUpgradeChecker.job.enabled=false
```
## BƯỚC 4.1: SSH từng worker

```bash
sudo apt install open-iscsi -y
sudo systemctl enable --now iscsid
sudo apt install nfs-common
```
### Longhorn cần bật default storageclass và các tính năng liên quan.
```bash
minikube addons enable default-storageclass
minikube addons enable storage-provisioner
```

## 🔧 BƯỚC 5: Mở giao diện Longhorn UI

```bash
kubectl port-forward -n longhorn-system service/longhorn-frontend 8080:80
```

➡️ Truy cập tại: http://localhost:8080

## 🔍 KIỂM TRA TRẠNG THÁI

```bash
kubectl get pods -n longhorn-system
kubectl get svc -n longhorn-system
kubectl get storageclass
```

## 💡 GỢI Ý SỬ DỤNG LONGHORN

- Tạo PersistentVolumeClaim với `storageClassName: longhorn`
- Tích hợp cho PostgreSQL, MySQL, hoặc bất kỳ StatefulSet nào

## 🛑 Lưu ý:
- Không chạy trên `--driver=none`
- Không dùng với WSL2 nếu Minikube đang ở rootless mode
- Longhorn yêu cầu quyền ghi đĩa qua containerd hoặc dockerd