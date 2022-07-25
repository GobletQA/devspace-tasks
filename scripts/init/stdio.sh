#!/bin/bash

NO_COL='\033[0m'
WHITE_COL='\033[1;37m'
GREEN_COL='\033[0;32m'
RED_COL='\033[0;31m'
CYAN_COL='\033[0;36m'

# Prints an error message to the terminal in the color white
ds_message(){
  printf "${WHITE_COL}[WOBO]${NO_COL} - $@\n"
}

# Prints a message to the terminal in all green
ds_message_green(){
  printf "${GREEN_COL}$@${NO_COL}\n"
}

# Prints an error message to the terminal in the color white
ds_info(){
  printf "${CYAN_COL}[WOBO]${NO_COL} - $@\n"
}

# Prints an success message to the terminal in the color green
ds_success(){
  printf "${GREEN_COL}[WOBO]${NO_COL} - $@\n"
}

# Prints an error message to the terminal in the color red
ds_error(){
  printf "\n${RED_COL}[WOBO] - $@${NO_COL}\n\n"
}

# Asks a question in the terminal
ds_question(){
  read -p "" INPUT;
  local ANSWER="${INPUT}"

  echo "$ANSWER"
}
