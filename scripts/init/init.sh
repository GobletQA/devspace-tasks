#! /usr/bin/env bash

#
# Checks and installs all needed software for running and application using devspace
# Location of the repo can be set using the $DS_ROOT_DIR env
#

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT

# Loads the environment needed to setup the host machine
ds_load_env(){

  # Ensure the root directory env is set
  if [[ -z "$DS_ROOT_DIR" ]]; then
    printf "\033[0;31m[DS-SETUP]\033[0m - ENV \"DS_ROOT_DIR\" must point to a directory\n"
    exit 1
  fi

  # Ensure the temp install directory exists
  export DS_TMP_DIR=$DS_ROOT_DIR/.tmp

  # Build the path to the scripts directory
  export DS_INIT_DIR="$DS_ROOT_DIR/scripts/init"

  # Load the envs from the .env file
  set -o allexport
  . $DS_INIT_DIR/.env >/dev/null 2>&1
  set +o allexport

  # Add the helper files
  . $DS_INIT_DIR/brew.sh
  . $DS_INIT_DIR/docker.sh
  . $DS_INIT_DIR/devspace.sh
  . $DS_INIT_DIR/node.sh
  . $DS_INIT_DIR/yarn.sh
  . $DS_INIT_DIR/stdio.sh

}

# Setups of the host machine for application development
ds_setup(){

  # Make sure we are in the applications root directory
  cd $DS_ROOT_DIR

  # Determin the setup type
  local SETUP_TYPE=$1

  if [[ "$SETUP_TYPE" ]]; then
    ds_message "Setup type is $SETUP_TYPE"
  else
    ds_message "Setup type is all"
  fi

  # Setup install brew and deps
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "brew" ]]; then
    ds_message "Checking brew installation ..."
    # Ensure brew exisists and is up to date
    ds_brew_check
    # Install all deps needed for the WB applications
    ds_install_brew_deps
  fi

  # # Setup and install docker desktop
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "docker" ]]; then
    ds_message "Checking docker configuration ..."
    ds_check_docker_app
  fi

  # Setup and install nvm plus node
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "node" ]]; then
    ds_message "Checking nvm, node configuration ..."
    ds_setup_nvm_node
    # Setup .npmrc with git token
    ds_message "Checking .npmrc file configuration ..."
    ds_setup_npmrc
  fi

  # Install and configure the repo dependecies
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "repo" ]]; then
    ds_message "Checking repo dependecies are installed ..."
    # Install yarn and yarn dependecies
    ds_install_repo_deps
  fi

  # Install and configure devspace
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "devspace" ]]; then
    ds_message "Checking devspace setup ..."
    # Ensures devspace is installed
    ds_check_devspace_and_dependencies
    # Setup devspace for the host machine
    ds_setup_devspace
  fi

  echo ""
  ds_message_green "[DS-SETUP] ------------------------------------ [DS-SETUP]"
  echo "          Application setup complete!"
  ds_message_green "[DS-SETUP] ------------------------------------ [DS-SETUP]"
  echo ""

}

# Load the envs and helper scripts
ds_load_env "$@"

# Run setup of application
ds_setup "$@"

# # Cleanup after the script is done
unset DS_TMP_DIR
unset DS_INIT_DIR
unset DS_GIT_TOKEN
