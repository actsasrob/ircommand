#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

set -x

#nvm use 12.18.4
nvm use 12.22.11
old_cwd=$(pwd)

cd autom-dash 

cd server_orm
npm install

nohup npm run server &
#nohup npm start &

cd ..

npm install

pwd
cat proxy.json
#ng serve --port 4201 --open
npm start

cd $old_pwd
