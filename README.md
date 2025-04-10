# DevOps-work-management-web-platform

# Phần này sẽ nói đến triển khai hạ tầng AWS bằng Terraform

## 🌟 Giới thiệu chung

Dự án này áp dụng các phương pháp và công cụ DevOps để triển khai một hạ tầng hoàn chỉnh, ổn định và linh hoạt trên AWS, sử dụng Infrastructure as Code (IaC) với **Terraform**. 

Mục tiêu chính là tự động hóa việc tạo dựng, quản lý và mở rộng cơ sở hạ tầng cloud một cách nhanh chóng, chính xác và tái sử dụng được.

---

## 🧑‍💻 Công nghệ & Công cụ DevOps

- **Terraform** – Triển khai Infrastructure as Code (IaC)
- **AWS (Amazon Web Services)** – Cloud Provider chính
- **Amazon EKS (Elastic Kubernetes Service)** – Container Orchestration
- **Git** – Quản lý mã nguồn, module hóa hạ tầng
- **AWS CLI** – Automation & quản lý resource
- **kubectl, eksctl** – Quản lý Kubernetes Cluster

---

## 🔧 Kiến trúc hạ tầng

### ✅ VPC 3-tier Architecture
- Triển khai VPC theo mô hình 3-tier (Public, Private, Database subnet)
- NAT Gateway nằm ở public subnet, đảm bảo các Node trong private subnet có thể truy cập internet để lấy image và cập nhật gói cần thiết.

### ✅ Amazon EKS Cluster
- EKS Cluster triển khai trên các subnet private
- Node Group sử dụng EC2, quản lý bằng Terraform, đảm bảo scalability
- IAM Roles và Policies được cấu hình theo best practices (bao gồm OIDC, IRSA)

### ✅ Security & Networking
- Security Group module hóa, hỗ trợ tạo rule động, linh hoạt
- Route Table được tạo riêng biệt cho từng subnet và NAT Gateway
- Đảm bảo bảo mật cao và quản lý dễ dàng các luồng traffic trong nội bộ VPC

---

## 📦 Module Terraform được triển khai

Dự án áp dụng cấu trúc module rõ ràng để dễ bảo trì, tái sử dụng:

| Module             | Vai trò chính                                         |
|--------------------|-------------------------------------------------------|
| `vpc`              | Quản lý mạng 3 tầng (public/private/database)         |
| `nat_gateway`      | NAT Gateway với Elastic IP                            |
| `route_table`      | Quản lý định tuyến (route tables và associations)     |
| `security_group`   | Tạo security group linh hoạt với nhiều tùy chọn       |
| `eks`              | Triển khai Kubernetes cluster và node group trên AWS  |

---

## 🚦 Các bước triển khai nhanh

### ⚙️ Chuẩn bị
```bash
terraform init
```

### 🧪 Kiểm tra cấu hình 
```bash
terraform plan
```

### 🚀 Triển khai hạ tầng
```bash
terraform apply
```

### 🛠️ Xóa hạ tầng 
```bash
terraform destroy
```

