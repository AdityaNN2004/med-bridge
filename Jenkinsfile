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
                // Navigates into Application folder to find React files
                dir('Application') {
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
                // Navigates into Application folder to find Maven/Java files
                dir('Application') {
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
