# kibconfig

A small library to sync Kibana config objects (dashboards, visuals, searches, etc...) with a local directory.

## Installation

To install (currently):
```
git clone https://github.com/codecentric/kibconfig.git
cd kibconfig
npm install -g
npm link
```

## Usage

see `kibconfig --help`

## Build yourself

Run ES6 code directly:

`babel-node src/kibconfig.js`

Compile es6 code for publish:

`npm run compile`

Re-Install it locally:

```
# Don't forget to unlink first
npm unlink
npm install -g
npm link
```