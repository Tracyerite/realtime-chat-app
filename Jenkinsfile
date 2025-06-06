pipeline {
  agent any

  stages {
    stage('Build & Test') {
      steps {
        dir('app') {
          sh 'npm install'
          // If you have tests: sh 'npm test'
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        // Package everything into a tar.gz (excluding node_modules)
        sh 'tar --exclude="node/node_modules" -czf chat_app.tar.gz app'

        // Copy to the EC2 and restart the service
        sshagent(credentials: ['ssh-chat-server']) {
          sh """
            scp -o StrictHostKeyChecking=no chat_app.tar.gz ubuntu@${TARGET_HOST}:/tmp/chat_app.tar.gz
            ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_HOST} << 'EOF'
              sudo systemctl stop realtime-chat
              sudo rm -rf /opt/realtime-chat/app/*
              sudo tar -xzf /tmp/chat_app.tar.gz -C /opt/realtime-chat
              cd /opt/realtime-chat/app
              sudo npm install --production
              sudo systemctl start realtime-chat
            EOF
          """
        }
      }
    }
  }
}
