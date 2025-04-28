#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Start the development server
echo "Starting development server..."
npm start 