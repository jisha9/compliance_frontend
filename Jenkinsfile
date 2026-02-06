pipeline {
    agent any

    environment {
        AWS_REGION = "us-west-1"
        ECR_REPO = "666696661271.dkr.ecr.us-west-1.amazonaws.com/compliance-frontend"
        IMAGE_NAME = "compliance-frontend"
        SERVICE_NAME = "frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag $IMAGE_NAME:latest $ECR_REPO:latest'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin 666696661271.dkr.ecr.us-west-1.amazonaws.com
                '''
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $ECR_REPO:latest'
            }
        }

        stage('Deploy to Swarm') {
            steps {
                sh '''
                docker service update \
                --image $ECR_REPO:latest \
                --update-parallelism 1 \
                --update-delay 10s \
                $SERVICE_NAME \
                || docker service create \
                --name $SERVICE_NAME \
                --network compliance-network \
                --publish 80:80 \
                --replicas 2 \
                $ECR_REPO:latest
                '''
            }
        }
    }
}
