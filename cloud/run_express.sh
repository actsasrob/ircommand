#!/bin/bash

logfile=/tmp/express.out

export NVM_DIR="/home/aduser/.nvm"
[ -s "/home/aduser/.nvm/nvm.sh" ] && . "/home/aduser/.nvm/nvm.sh"

env >> $logfile
cd /home/aduser/ircommand/autom-dash/server_orm 
npm run server >> $logfile 2>&1
