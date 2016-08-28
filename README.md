# AutoHome - Lightweight home automation
AutoHome is a home automation bus written entirely in ES6 and runs on Node.js.
It is easily extendable with so called 'binders' that interface with all kinds of home automation devices, protocols and APIs.

## Requirements
AutoHome requires the following software to be installed on your machine:

- Node.js (6.4.0 or higher)
- NPM
- (recommended) Python 2 (for building some binders' dependencies)
- (recommended) Build tools (base-devel on Arch Linux, build-essentials on Ubuntu, ... for building some binders' dependencies)

## Installation
There are multiple ways to install AutoHome.

### Tarball (releases)
To install the latest version of AutoHome, get it from [here](http://autohome.lowijs.io/downloads). The `latest.tgz` will point to the latest version.

To install on *nix, run the following commands:
```
wget http://autohome.lowijs.io/downloads/latest.tgz
tar xzf latest.tgz
cd autohome
npm install
```

### NPM
It is possible to install AutoHome from NPM. Just run `npm install autohome` and it will be installed under `node_modules` in your current directory.

### GitHub
Finally, you can clone this repository. That will give you the latest and greatest, but possibly buggy version of AutoHome. When done, run `npm install` from the `autohome` directory.
