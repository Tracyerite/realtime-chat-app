pipeline {
  agent any

  environment {
    SSH_CREDENTIALS = 'realtime-chat-ssh'
    TARGET_HOST     = '54.174.218.27'
    APP_DIR         = '/opt/realtime-chat'
    SERVICE_NAME    = 'realtime-chat'
  }

  stages {
    stage('Checkout') {
      steps {
        // Pull down your repo into the workspace
        checkout scm
      }
    }

    stage('Build') {
      steps {
        // Install dependencies in the app folder
        dir('app') {
          sh 'npm install'
        }
      }
    }

    stage('Package') {
      steps {
        // Create a tarball of your app (excluding node_modules)
        sh 'tar --exclude="app/node_modules" -czf chat_app.tar.gz app'
      }
    }

    stage('Deploy') {
      steps {
        // Load your SSH key and push the artifact
        sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
          sh """
            scp -o StrictHostKeyChecking=no chat_app.tar.gz ubuntu@${TARGET_HOST}:/tmp/chat_app.tar.gz

            ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_HOST} << 'EOF'
              sudo systemctl stop ${SERVICE_NAME}
              sudo rm -rf ${APP_DIR}/*
              sudo tar -xzf /tmp/chat_app.tar.gz -C ${APP_DIR}
              sudo chown -R ubuntu:ubuntu ${APP_DIR}
              cd ${APP_DIR}
              npm install --production
              sudo systemctl start ${SERVICE_NAME}
            EOF
          """
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
