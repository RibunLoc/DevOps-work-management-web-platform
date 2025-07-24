# DevOps-work-management-web-platform

### 🧑‍💻 Công nghệ & Công cụ DevOps

- **Terraform** – Triển khai Infrastructure as Code (IaC)
- **AWS (Amazon Web Services)** – Cloud Provider chính
- **Amazon EKS (Elastic Kubernetes Service)** – Container Orchestration
- **Git** – Quản lý mã nguồn, module hóa hạ tầng
- **AWS CLI** – Automation & quản lý resource
- **kubectl, eksctl** – Quản lý Kubernetes Cluster
- **Docker** - Container hóa ứng dụng
- **npm** - Cài đặt & build frontend/backend
- **Sonarqube** - Kiểm tra chất lượng mã, clean code
- **Trivy** - Scan lỗ hổng image & file cấu hình
- **Jenkins** - CI/CD pipeline: build, test, deploy
- **Prometheus && Grafana** - Giám sát & trực quan hóa hệ thống
---

## Triển khai hạ tầng AWS bằng Terraform

### 🌟 Giới thiệu chung

Dự án này áp dụng các phương pháp và công cụ DevOps để triển khai một hạ tầng hoàn chỉnh, ổn định và linh hoạt trên AWS, sử dụng Infrastructure as Code (IaC) với **Terraform**. 

Mục tiêu chính là tự động hóa việc tạo dựng, quản lý và mở rộng cơ sở hạ tầng cloud một cách nhanh chóng, chính xác và tái sử dụng được.

---

### 🔧 Kiến trúc hạ tầng

#### ✅ VPC 2-tier Architecture
- Triển khai VPC theo mô hình 2-tier (Public, Private)
- NAT Gateway nằm ở public subnet, đảm bảo các Node trong private subnet có thể truy cập internet để lấy image và cập nhật gói cần thiết.

#### ✅ Amazon EKS Cluster
- EKS Cluster triển khai trên VPC 2 tier tùy theo mục đích phù hợp để triển khai node trên các subnet (public/private)
- Node Group sử dụng EC2, quản lý bằng Terraform, đảm bảo scalability
- IAM Roles và Policies được cấu hình theo best practices (bao gồm OIDC, IRSA)

#### ✅ Security & Networking
- Security Group module hóa, hỗ trợ tạo rule một linh hoạt
- Route Table được tạo riêng biệt cho từng subnet và NAT Gateway
- Đảm bảo bảo mật cao và quản lý dễ dàng các luồng traffic trong nội bộ VPC

#### ✅ s3 
- Sử dụng làm nơi lưu trữ backend cho Terraform (remote state)
- Lưu trữ tài sản tĩnh, log, và artifacts phục vụ CI/CD

#### ✅ DynamoBD 
- Dùng kết hợp với S3 để quản lý state locking cho Terraform
- Đảm bảo trạng thái hạ tầng không bị ghi đè khi có nhiều người thao tác cùng lúc

#### ✅ SecretManager
- Lưu trữ và quản lý thông tin nhạy cảm (database credentials, API keys, v.v.)
---

### 📦 Module Terraform được triển khai

Dự án áp dụng cấu trúc module rõ ràng để dễ bảo trì, tái sử dụng:

| Module             | Vai trò chính                                         |
|--------------------|-------------------------------------------------------|
| `vpc`              | Quản lý mạng 2 tầng (public/private)         |
| `nat_gateway`      | NAT Gateway với Elastic IP                            |
| `route_table`      | Quản lý định tuyến (route tables và associations)     |
| `security_group`   | Tạo security group linh hoạt với nhiều tùy chọn       |
| `eks`              | Triển khai Kubernetes cluster và node group trên AWS  |

---

### 🚦 Các bước triển khai nhanh

#### ⚙️ Chuẩn bị
```bash
terraform init
```

#### 🧪 Kiểm tra cấu hình 
```bash
terraform plan --file=<file-configure.tfvars>
```

#### 🚀 Triển khai hạ tầng
```bash
terraform apply --file=<file-configure.tfvars> -auto-approve
```

#### 🛠️ Xóa hạ tầng 
```bash
terraform destroy --file=<file-configure.tfvars> 
```

## Triển khai quy trình CI/CD
![Pipeline CI/CD](/image/DevOps_Pipeline.gif)

