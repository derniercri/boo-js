## Boo

Features:

  - Google Assistant as primary interface: TODO
  - Strong typing system with flow: DONE
  - Modular architecture: DONE
  - Advanced scenario: TODO
  - UI agnostic

| #         | LIGHT   | COLOR_LIGHT | COVER     | TEMPERATURE | WEATHER  |
| --------- | ------- | ----------- | --------- | ----------- | -------- |
| ZWave     | x       | x           | OK        |             |          |
| Hue       | OK      | TODO        |           |             |          |
| Nest      |         |             |           | TODO        |          |
| Yahoo     |         |             |           |             | TODO     |


### Getting started

__Installation on a Raspberry PI 3__

Setup OpenZwave and NodeJS
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb && sudo dpkg -i node_latest_armhf.deb
sudo apt-get install -y libudev-dev git bluetooth bluez libbluetooth-dev
npm install -g n
sudo n lts
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/openzwave_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3-dev_1.4.79.gfaea7dd_armhf.deb"
sudo dpkg -i *openzwave*.deb
npm install -g pm2
pm2 startup
```

Setup the correct timezone
```
dpkg-reconfigure tzdata
```

Install Boo
```
git clone https://github.com/derniercri/boo-js.git -b master
cd boo-js
npm install
pm2 start lib/server.js
pm2 save
```

