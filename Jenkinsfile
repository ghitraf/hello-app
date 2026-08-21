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
            echo '✅ BUILD & DEPLOY BERHASIL!'
        }
        failure {
            echo '❌ BUILD GAGAL! Cek Console Output!'
        }
    }
}
