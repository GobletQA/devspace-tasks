#!/bin/bash

# Checks and installs a yarn global package if needed via yarn global add <package>
ds_yarn_global_check_install(){
  local CMD_CHECK="${@:2}"

  # Check and install the azure cli
  if [[ -x "$(command -v $CMD_CHECK 2>/dev/null)" ]]; then
    ds_message "The $1 package is already installed, skipping"
    return
  else
    ds_info "Installing $1 ..."
    yarn global add $1
    ds_success "$1 installation complete"
    return
  fi
}

# Uses npm to install node_modeuls for the wb server repo
ds_install_repo_deps(){
  if [[ -x "$(command -v yarn -v 2>/dev/null)" ]]; then
    ds_set_node_version
    ds_yarn_global_check_install "lerna" "lerna -v"
    ds_yarn_global_check_install "pm2" "pm2 -v"

    # Check the root directory for node_modules 
    cd $DS_ROOT_DIR
    if [[ ! -d "$DS_ROOT_DIR/node_modules" ]]; then
      ds_message "Running \"yarn setup\" for application ..."
      yarn setup
    else
      ds_message "Repo \"node_modules\" already installed, skipping"
    fi

  else
    ds_error "Yarn is not installed correctly.\n\t Please ensure \"yarn\" is installed before running this command"
    printf "\t See the Yarn website for more information:\n\t ${CYAN_COL}https://classic.yarnpkg.com/en/docs/install${NO_COL}\n"
    exit 1
  fi
}
