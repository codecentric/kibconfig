# kibconfig

A small utility to sync Kibana config objects (dashboards, visuals, searches, etc...) with a local directory.

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

## Configuration

You can create a `.kibconfig` file in any upstream directory to contain the configuration:

```
{
    "url": "http://localhost:9200",
    "datadir": "kibana",
    "verbose": true
}
```

Config attributes correspond to the parameters that are shown via `kibconfig --help`.

You can also maintain different profiles, for example to maintain different stages:

```
{
    "profiles": {
        "preprod": {
            "url": "http://my-pre-production-server:9200",
            "datadir": "preprod",
            "verbose": true
        },
        "production": {
            "url": "http://my-production-server:9200",
            "datadir": "production",
            "verbose": true
        }
    }
}
```

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
