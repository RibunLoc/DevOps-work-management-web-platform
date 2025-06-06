pipeline {
    agent any

    // Cung cấp thông tin cần thiết cho pipeline
    parameters {
        string(name: 'NAME_IMAGE', defaultValue: '', description: 'Tên thư mục service (ví dụ: auth-service)')
        string(name: 'TAG_NAME', defaultValue: 'v1.0', description: 'Tag image Docker')
        string(name: 'NAME_DOCKER', defaultValue: 'ribun', description: 'Docker username hoặc registry repo')
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
                checkout scm
            }
        }
        // Thiết lập biến môi trường cần thiết cho quá trình build
        stage('SET UP ENVIRONMENT') {
            script {
                REPO_IMAGE = "${params.NAME_DOCKER}/${params.NAME_IMAGE}:${params.TAG_NAME}"
            }
        }
        // 
        stage('Detect Changed Folder') {
            steps {
                script {
                    sh 'git fetch origin'

                    def branch = env.BRANCH_NAME ?: 'develop'
                    def base = sh(script: "git merge-base HEAD origin/${branch}", returnStdout: true).trim()
                    def changes = sh(script: "git diff --name-only ${base}..HEAD", returnStdout: true).trim().split("\n")

                    def folders = ['api-gateway', 'auth-service', 'task-service', 'user-service', 'file-service']
                    def target = folders.find { svc ->
                        changes.any { it.startsWith("app/octaltask-api/${svc}/") }
                    }

                    if (!target) {
                        echo "Không phát hiện service thay đổi. Kết thúc."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    echo "➡️ Build service: ${target}"
                    env.TARGET_SERVICE = target
                }
            }
        }
        // Cài đặt các dependencies cần thiết cho quá trình build
        stage('Install Dependencies') {
            when  {
                expression { return env.TARGET_SERVICE }
            }
            steps {
                dir("app/octaltask-api/${env.TARGET_SERVICE}") {
                    script {
                        sh '''
                            npm install
                            npm run build
                        '''
                    }
                }
            }
        }
        // Thực hiện build và đóng gói ứng dụng thành Docker image
        stage('Docker Build') {
            when  {
                expression { return env.TARGET_SERVICE }
            }
            steps{
                dir("app/octaltask-api/${env.TARGET_SERVICE}") {
                    script {
                        sh "docker build -t ${params.NAME_IMAGE} ."
                    }
                }
            }
        }
        // Đẩy repo image lên kho chứa Docker
        stage('Push Image to Docker Registry') {
            when  {
                expression { return env.TARGET_SERVICE }
            }
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh """
                            docker tag ${params.NAME_IMAGE} ${REPO_IMAGE}
                            docker push ${REPO_IMAGE}
                        """
                    }
                }
            }
        }
    }
}