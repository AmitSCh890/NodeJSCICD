Comprehensive CI/CD pipeline that automates the development of a Node.JS Application using modern DevOps tools.
It covers all aspects of application delivery, from building and testing the application to provisioning infrastructure and deploying services in production.

Pipeline is divided into several key stages:

Code Checkout: Fetch latest code from repo.

Build and Test: Run automated tests using Jest to validate application's
functionality

Dockerization: Create a docker image of Node.js application

Image Management: Push the build Docker image to Docker Hub.

Infrastructure Provisioning: Use Terraform to provision cloud infrastructure

Deployment: Deploy application using ansible, pulling Docker image and running it on a target server. 

Technologies Used:

1. Jenkins: Orchestrates the CI/CD pipeline with Jenkinsfile defining the stages
   
2. Terraform: Manages IaC for provisioning cloud resources.
   
3.  Docker: Creates portable and consistent environments for Node.js 
    applications
    
4. Ansible: Automates deployment task, such as setting up the  
   application environment and managing Docker containers.

5.  Node.js: Provides the runtime for the backend application

6.  MongoDB: Serves as database for Node.js application

Comprehensive CI/CD pipeline that automates the development of a Node.JS Application using modern DevOps tools.
It covers all aspects of application delivery, from building and testing the application to provisioning infrastructure and deploying services in production.

Pipeline is divided into several key stages:

Code Checkout: Fetch latest code from repo.

Build and Test: Run automated tests using Jest to validate application's
functionality

Dockerization: Create a docker image of Node.js application

Image Management: Push the build Docker image to Docker Hub.

Infrastructure Provisioning: Use Terraform to provision cloud infrastructure

Deployment: Deploy application using ansible, pulling Docker image and running it on a target server. 

Technologies Used:

1. Jenkins: Orchestrates the CI/CD pipeline with Jenkinsfile defining the stages
   
2. Terraform: Manages IaC for provisioning cloud resources.
   
3.  Docker: Creates portable and consistent environments for Node.js 
    applications
    
4. Ansible: Automates deployment task, such as setting up the  
   application environment and managing Docker containers.

5.  Node.js: Provides the runtime for the backend application

[6.  MongoDB: Serves as database for Node.js application]

NodeJSCICD Pipeline URL : - https://github.com/bharat2047/NodeJSCICD.git

