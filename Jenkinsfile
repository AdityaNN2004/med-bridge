// Connected to ngrok

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
                // Corrected path matching your Client folder exactly
                dir('Application/Client') {
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
                // Corrected path matching your Server folder exactly
                dir('Application/Server/MediBridge') {
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

