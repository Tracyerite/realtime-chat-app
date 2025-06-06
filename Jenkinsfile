pipeline {
  agent any

  environment {
    // The ID must exactly match the SSH‐key credential you created in Jenkins
    SSH_CREDENTIALS = 'realtime-chat-ssh'
    TARGET_HOST     = '54.174.218.27'
    APP_DIR         = '/opt/realtime-chat'
  }

  stages {
    stage('Checkout & Build') {
      steps {
        // Run npm install to verify/build locally in the Jenkins agent
        sh 'cd app && npm install'
      }
    }

    stage('Package') {
      steps {
        // Create a tarball of the "app" folder (excluding node_modules)
        sh 'tar --exclude="app/node_modules" -czf chat_app.tar.gz app'
      }
    }

    stage('Deploy to EC2') {
      steps {
        // Use sshagent with the credential ID from above
        sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
          sh """
            # Copy the tarball to /tmp on the chat server
            scp -o StrictHostKeyChecking=no chat_app.tar.gz ubuntu@${TARGET_HOST}:/tmp/chat_app.tar.gz

            # SSH into the server and unpack, reinstall, and restart
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
