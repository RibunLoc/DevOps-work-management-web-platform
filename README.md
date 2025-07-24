# DevOps-work-management-web-platform

### 🧑‍💻 Công nghệ & Công cụ DevOps

- **Terraform** – Triển khai Infrastructure as Code (IaC)
- **AWS (Amazon Web Services)** – Cloud Provider chính
- **Amazon EKS (Elastic Kubernetes Service)** – Container Orchestration
- **Git** – Quản lý mã nguồn, module hóa hạ tầng
- **Docker** - Container hóa ứng dụng
- **npm** - Cài đặt & build frontend/backend
- **Sonarqube** - Kiểm tra chất lượng mã, clean code
- **Trivy** -Quét lỗ hổng bảo mật trong Docker image và các file cấu hình như YAML, Terraform.
- **Snyk** - hân tích và quét lỗ hổng trong mã nguồn và dependency của ứng dụng.
- **Hashicorp Vault** -  Lưu trữ và quản lý secrets như token, API key, credentials một cách an toàn.
- **ArgoCD** - Triển khai GitOps cho Kubernetes, tự động đồng bộ và quản lý trạng thái ứng dụng từ Git.
- **Longhorn** - Giải pháp lưu trữ phân tán cho Kubernetes, hỗ trợ backup, restore và high availability cho persistent volume.
- **Helm chart** -Quản lý deployment Kubernetes bằng cách đóng gói ứng dụng dưới dạng biểu đồ (chart), dễ tái sử dụng và tùy biến.
- **Jenkins** - CI/CD pipeline: build, test, deploy
- **Prometheus && Grafana** - Giám sát hiệu năng và trực quan hóa hệ thống, cảnh báo khi có sự cố xảy ra.
- **Cloudflare** -  Cung cấp CDN, bảo vệ DDoS, tối ưu hóa hiệu năng và DNS phân giải nhanh toàn cầu.
- **ngrok** - Kết nối máy local với internet qua tunnel bảo mật, phục vụ testing webhook (Sonarqube) hoặc demo nhanh
---

## Triển khai hạ tầng AWS bằng Terraform

### 🌟 Giới thiệu chung

Dự án này áp dụng các phương pháp và công cụ DevOps để triển khai một hạ tầng hoàn chỉnh, ổn định và linh hoạt trên AWS, sử dụng Infrastructure as Code (IaC) với **Terraform**. 

Mục tiêu chính là tự động hóa việc tạo dựng, quản lý và mở rộng cơ sở hạ tầng cloud một cách nhanh chóng, chính xác và tái sử dụng được.

---

### 🔧 Kiến trúc hạ tầng

![Architect vpc](/image/architect_vpc.png)

#### ☁️ VPC 2-tier Architecture
- Triển khai VPC theo mô hình 2-tier (Public, Private)
- NAT Gateway nằm ở public subnet, đảm bảo các Node trong private subnet có thể truy cập internet để lấy image và cập nhật gói cần thiết.
- Phân bố subnet trên nhiều Availability Zone để tăng khả năng chịu lỗi

#### ☸️ Amazon EKS Cluster
- EKS Cluster chạy trên VPC 2-tier, linh hoạt triển khai Node Group vào subnet phù hợp.
- Node Group sử dụng EC2, quản lý bằng Terraform, đảm bảo scalability
- IAM Roles và Policies được cấu hình theo best practices (bao gồm OIDC, IRSA)

#### 🔏 Security & Networking
- Security Group module hóa, hỗ trợ tạo rule một linh hoạt
- Route Table được tạo riêng biệt cho từng subnet và NAT Gateway
- Đảm bảo bảo mật cao và quản lý dễ dàng các luồng traffic trong nội bộ VPC

#### 🪣 s3 
- Sử dụng làm nơi lưu trữ backend cho Terraform (remote state)

#### 📘 DynamoBD 
- Dùng kết hợp với S3 để quản lý state locking cho Terraform
- Đảm bảo trạng thái hạ tầng không bị ghi đè khi có nhiều người thao tác cùng lúc

---

### 📦 Module Terraform được triển khai

Dự án áp dụng cấu trúc module rõ ràng để dễ bảo trì, tái sử dụng:

| Module             | Vai trò chính                                         |
|--------------------|-------------------------------------------------------|
| `DynamoDB`              | Quản lý state locking cho Terraform        |
| `EKS-TF`      | Quản lý toàn bộ phần triển khai Amazon EKS Cluster                            |
| `Jenkins-TF`      | Triển khai Jenkins server (trên EC2 hoặc ECS)     |
| `modules`   | Thư viện module tái sử dụng, chứa các module con: vpc, security-group, s3, nat gateway, route table          |
| `S3`              | Lưu trữ terraform remote backend (terraform.tfstate), phục vụ lưu trữ các log, chia sẻ tệp cấu hình giữa các môi trường  |

---

### 🚦 Các bước triển khai nhanh  Infrastructure as Code (IaC)

#### Khởi tạo
```bash
terraform init
```

#### Kiểm tra cấu hình 
```bash
terraform plan --file=<file-configure.tfvars>
```

