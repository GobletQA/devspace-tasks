#!/bin/bash

# Checks and installs devspace and dependencies
ds_check_devspace_and_dependencies(){
  # Check and install kubectl
  ds_brew_check_install "kubectl" "kubectl version --client"
  # Check and install devspace
  ds_brew_check_install "devspace" "devspace -v"
}

# Sets up devspace for running the application in a kubernetes cluster
ds_setup_devspace(){
  devspace use namespace $DS_KUBE_NAMESPACE --kube-context $DS_KUBE_CONTEXT
}
