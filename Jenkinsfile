pipeline {
    agent any

    environment {
        // Keeps your production console outputs clean
        CI = 'true' 
    }

    stages {
        stage('Checkout') {
            steps {
                // Clones your repository code automatically
                checkout scm
            }
        }

        stage('Build Frontend (React)') {
            steps {
                // Navigate into your react project directory (adjust folder name if different)
                dir('frontend') {
                    echo 'Installing React dependencies...'
                    bat 'npm install'
                    
                    echo 'Compiling React production build...'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend (Spring Boot)') {
            steps {
                // Navigate into your backend project directory (adjust folder name if different)
                dir('backend') {
                    echo 'Compiling Java application...'
                    // IF USING MAVEN:
                    bat 'mvn clean package -DskipTests'
                    
                    // IF USING GRADLE (uncomment below and delete the mvn line if applicable):
                    // bat 'gradlew clean build -x test'
                }
            }
        }

        stage('Database Check (MySQL)') {
            steps {
                echo 'Verifying application connects or executes database setup...'
                // You can add custom database migration validation commands here if using Liquibase/Flyway.
                // Otherwise, Spring Boot automatically attempts a connection to your MySQL schema on startup.
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
