pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Output Containers') {
            steps {
                echo 'Building latest docker containers...'
                sh "${DOCKER_COMPOSE} build"
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploying application using Docker Compose...'
                sh "${DOCKER_COMPOSE} up -d"
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished execution!'
        }
        success {
            echo 'Deployment was successful.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
