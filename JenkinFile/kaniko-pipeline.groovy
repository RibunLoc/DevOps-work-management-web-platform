pipeline {
    agent {
        kubernetes {
            defaultContainer 'node'
            yaml """
apiVersion: v1
kind: Pod
spec:
    restartPolicy: Never
    volumes:
      - name: docker-config
        secret:
          secretName: regcred
          items:
            - key: .dockerconfigjson
              path: config.json
    containers:
      - name: node
        image: node:20-bookworm
        command: ["cat"]
        tty: true
      - name: kaniko
        image: gcr.io/kaniko-project/executor:v1.23.2
        command: ["/busybox/sh", "-c"]
        args: ["sleep 365d"]
        tty: true
        volumeMounts:
          - name: docker-config
            mountPath: /kaniko/.docker/
            readOnly: true
"""
        }
    }

    environment {
        IMAGE_REPO = "ribun/my-app-kaniko"
        CACHE_REPO = "ribun/kaniko-cache"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Image') {
            steps {
                container('kaniko') {
                    sh '''
                      /kaniko/executor \
                        --context=dir://$WORKSPACE/app/octaltask-api/api-gateway \
                        --dockerfile=$WORKSPACE/app/octaltask-api/api-gateway/Dockerfile \
                        --destination=$IMAGE_REPO:latest \
                        --cache=true \
                        --cache-repo=$CACHE_REPO
                    '''
                }
            }
        }
    }
}
