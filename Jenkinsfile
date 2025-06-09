pipeline {
  agent any

  environment {
    ANSIBLE_HOST_KEY_CHECKING = 'False'
    PATH = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
  }

  stages {
    stage('Clone Repository') {
      steps {
        checkout scm
      }
    }

    stage('Install Node.js Dependencies') {
      steps {
        echo 'Installing npm packages...'
        dir('app') {
          sh 'npm install'
        }
      }
    }

    stage('Run Ansible Playbook') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'ansible-ssh-key',
          keyFileVariable: 'SSH_KEY_FILE',
          usernameVariable: 'SSH_USER'
        )]) {
          sh '''
            echo "🔍 SSH key file exists: $(ls -la \"$SSH_KEY_FILE\")"
            echo "🔍 Testing SSH connectivity..."
            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_FILE" "$SSH_USER"@54.174.218.27 'echo Connection successful'

            chmod 600 "$SSH_KEY_FILE"
            ansible-playbook \
              -i ansible/inventory.ini ansible/playbook.yml \
              --private-key "$SSH_KEY_FILE" \
              -u "$SSH_USER" \
              -vvv
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ Build and deployment completed!'
    }
    failure {
      echo '❌ Build failed. Check above for errors.'
    }
  }
}

