#!/usr/bin/env bash
set -e

# Import wrapper functions for common Cloudformation functionality
. $(dirname $0)/functions.sh

# Ensure all args provided
if [ "$#" != "3" ]; then
  echo "Must provide three arguments: [1: STACK_NAME, 2: S3_BUCKET_NAME, and 3: CONFIG_FILE]"
  exit 1
fi

# First argument is the Cloudformation stack name
STACK_NAME=$1

# Second argument is the deployment bucket name
S3_BUCKET_NAME=$2

# Third argument is our config file
CONFIG_FILE=$3

# Validate Templates
echo "Validating templates..."
validate ./cloudformation/\* # you have to escape "*" to perform a directory loop

# Package up Cloudformation Templates and Parameters for Deployment
PKG_TEMPLATE=$(package ./cloudformation/votify-all.yml $S3_BUCKET_NAME $STACK_NAME)

# Deploy Stack
create_or_update_stack $STACK_NAME $PKG_TEMPLATE $CONFIG_FILE

cleanup
