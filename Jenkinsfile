pipeline {
    agent any

    environment {
        IMAGE_NAME = "compliance-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Run Frontend') {
            steps {
                sh '''
                    docker rm -f frontend || true
                    docker run -d -p 80:80 --name frontend $IMAGE_NAME
                '''
            }
        }
    }
}
