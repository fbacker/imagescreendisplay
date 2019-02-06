# Image Display

This is a simple tool to handle and view images on a display. Specifically designed for preschool usage.

## How it works

Email images to the configured mail account. You can specify child/children names in the message. Images will automatically be added to the system after a couple of minutes.

You can use the web interface to add / remove images from the 'view' to be displayed.

Connect the Raspberry PI to a monitor that only displays the selected images.

## Configuration

1. First boot you will need to specify a google mail and password account.
2. Setup kids & parents in web interface.

## Installation

1. Raspberry PI 3 install Ubuntu Mate
2. `bash -c "$(curl -sL https://raw.githubusercontent.com/fbacker/imagescreendisplay/master/installers/raspberry.sh)"`
