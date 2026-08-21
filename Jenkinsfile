pipeline {
    agent any

    environment {
        IMAGE_NAME = 'mirzapryranda/hello-app'
        DEPLOY_HOST = 'deployer@10.10.0.3'
    }

    stages {
        stage('Clone Kode') {
            steps {
                echo 'Kode diambil dari GitHub (checkout otomatis).'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
            }
        }

        stage('Push ke Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                    sh 'docker logout'
                }
            }
        }

        stage('ACC Atasan') {
            steps {
                withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
                    sh '''PAYLOAD=$(printf '{"content": "⏳ %s (#%s) menunggu ACC atasan untuk deploy!"}' "$JOB_NAME" "$BUILD_NUMBER") && curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$DISCORD_URL"'''
                }
                input message: 'Deploy ke production?', ok: 'ACC 🚀', submitter: 'MirzaPryranda'
            }
        }

        stage('Deploy ke Server2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no $DEPLOY_HOST \
                  "docker pull $IMAGE_NAME:$BUILD_NUMBER && \
                   (docker stop hello-app || true) && \
                   (docker rm hello-app || true) && \
                   docker run -d --name hello-app --restart unless-stopped -p 3000:3000 $IMAGE_NAME:$BUILD_NUMBER"
                '''
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
                sh '''PAYLOAD=$(printf '{"content": "✅ Build SUCCESS: %s (#%s) - deploy berhasil!"}' "$JOB_NAME" "$BUILD_NUMBER") && curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$DISCORD_URL"'''
            }
        }
        failure {
            withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
                sh '''PAYLOAD=$(printf '{"content": "❌ Build FAILED: %s (#%s) - cek Jenkins!"}' "$JOB_NAME" "$BUILD_NUMBER") && curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$DISCORD_URL"'''
            }
        }
    }
}
