pipeline {
	agent any

	environment {
		NODE_VERSION = '22'
		APP_PATH = '/DUC2.NH/next-app'
		// Disable SSL verification for npm (if needed)
		NODE_TLS_REJECT_UNAUTHORIZED = '0'
	}

	stages {
		stage('Install Dependencies') {
			steps {
				nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
					// Use npm with strict-ssl=false for self-signed certificates
					sh 'npm config set strict-ssl false'
					sh 'npm ci'
				}
			}
		}

		stage('Build') {
			steps {
				nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
					withCredentials([file(credentialsId: 'next16-app-env', variable: 'ENV_FILE')]) {
						sh 'cp "$ENV_FILE" .env.local'
						sh 'npm run dev &'
						sh 'npm run build'
					}
				}
			}
		}

		stage('Prepare Standalone') {
			steps {
				script {
					// Copy static files to standalone directory
					sh 'cp -r .next/static .next/standalone/.next/'

					// Copy public folder if it exists
					sh 'cp -r public .next/standalone/ || true'
				}
			}
		}

		stage('Deploy to Server') {
			steps {
				script {
					sshPublisher(
						publishers: [
							sshPublisherDesc(
								configName: 'SSHOver976',
								transfers: [
									sshTransfer(
										sourceFiles: '.next/standalone/**',
										removePrefix: '.next/standalone',
										remoteDirectory: ${APP_PATH},
										execCommand: "pm2 start server.js"
									)
								],
								verbose: true
							)
						]
					)
				}
			}
		}
	}

	post {
		success {
			echo 'Deployment successful!'
		}
		failure {
			echo 'Deployment failed!'
		}
		always {
			cleanWs()
			sh 'pkill -f "npm run dev" || true'
		}
	}
}
