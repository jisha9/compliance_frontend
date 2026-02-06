pipeline {
    agent any

    environment {
        REGION = "us-west-1"
        ACCOUNT_ID = "666696661271"
        IMAGE = "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/compliance-frontend:latest"
        SERVICE = "frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t compliance-frontend .
                docker tag compliance-frontend:latest $IMAGE
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region $REGION | \
                docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
                """
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push $IMAGE"
            }
        }

        stage('Deploy to Swarm') {
            steps {
                sh """
                docker service update \
                --with-registry-auth \
                --image $IMAGE \
                $SERVICE || \
                
                docker service create \
                --with-registry-auth \
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
