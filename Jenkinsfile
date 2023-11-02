pipeline {
	agent {
        label 'agent1'
    }
    stages {
        
        stage('SCM Checkout') {
            steps {
                git branch: 'master',
                    credentialsId: 'git',
                    url: 'git@github.com:hengwej/autobidderapp.git'
            }
        }
        
        
        stage('Install Project dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'  // Install server-side dependencies
                }
                dir('client') {
                    sh 'npm install'  // Install client-side dependencies
                }
                sh 'npm install jest supertest --save-dev'  // Install testing frameworks as dev dependencies
            }
        }
          
        stage('Run Unit Tests') {
            steps {
                dir('server') {
                    sh 'npm test'  // Run server-side tests
                }
                dir('client') {
                    sh 'npm test'  // Run client-side tests
                }
                
                junit '**/test-results.xml'  // Optionally, save test results for Jenkins visualization
            }
        }
    }
    
    post {
        success {
            echo 'Build succeeded!'
        }
    }
}
