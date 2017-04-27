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

### API

#### Modules

__GET /api/v1/modules__

__PUT /api/v1/modules/:id__

```
{
	"enabled": true,
	"configuration": {
		"fields": [
			{"name": "auto", "value": 3}
		]
	}
}
```

#### Components

__GET /api/v1/components__

__PUT /api/v1/components/:id__

```
{
	"values": {
		"on": 0
	}
}
```

#### Scenes

__GET /api/v1/scenes__

__POST /api/v1/scenes__

```
{
	"name": "Sunrise",
	"triggers": [
		{"type": "SUNSET"}
	],
	"sequence": [
		{"type": "STATE", "name": "position", "value": 0.1, "componentId": "a8c2e3da-5857-46a4-a5c7-1396e9ab2ecc"}
	]
}
```

__PUT /api/v1/scenes/:id__

```
{
	"name": "Sunrise",
	"triggers": [
		{"type": "SUNSET"}
	],
	"sequence": [
		{"type": "STATE", "name": "position", "value": 0.1, "componentId": "a8c2e3da-5857-46a4-a5c7-1396e9ab2ecc"}
	]
}
```

__DELETE /api/v1/scenes/:id__
