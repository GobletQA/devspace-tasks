#!/bin/bash

# Checks and installs a brew package if needed via brew install <package>
ds_brew_check_install(){
  local CMD_CHECK="${@:2}"

  # Check and install the azure cli
  if [[ -x "$(command -v $CMD_CHECK 2>/dev/null)" ]]; then
    ds_message "The $1 package is already installed, skipping"
    return
  else
    ds_info "Installing $1 ..."
    brew install $1
    ds_success "$1 installation complete"
    return
  fi
}

# Check and install homebrew
ds_brew_check(){
  # Check for brew install
  if [[ -x "$(command -v brew 2>/dev/null)" ]]; then
    ds_message "Running brew update ..."
    brew update
  else
    #  Install brew
    ds_info "Installing homebrew ..."
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ds_success "homebrew installation complete"
  fi
}



# Checks and installs brew dependencies
ds_install_brew_deps(){
  # Check and install the azure cli
  # Disabling for now, but will be needed in the future
  # ds_brew_check_install "azure-cli" "az -v"
  # Check and install git
  ds_brew_check_install "git" "git --version"
}
