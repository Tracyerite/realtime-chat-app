stage('Run Ansible Playbook') {
  steps {
    withCredentials([sshUserPrivateKey(
      credentialsId: 'ansible-ssh-key',
      keyFileVariable: 'SSH_KEY_FILE',
      usernameVariable: 'SSH_USER'
    )]) {
      sh '''
        echo "🔍 SSH key file location:"
        ls -la "$SSH_KEY_FILE"

        echo "🔍 Attempting SSH connection test:"
        ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_FILE" "$SSH_USER"@54.174.218.27 'echo Connection successful'

        echo "🔍 Now running Ansible..."
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
