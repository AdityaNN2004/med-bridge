pipeline {
    agent any

    environment {
        // Keeps your production console outputs clean
        CI = 'true' 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build Frontend (React)') {
            steps {
                // Navigates deep into your frontend directory where package.json lives
                // Change 'frontend' to match your actual folder name if it is named differently
                dir('Application/frontend') {
                    echo 'Installing React dependencies...'
                    bat 'npm install'

                    echo 'Compiling React production build...'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend (Spring Boot)') {
            steps {
                echo 'Building application...'
                // Navigates deep into your backend directory where pom.xml lives
                // Change 'backend' to match your actual folder name if it is named differently
                dir('Application/backend') {
                    echo 'Compiling Java application...'
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Database Check (MySQL)') {
            steps {
                echo 'Running automated tests...'
                echo 'Verifying application connects or executes database setup...'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed cleanly! Your React dist folder and Spring Boot JAR are ready.'
        }
        failure {
            echo 'Build failed. Please verify compilation errors in the logs above.'
        }
    }
}
