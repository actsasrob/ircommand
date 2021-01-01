#!/bin/bash

set -x
THEUSER="${1}"
THEENCRYPTION_KEY_ARN="${2}"
THEENCRYPTED_DB_PASSWORD="${3}"
THEAPP="autom-dash"
THEAPPINSTALL_DIR="/home/${THEUSER}"
THEGITREPO="https://github.com/actsasrob/ircommand.git"
THEGIT_BRANCH="master"
THEPROJ_PARENT_DIR_NAME="ircommand"
THEPROJ_PARENT_PATH="${THEAPPINSTALL_DIR}/${THEPROJ_PARENT_DIR_NAME}"
THEPROJECT_DIR="${THEPROJ_PARENT_PATH}/${THEAPP}"
THENVM_VERSION="0.35.3"
THENODEJS_VERSION="12.18.4"
THEPACKAGE_DEPS="git postgresql-contrib postgresql-client"
THECONFIG_FILE="${THEAPPINSTALL_DIR}/.env"
THEDB_NAME="automdash"
THEDB_HOST="${4}"
THEDB_PORT=5432
THEPGPASS_FILE="${THEAPPINSTALL_DIR}/.pgpass"


if [ "$EUID" -ne 0 ]; then
    echo "error: this script must be run as root. exiting..."
    exit 1
fi

current_dir=$(pwd)

# https://kb.objectrocket.com/postgresql/how-to-install-and-set-up-postgresql-on-a-raspberry-pi-part-2-1165
# pg_lsclusters
# pg_ctlcluster 11 main start
# /etc/postgresql/11/main/postgresql.conf
#/etc/postgresql/11/main/pg_hba.conf

echo "Install dependent packages..."
apt-get update > /dev/null 2>&1
for pkg in $(echo ${THEPACKAGE_DEPS}); do
   dpkg -s $pkg | grep Status | grep -i installed > /dev/null 2>&1
   if [ "$?" -ne 0 ]; then
      echo "info: installing ${pkg}..."
      apt-get install -y "$pkg" > /dev/null
      if [ "$?" -ne 0 ]; then
         echo "error: failed to install package ${pkg}. exiting..."
         exit 1
      fi
   else
      echo "info: $pkg is installed"
   fi
done

echo
echo "info: checking if unprivileged user ${THEUSER} exists..."
grep $THEUSER /etc/passwd > /dev/null 2>&1
if [ "$?" -ne 0 ]; then
   echo "info: creating unprivileged user ${THEUSER}..."
   useradd --comment "${THEAPP} user" --home-dir /home/$THEUSER --create-home $THEUSER
else
   echo "info: unprivileged user ${THEUSER} already exists. skipping create."
fi

echo
echo "info: checking if ${THEAPP} config file ${THECONFIG_FILE} exists..."
if [ ! -f "$THECONFIG_FILE" ]; then
   echo "info: config file does not exist. creating..."
   echo "DBUSER=${THEUSER}" >> $THECONFIG_FILE
   if [ ! -f "$THECONFIG_FILE" ]; then
      echo "error: failed to create config file ${THECONFIG_FILE}. exiting"
      exit 1
   else
      echo "info: config file created"
   fi
fi

echo
echo "info: checking if node.js version manager (nvm) is installed..."
if [ ! -d $HEAPPINSTAll_DIR/.nvm ]; then
   echo "info: installing nvm..."
   sudo -H -u $THEUSER bash -c "curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${THENVM_VERSION}/install.sh | bash"
   cat << EOT >> ${THEAPPINSTALL_DIR}/.bashrc
export NVM_DIR="${THEAPPINSTALL_DIR}/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
EOT
   sudo -H -u $THEUSER bash -i -c "nvm install $THENODEJS_VERSION"
   sudo -H -u $THEUSER bash -i -c "nvm alias default $THENODEJS_VERSION"

   if [ ! -d ${THEAPPINSTALL_DIR}/.nvm/versions/node/v${THENODEJS_VERSION} ]; then
      echo "error: failed to install nvm and node.js version $THENODEJS_VERSION. exiting..."
      exit 1
   fi
else
   echo "info: nvm is installed"
fi

echo
echo "info: checking if ${THEAPP} application has been installed at ${THEPROJECT_DIR}..."
if [ ! -d "${THEPROJ_PARENT_PATH}" ]; then
   echo "info: installing ${THE_APP} application..."
   #sudo -H -u $THEUSER bash -c "mkdir -p ${THEAPP_INSTALL_DIR}"
   sudo -i -H -u $THEUSER bash -i -c "cd ${THEAPPINSTALL_DIR}; git clone $THEGITREPO ${THEPROJ_PARENT_DIR_NAME}; cd $THEPROJ_PARENT_PATH; git checkout $THEGIT_BRANCH"
   cd $current_dir
   if [ ! -d "${THEPROJECT_DIR}" ]; then
      echo "error: failed to install ${THEAPP} application. exiting..."
      exit 1
   fi
else
   echo "info: ${THEAPP} application installed at ${THEPROJECT_DIR}."
fi

echo
echo "info: changing ownership to ${THEUSER} on ${THEAPPINSTALL_DIR}..."
chown -R $THEUSER: $THEAPPINSTALL_DIR

echo
echo "info: installing nginx"
apt-get install -y nginx

cd $current_dir

