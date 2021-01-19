# The GEI-car's Human Machine Interface

HMI for the GEI-car project

Needs rosbridge_server installed.
Needs apache2 server installed.

## How to launch rosbridge_server:

Enter the command on your terminal (Ctrl + Alt + T)

```bash
roslaunch rosbridge_server rosbridge_websocket.launch
```

## How to install Apache2 server

### Ubuntu-based linux distribution

(Remove the "sudo" for Debian)

Enter the command on your terminal (Ctrl + Alt + T)

```bash
sudo apt update
sudo apt install apache2 php libapache2-mod-php
```

When installed go to the /var directory and change the owner of www

```bash
cd /var/
sudo chown -R <username> www
```

Then delete the html folder

```bash
cd www
sudo rm -R html
```

Or rename it

```bash
sudo mv html old.html
```

Clone the git in the /var/www directory

```bash
git clone https://github.com/siec2020/hmi
```

Rename the directory to html

```bash
mv hmi html
```

Then go to this url http://127.0.0.1/ , to see the hmi

### Notes
Video stream requires a ROS server well configured