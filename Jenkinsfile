pipeline {
  agent any

  environment {
    ANSIBLE_HOST_KEY_CHECKING = 'False'
    PATH = "/usr/local/bin:/usr/bin:/bin:$PATH"
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
            chmod 600 "$SSH_KEY_FILE"
            ansible-playbook \
              -i ansible/inventory.ini ansible/playbook.yml \
              --private-key "$SSH_KEY_FILE" \
              -u "$SSH_USER"
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
