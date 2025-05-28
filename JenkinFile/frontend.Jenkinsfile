pipeline {
    agent any

    // Cung cấp thông tin cân thiết cho pipeline
    parameters {
        string(name: 'TAG_NAME', defaultValue: 'v1.0', description: 'Đây là tag mà bạn muốn gán chi image Docker')
        string(name: 'NAME_DOCKER', defaultValue: 'ribun', description: 'Tên của docker mà bạn sử dụng để lưu trữ image ')
        string(name: 'NAME_IMAGE', defaultValue: 'TaskManagement_Frontend', description: 'Tên của image Docker mà bạn muốn tạo')
    }
    // Khai báo các biến môi trường cần thiết
    environment {
        SCANNER_HOME = tool 'sonar-scanner' // Đường dẫn đến SonarQube Scanner
    }
    // Khai báo các công cụ cần thiết cho pipeline
    tools {
        nodejs 'node22'
    }
    stages {
        // Kiểm tra mã nguồn
        stage('Checkout from Git') {
            steps {
                git branch: 'develop', url: 'https://github.com/RibunLoc/DevOps-work-management-web-platform.git'
            }
        }
        // Thiết lập biến môi trường cần thiết cho quá trình build
        stage('SET UP ENVIROMENT') {
            REPO_IMAGE  = "${params.NAME_DOCKER}/${params.NAME_IMAGE}:${params.TAG_NAME}"
        }
        // Cài đặt các dependecies cần thieert cho quá trình build
        stage('Install Dependencies') {
            steps {
                script{
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
        // Phân tích mã nguồn bằng SonarQube
        stage('Scan Code with SonarQube') {
            steps {
                script {
                    withSonarQubeEnv('sonar-server') {
                        script {
                            sh """
                                ${SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectName="TaskManagement_Frontend_Scan_Code" \
                                -Dsonar.projectKey="ribunloc_taskmanagement_frontend" \
                                -Dsonar.sources=.
                            """
                        }
                    }
                }
            }
        }
        // Dùng snyk để quét mã nguồn
        stage('Snyk Scan Source Code') {
            steps {
                script {
                    withCredentials([
                            string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')
                    ]) {
                        sh '''
                            mkdir -p reports/snyk
                            snyk auth $SNYK_TOKEN
                            snyk test . --all-projects \
                            --severity-threshold=medium \
                            --json > reports/snyk/snyk-report.json || true
                            snyk monitor --all-projects
                        '''
                    }
                }
            }
        }
        // Thực hiện build và đóng gói ứng dụng thành Docker image
        stage('Docker Build') {
            steps{
                script{
                    withDockerRegistry(
                        credentialsId: 'docker', toolName: 'docker'
                    ) {
                        sh "docker build -t ${params.NAME_IMAGE} ."
                    }
                }
            }
        }
        // Dùng trivy scan image để quét lỗ hỗng bảo mật trong container
        stage('Trivy Scan Image') {
            steps {
                script {
                    sh """
                        mkdir -p ../reports/trivy
                        trivy image --severity MEDIUM,HIGH,CRITICAL \\
                        --exit-code 1 \\
                        --format json \\
                        --output reports/trivy/trivy-report.json \\
                        "${params.NAME_IMAGE}" || true
                    """
                }
            }
        }
        // Đẩy repo image lên kho chứa Docker
        stage('Push Image to Docker Registry') {
            steps {
                script {
                    sh """
                        docker tag ${params.NAME_IMAGE} ${REPO_IMAGE}
                        docker push ${REPO_IMAGE}
                    """
                }
            }
        }
        // Xóa container cũ nếu có
        stage('Remove container') {
            steps {
                sh "docker stop ${params.NAME_IMAGE} | true"
                sh "docker rm ${params.NAME_IMAGE} | true"
            }
        }
        // Chạy container mới từ image đã đẩy lên kho chứa
        stage('Run container'){
            steps{
                withCredentials([
                    file(credentialsId: 'docker-config', variable: "DOCKER_CONFIG")
                ]) {
                    sh """
                        docker run -d --name ${params.NAME_IMAGE} \\
                        --env-file \$DOCKER_CONFIG \\
                        -p 3000:80 ${REPO_IMAGE}
                    """
                }
            }
        }
    }
    post {
        always {
            archiverArtifacts artifacts: 'reports/**', fingerprint: true
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}