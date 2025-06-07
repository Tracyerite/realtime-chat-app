pipeline {
  // No global agent: specify agents at each stage
  agent none

  environment {
    SSH_CREDENTIALS = 'realtime-chat-ssh'
    TARGET_HOST     = '54.174.218.27'
    APP_DIR         = '/opt/realtime-chat'
    SERVICE_NAME    = 'realtime-chat'
  }

  stages {
    stage('Checkout') {
      agent any
      steps {
        // Pull down your Git repository
        checkout scm
      }
    }

    stage('Build') {
      agent any
      steps {
        // Install dependencies in the app folder
        dir('app') {
          sh 'npm install'
        }
      }
    }

    stage('Package') {
      agent any
      steps {
        // Create a tarball of the app (excluding node_modules)
        sh 'tar --exclude="app/node_modules" -czf chat_app.tar.gz app'
      }
    }

    stage('Deploy') {
      agent any
      steps {
        // Use SSH credentials to deploy artifact to EC2
        sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
          sh '''
            # Copy the tarball to the remote server
            scp -o StrictHostKeyChecking=no chat_app.tar.gz ubuntu@${TARGET_HOST}:/tmp/chat_app.tar.gz

            # SSH into the server and perform deploy steps
            ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_HOST} << 'EOF'
              set -eux
              sudo systemctl stop ${SERVICE_NAME}
              sudo rm -rf ${APP_DIR}/*
              sudo tar -xzf /tmp/chat_app.tar.gz -C ${APP_DIR}
              sudo chown -R ubuntu:ubuntu ${APP_DIR}
              cd ${APP_DIR}
              npm install --production
              sudo systemctl start ${SERVICE_NAME}
            EOF
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deployment succeeded!'
    }
    failure {
      echo '❌ Deployment failed.'
    }
  }
}
