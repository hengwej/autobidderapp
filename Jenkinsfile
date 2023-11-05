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

        stage('Install dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'  // Run server-side tests
                }
                dir('client') {
                    sh 'npm install'  // Run client-side tests
                }
                
                junit '**/test-results.xml'  // Optionally, save test results for Jenkins visualization
            }
        }

        stage('OWASP Dependency-Check Vulnerabilities') {
        steps {
            dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'

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
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            echo 'Success!'
        }
    }
}
