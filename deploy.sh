
#!/bin/bash
set -e

# Configuration
REMOTE_USER="rocky"
REMOTE_HOST="ai-tools-dev-1.inst.nlp-dev.eu-west-1.bdf-cloud.iqvia.net"
SSH_KEY="~/.ssh/express2.pem"
REMOTE_APP_DIR="~/sentiment-analysis-app-lovable"
CONTAINER_NAME="sentiment-analysis-frontend-lovable"

echo "=== Sentiment Analysis App Deployment ==="

# Step 1: SSH to server and clean up existing containers and directory
echo "Cleaning up existing deployment..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
  # Stop and remove container if it exists
  if docker ps -a | grep -q $CONTAINER_NAME; then
    echo 'Stopping and removing existing container...'
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
  fi

  # Remove image if it exists
  if docker images | grep -q sentiment-analysis-app-lovable; then
    echo 'Removing existing image...'
    docker rmi \$(docker images | grep sentiment-analysis-app-lovable | awk '{print \$3}') || true
  fi

  # Remove directory if it exists
  if [ -d $REMOTE_APP_DIR ]; then
    echo 'Removing existing directory...'
    rm -rf $REMOTE_APP_DIR
  fi

  # Create fresh directory
  echo 'Creating fresh directory...'
  mkdir -p $REMOTE_APP_DIR
"

echo "Clean up completed."

# Step 2: Copy necessary files to remote server
echo "Copying files to remote server..."
scp -i $SSH_KEY \
  Dockerfile \
  docker-compose.yml \
  nginx.conf \
  .dockerignore \
  package.json \
  package-lock.json \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR/

# Create and copy src directory
echo "Copying source code..."
scp -r -i $SSH_KEY src $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR/

# Copy other necessary files for building
echo "Copying config files..."
scp -i $SSH_KEY \
  tsconfig.json \
  tsconfig.app.json \
  tsconfig.node.json \
  vite.config.ts \
  tailwind.config.ts \
  postcss.config.js \
  index.html \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR/

# Copy public directory if it exists
if [ -d "public" ]; then
  echo "Copying public directory..."
  scp -r -i $SSH_KEY public $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR/
fi

# Step 3: Start the application on the remote server
echo "Starting the application..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
  cd $REMOTE_APP_DIR
  docker-compose up --build -d
"

echo "=== Deployment completed successfully ==="
echo "The application is now running at http://$REMOTE_HOST:3002"
