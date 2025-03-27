#!bin/bash

# Ref - https://nodejs.org/en/download
# Installing nvm && node 
sudo apt update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 19 -y
node -v 
nvm current
npm -v

# Ref - https://bluevps.com/blog/how-to-install-java-on-ubuntu
# Installing Java 
sudo apt update -y 
sudo apt install openjdk-17-jre -y
sudo apt install openjdk-17-jdk -y
java --version


# Ref - https://www.jenkins.io/doc/book/installing/linux/
# Installing Jenkins 
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install jenkins -y

# Enable Jenkins service
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins


# Ref - https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
# Installing docker 
#!/bin/bash
sudo apt update 
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce -y

# Cấp quyền sử dụng docker
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
sudo systemctl restart docker 
sudo chmod 777 /var/run/docker.sock

sudo docker --version
sudo systemctl status docker

# Ref - 
# run Docker container of sonarqube
#!/bin/bash
sudo docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Installing AWS CLI
#!/bin/bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip -y
unzip awscliv2.zip
sudo ./aws/install

# Ref - https://v1-31.docs.kubernetes.io/vi/docs/tasks/tools/install-kubectl/
# Installing kubectl 
#!/bin/bash
sudo apt update
sudo apt install curl -y
sudo curl -LO https://dl.k8s.io/release/v1.31.0/bin/linux/amd64/kubectl
sudo chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client

# Ref - https://developer.hashicorp.com/terraform/install?product_intent=terraform
# Installing Terraform
#!/bin/bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update -y 
sudo apt install terraform -y

# Ref - https://trivy.dev/latest/getting-started/installation/#__tabbed_2_1
# Installing Trivy
#!/bin/bash
sudo apt-get install wget gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy


