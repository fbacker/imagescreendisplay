#!/usr/bin/env bash

# THANKS FOR AWESOME BASE CREATED BY:
#   MAGIC MIRROR

# bash -c "$(curl -sL https://raw.githubusercontent.com/fbacker/imagescreendisplay/master/installers/raspberry.sh)"


# Define the tested version of Node.js.
NODE_TESTED="v8.12.0"

# Determine which Pi is running.
ARM=$(uname -m) 

# Check the Raspberry Pi version.
if [ "$ARM" != "armv7l" ]; then
	echo -e "\e[91mSorry, your Raspberry Pi is not supported."
	echo -e "\e[91mPlease run on a Raspberry Pi 2 or 3."
	exit;
fi

# Define helper methods.
function version_gt() { test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1"; }
function command_exists () { type "$1" &> /dev/null ;}

# Installing helper tools
echo -e "\e[96mInstalling helper tools ...\e[90m"
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get update
sudo apt-get --assume-yes install git nodejs || exit

# Check if we need to install or upgrade Node.js.
echo -e "\e[96mCheck current Node installation ...\e[0m"
NODE_INSTALL=false
if command_exists node; then
	echo -e "\e[0mNode currently installed. Checking version number.";
	NODE_CURRENT=$(node -v)
	echo -e "\e[0mMinimum Node version: \e[1m$NODE_TESTED\e[0m"
	echo -e "\e[0mInstalled Node version: \e[1m$NODE_CURRENT\e[0m"
	if version_gt $NODE_TESTED $NODE_CURRENT; then
		echo -e "\e[96mNode should be upgraded.\e[0m"
		NODE_INSTALL=true

		# Check if a node process is currenlty running.
		# If so abort installation.
		if pgrep "node" > /dev/null; then
			echo -e "\e[91mA Node process is currently running. Can't upgrade."
			echo "Please quit all Node processes and restart the installer."
			exit;
		fi

	else
		echo -e "\e[92mNo Node.js upgrade necessary.\e[0m"
	fi

else
	echo -e "\e[93mNode.js is not installed.\e[0m";
	NODE_INSTALL=true
fi


# Install
cd ~/
if [ -d "./imagescreendisplay" ] ; then
	echo -e "\e[93mIt seems like service is already installed."
	echo -e "We'll try to upgrade instead."
	echo ""
    cd ~/imagescreendisplay

    echo -e "\e[96mUpgrade ...\e[90m"
	git reset --hard
	git fetch --tags
	latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)
	git checkout $latestTag
	echo -e "\e[92mChecked out latest release version!\e[0m"

	echo -e "\e[96mInstalling dependencies ...\e[90m"
	if npm install; then 
		echo -e "\e[92mDependencies installation Done!\e[0m"
		npm run build
	else
		echo -e "\e[91mUnable to install dependencies!"
		exit;
	fi
	sudo cp ~/installers/imagescreendisplay.service /etc/systemd/system/
	sudo chmod +x /etc/systemd/system/imagescreendisplay.service
	sudo systemctl daemon-reload
	sudo systemctl restart imagescreendisplay.service
	exit;
fi

echo -e "\e[96mCloning ...\e[90m"
if git clone --depth=1 https://github.com/fbacker/imagescreendisplay.git; then 
	echo -e "\e[92mCloning Done!\e[0m"
else
	echo -e "\e[91mUnable to clone."
	exit;
fi

cd ~/imagescreendisplay  || exit

git fetch --tags
latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)
git checkout $latestTag
echo -e "\e[92mChecked out latest release version!\e[0m"

echo -e "\e[96mInstalling dependencies ...\e[90m"
if npm install; then 
	echo -e "\e[92mDependencies installation Done!\e[0m"
	npm run build
else
	echo -e "\e[91mUnable to install dependencies!"
	exit;
fi

sudo cp ~/imagescreendisplay/installers/imagescreendisplay.service /etc/systemd/system/
sudo chmod +x /etc/systemd/system/imagescreendisplay.service
sudo systemctl enable imagescreendisplay.service
sudo systemctl start imagescreendisplay.service
echo -e "\e[92mAll is configured.\e[0m"