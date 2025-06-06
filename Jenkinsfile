pipeline {
  agent any

  environment {
    SSH_CREDENTIALS = 'ssh-chat-server'
    TARGET_HOST     = '54.174.218.27'
    APP_DIR         = '/opt/realtime-chat'
  }

  stages {
    stage('Checkout & Build') {
      steps {
        // Install dependencies locally to verify code builds (optional)
        sh 'cd app && npm install'
      }
    }

    stage('Package') {
      steps {
        // Create a tarball of "app/" (excluding node_modules to keep it small)
        sh 'tar --exclude="app/node_modules" -czf chat_app.tar.gz app'
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
          sh """
            scp -o StrictHostKeyChecking=no chat_app.tar.gz ubuntu@${TARGET_HOST}:/tmp/chat_app.tar.gz
            ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_HOST} << 'EOF'
              sudo systemctl stop realtime-chat
              sudo rm -rf ${APP_DIR}/app/*
              sudo tar -xzf /tmp/chat_app.tar.gz -C ${APP_DIR}
              sudo chown -R ubuntu:ubuntu ${APP_DIR}
              cd ${APP_DIR}/app
              npm install --production
              sudo systemctl start realtime-chat
            EOF
          """
        }
      }
    }
  }

  post {
    success {
      echo 'Deployment succeeded!'
    }
    failure {
      echo 'Deployment failed.'
    }
  }
}
