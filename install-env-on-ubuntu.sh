#!/usr/bin/env bash

BLUE_BOLD="\e[1;34m"
RESET="\e[0m"
function title() { echo -e "${BLUE_BOLD}# $1 ${RESET}"; }

title "Importing microsoft key into apt..."
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

title "Registering microsoft repository ..."
curl https://packages.microsoft.com/config/ubuntu/16.04/mssql-server.list | sudo tee /etc/apt/sources.list.d/mssql-server.list
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list

title "Installing SQL Server and its tools ..."
sudo apt update
sudo apt install mssql-server mssql-tools unixodbc-dev -y

title "Configurating SQL Server ..."
sudo /opt/mssql/bin/mssql-conf setup

title "Adding SQL Server tools binary path into system environment path ..."
TOOLS_PATH="/opt/mssql-tools/bin"
BASHRC_PATH="${HOME}/.bashrc"
ADDED=`grep $BASHRC_PATH -e ${TOOLS_PATH}`
if [[ -z "$ADDED" ]]; then
	echo "export PATH=\"\$PATH:${TOOLS_PATH}\"" >> ~/.bashrc
fi
export PATH="$PATH:${TOOLS_PATH}"


title "Installing Nodejs and NPM ... "
URL="https://deb.nodesource.com/setup_7.x"
sudo curl --silent --location "${URL}" | sudo bash -
sudo apt install -y nodejs

title "Installing CNPM ..."
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org

title "Installing dependencies of this project ..."
cnpm i

title "Install finished!"