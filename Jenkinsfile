pipeline {
    agent any

    environment {
        IMAGE = "666696661271.dkr.ecr.us-west-1.amazonaws.com/compliance-frontend:latest"
        REGION = "us-west-1"
        SERVICE = "frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh """
                docker build -t compliance-frontend .
                docker tag compliance-frontend:latest $IMAGE
                """
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region $REGION | \
                docker login --username AWS --password-stdin 666696661271.dkr.ecr.us-west-1.amazonaws.com
                
                docker push $IMAGE
                """
            }
        }

        stage('Deploy to Swarm') {
            steps {
                sh """
                docker service update --image $IMAGE $SERVICE || \
                docker service create \
                --name $SERVICE \
                --replicas 2 \
                --publish 80:80 \
                --network compliance-network \
                $IMAGE
                """
            }
        }
    }
}
