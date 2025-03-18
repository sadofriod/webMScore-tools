# GitHub Actions Workflow

This directory contains GitHub Actions workflow configurations for automated deployment of the WebMScore Converter project.

## Required Secrets

To make the deployment work, you need to add the following secrets in your GitHub repository:

1. `SSH_PRIVATE_KEY`: Your SSH private key for server authentication
2. `SERVER_USER`: Username for SSH login to your server
3. `SERVER_HOST`: Hostname or IP address of your deployment server
4. `DEPLOY_PATH`: Target directory path on the server where files should be deployed (e.g., /var/www/webmscore)

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets" > "Actions"
3. Click "New repository secret"
4. Add each of the required secrets listed above

## Workflow Details

The deployment workflow will:
- Run when changes are pushed to the master branch
- Deploy the files to your server via SSH
- Configure and restart the nginx web server

## Nginx Configuration

The deployment includes an nginx configuration file that will be:
1. Copied to your server
2. Linked to the nginx sites-available directory
3. Enabled via a symlink in sites-enabled
4. Tested and applied by restarting nginx

Make sure your server user has sudo privileges to manage nginx, or customize the restart script accordingly.

## Customization

Adjust the workflow file as needed to:
- Add build steps if required
- Modify excluded files during deployment
- Change the server restart commands based on your hosting setup

For the nginx configuration, update the `server_name` directive with your actual domain name, and uncomment the HTTPS section when you have SSL certificates.
