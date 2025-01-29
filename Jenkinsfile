pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
        DOCKERHUB_CREDS_USR = "${DOCKERHUB_CREDS_USR}"
	DOCKERHUB_CREDS_PSW = "${DOCKERHUB_CREDS_PSW}"
        IMAGE_NAME = 'nodejs-api'
        IMAGE_TAG = 'latest'
        DOCKER_IMAGE = "${DOCKERHUB_CREDS_USR}/${IMAGE_NAME}:${IMAGE_TAG}"
        EC2_NAME = 'nodejs-prod-server'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
            post {
                failure {
                    echo '❌ FAILURE: Pipeline failed during npm dependencies installation'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
            post {
                failure {
                    echo '❌ FAILURE: Pipeline failed during Docker image build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker compose up --build test --exit-code-from test'
            }
            post {
                failure {
                    echo '❌ FAILURE: Pipeline failed during test execution'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_IMAGE}
                    docker push ${DOCKER_IMAGE}
                    docker logout
                """
            }
            post {
                failure {
                    echo '❌ FAILURE: Pipeline failed while pushing to DockerHub'
                }
            }
        }

        stage('Create EC2 Instance') {
            steps {
                script {
                    // Initialize Terraform
                    sh 'terraform init'

                    // Apply Terraform configuration
                    sh """
                        terraform apply -auto-approve \
                        -var="instance_name=${EC2_NAME}"
                    """

                    // Get the public IP from Terraform output
                    def publicIp = sh(
                        script: 'terraform output -raw public_ip',
                        returnStdout: true
                    ).trim()

                    // Save the IP to a properties file for the next stage
                    sh "echo EC2_PUBLIC_IP=${publicIp} > ec2.properties"
                }
            }
            post {
                failure {
                    echo '❌ FAILURE: Failed to create EC2 instance'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    def ec2PropertiesFile = readFile(file: 'ec2.properties').trim()
                    def ec2Properties = ec2PropertiesFile.split('=')

                    if (ec2Properties[0].trim() == 'EC2_PUBLIC_IP' && ec2Properties.size() > 1) {
                        def ec2PublicIp = ec2Properties[1].trim()
                        echo "Public IP: ${ec2PublicIp}"

                        writeFile file: 'inventory.ini', text: """
                            [prod]
                            ${ec2PublicIp} ansible_user=ubuntu ansible_ssh_private_key_file=/var/jenkins_home/.ssh/awskeypair.pem
                        """

                        sh "chmod 600 /var/jenkins_home/.ssh/awskeypair.pem"

                        echo "Waiting for instance to initialize and SSH to be ready..."
                        def sshReady = false
                        def attempts = 0
                        while (!sshReady && attempts < 10) {
                            attempts++
                            echo "Attempt ${attempts}: Testing SSH connection..."
                            try {
                                sh """
                                    ssh -o StrictHostKeyChecking=no \
                                        -o ConnectTimeout=5 \
                                        -i /var/jenkins_home/.ssh/awskeypair.pem \
                                        ubuntu@${ec2PublicIp} 'echo SSH connection successful'
                                """
                                sshReady = true
                            } catch (Exception e) {
                                echo "SSH connection failed: ${e.getMessage()}"
				echo "Waiting 30 seconds..."
                                sleep 30
                            }
                        }

                        if (!sshReady) {
                            error "Failed to establish SSH connection after ${attempts} attempts"
                        }

                        sh """
                            ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini deploy.yml \
                                -e "DOCKERHUB_CREDS_USR=${DOCKERHUB_CREDS_USR}" \
                                -e "DOCKERHUB_CREDS_PSW=${DOCKERHUB_CREDS_PSW}" \
                                -e "IMAGE_NAME=${IMAGE_NAME}" \
                                -e "IMAGE_TAG=${IMAGE_TAG}" \
                                -vvv
                        """
                    } else {
                        error "❌ EC2_PUBLIC_IP not found or malformed in ec2.properties."
                    }
                }
            }
            post {
                failure {
                    echo '❌ FAILURE: Failed to deploy to EC2'
                }
            }
        }
    }

    post {
        success {
            echo '✅ SUCCESS: Pipeline completed successfully!'
        }
        failure {
            echo '❌ FAILURE: Pipeline failed - Check console output above for specific stage failure'
        }
    }
}
