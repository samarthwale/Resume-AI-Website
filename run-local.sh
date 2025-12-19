#!/bin/bash
# This script installs the necessary dependencies and starts the development server.

echo "Installing project dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "Error: Failed to install dependencies. Please check for errors above."
  exit 1
fi

echo "Starting the development server..."
echo "Your app will be available at http://localhost:3000"
npm run dev

if [ $? -ne 0 ]; then
  echo "Error: Failed to start the development server."
  exit 1
fi