#### 🚀 Triển khai hạ tầng
```bash
terraform apply --file=<file-configure.tfvars> -auto-approve
```

#### 🧹 Xóa hạ tầng 
```bash
terraform destroy --file=<file-configure.tfvars> 
```


## 🚀 Triển khai quy trình CI/CD

![Pipeline CI/CD](/image/DevOps_Pipeline.gif)

Quy trình CI/CD được thiết kế theo hướng **DevOps hiện đại**, sử dụng các công cụ mã nguồn mở và dịch vụ cloud để đảm bảo **tự động hóa toàn diện**, **an toàn**, và **dễ mở rộng**.

---

### ⭮️ Quy trình tổng quan

#### 1. 👨‍💻 **Developer Code & Push Git**

* Dev code và commit lên GitHub Repository ứng dụng
* Repository app có thể chứa code cho từng microservice (frontend, backend...)

#### 2. ⚙️ **Jenkins CI Pipeline**

* **Jenkins Master** được triển khai qua Terraform
* Sau mỗi push code:

  * `npm build` ứng dụng (nếu frontend/backend Node.js)
  * **SonarQube** phân tích chất lượng mã nguồn
  * **Snyk** quét lỗ hổng trong mã và dependency
  * **Docker build** ứng dụng
  * Push image lên **Docker Hub**
  * **Trivy** scan lỗ hổng trong Docker image

#### 3.  **CD với ArgoCD – GitOps**

* Jenkins cập nhật **YAML (image tag)** trong GitOps repo
* ArgoCD phát hiện thay đổi và tự động sync vào **EKS Cluster**
* Triển khai thông qua **Helm Chart** cho mỗi service

GitOps Repo: [https://github.com/RibunLoc/DevOps-task-management-gitops](https://github.com/RibunLoc/DevOps-task-management-gitops)

**GitOps folder structure:** Cấu trúc thư mục chuẩn `k8s-deployment/` cho từng thành phần:

  * `backend/` (ConfigMap, Deployment, Service, Ingress...)
  * `database/` (MySQL PVC, StorageClass, Service, Deployment...)
  * `frontend/` (Namespace, ConfigMap, Deployment, Service, Ingress...)
* **CI/CD integration:** Các file YAML đã được thiết kế tương thích với quy trình ArgoCD để tự động hóa triển khai lên EKS.

Điều này giúp toàn bộ quá trình triển khai ứng dụng web lên môi trường Kubernetes được thống nhất, bảo trì dễ dàng và đảm bảo tính mở rộng.

#### 4. ☸️ **EKS & Hạ tầng**

* EKS được triển khai qua Terraform
* Tích hợp:

  * **ALB** làm ingress public
  * **HashiCorp Vault** để inject secrets
  * **Longhorn** quản lý persistent volume

#### 5. 🔒 **Security & Secret Management**

* Vault được dùng để cung cấp các secrets (DB credentials, API key)
* Tránh hardcode vào YAML hay Docker image

#### 6. 📊 **Monitoring**

* **Prometheus** thu thập metrics từ hệ thống
* **Grafana** trực quan hóa và cảnh báo
* Hỗ trợ giám sát hiệu suất, alert và đánh giá hệ thống sau deploy

#### 7. 🌐 **Cloudflare + ALB**

* **Cloudflare** làm CDN và firewall bảo vệ layer 7
* Truy cập dashboard frontend qua domain public sau khi được route về ALB

---

### ✅ Lợi ích của pipeline

* **Tự động hóa hoàn toàn** từ code → build → deploy → monitor
* **An toàn bảo mật**: Scan mã & image + Vault quản lý secrets
* **Dễ mở rộng**: Hạ tầng chuẩn hóa bằng Terraform, Helm Chart, GitOps
* **Dễ rollback** và audit: ArgoCD lưu trạng thái version triển khai

---

### ✨ Triển khai Ứng dụng Web (Microservices)
Xin gửi lời cảm ơn chân thành đến đội ngũ bạn học đã hỗ trợ cung cấp mã nguồn ứng dụng web (bao gồm frontend và backend) để mình phục vụ cho quá trình triển khai và kiểm thử hệ thống trong dự án này.

![architect web application](/image/architect_web_application.png)

Hệ thống ứng dụng được thiết kế theo kiểu **microservices** với frontend tách rời và backend nhiều service giao tiếp qua **gRPC**:

* **Frontend:** React + Vite (SPA)
* **Backend Gateway:** Nginx reverse proxy + API Gateway (NestJS)
* **Microservices:**

  * User Service (gRPC + Database)
  * Auth Service (gRPC + JWT)
  * Task Service (gRPC + Database)

* **Dockerfile:** Được cấu hình riêng cho từng service (frontend/backend) để chuẩn hóa môi trường build.

Mỗi service backend kết nối với **MySQL riêng biệt**, triển khai trên Kubernetes.

#### 🔗 Liên kết Repository:

* Backend: [https://github.com/jiraops/octaltask-api](https://github.com/jiraops/octaltask-api)
* Frontend: [https://github.com/jiraops/octaltask](https://github.com/jiraops/octaltask)

---

