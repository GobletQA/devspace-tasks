#!/bin/bash

# Download the docker.dmg from the docker site
ds_mac_download_install_docker(){
  if [[ ! -f "$DS_DOCKER_DMG_PATH" ]]; then
    ds_info "Downloading docker.dmg ($DS_DOCKER_DMG_PATH) ..."
    # Ensure the temp directory exists before downloading docker
    mkdir -p $DS_TMP_DIR
    curl -# -L -o $DS_DOCKER_DMG_PATH $DS_DOCKER_DL_MAC_URL
  fi
}

# Mound the docker volume, and get it's name
ds_mac_mount_docker_volume(){
  if [[ ! -f "$DS_DOCKER_DMG_PATH" ]]; then
    ds_error "Error downloading docker-desktop.\n\t Please download and install manually from $DS_DOCKER_DL_MAC_URL"
    exit 1
  fi

  ds_message "Mounting docker.dmg ..."
  DS_DOCKER_VOL=`hdiutil mount $DS_DOCKER_DMG_PATH | tail -n1 | perl -nle '/(\/Volumes\/[^ ]+)/; print $1'`
  
  if [[ -z "$DS_DOCKER_VOL" ]]; then
    ds_error "Could not find the docker volume name!"
    exit 1
  else
    ds_message "Docker.dmg mounted ($DS_DOCKER_VOL)"
  fi
}

# Copy the contents of the docker volume app into the /Applications directory
ds_mac_copy_docker_app(){
  ds_message "Installing docker ..."
  local DS_DOCKER_PATH="$DS_DOCKER_VOL/$DS_DOCKER_APP"
  local DS_DOCKER_APP_PATH="$DS_APPLICATIONS/$DS_DOCKER_APP"

  yes | cp -ir $DS_DOCKER_PATH $DS_DOCKER_APP_PATH

  if [[ -d "$DS_DOCKER_APP_PATH" ]]; then
    ds_message "Starting docker desktop ..."
    open -a "$DS_DOCKER_APP_PATH"
  else
    ds_error "Could not find the docker app in the volume $DS_DOCKER_VOL!"
  fi
}

# Remove the mounted docker volume and downloded docker.dmg file
ds_mac_unmount_docker_volume(){
  ds_message "Cleaning up temp files ..."
  hdiutil unmount $DS_DOCKER_VOL -quiet
  rm $DS_DOCKER_DMG_PATH
}

# Checks if docker-for-desktop app is already installed
ds_check_docker_app(){

  # Check if docker already exists, and return if it does
  if [[ -x "$(command -v docker -v 2>/dev/null)" ]]; then
    ds_message "Docker already installed, skipping"
    return
  fi

  local DS_DOCKER_APP_PATH="$DS_APPLICATIONS/$DS_DOCKER_APP"
  if [[ -d "$DS_DOCKER_APP_PATH" ]]; then
    ds_info "Starting docker desktop ..."
    open -a "$DS_DOCKER_APP_PATH"
    return
  fi

  # Get the os to know which url to use
  local DS_OS_TYPE=$(uname)
  if [[ "$DS_OS_TYPE" == "Darwin" ]]; then
    # Download the docker dmg and install the docker desktop app
    ds_mac_download_install_docker
    ds_mac_mount_docker_volume
    ds_mac_copy_docker_app

    # Clean up after installing
    ds_mac_unmount_docker_volume
  else
    ds_error "Downloading docker-desktop is only supported on a Mac OS.\n\t Please download docker manually"
    exit 1
  fi
}
