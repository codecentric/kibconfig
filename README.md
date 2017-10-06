# kibconfig

A small utility to sync Kibana config objects (dashboards, visuals, searches, etc...) with a local directory.

## Installation

To install:
```
npm install -g kibconfig
```

## Usage

see `kibconfig --help`

## First steps

Start by creating a `.kibconfig` file in a new empty directory. You'll probably

## Configuration

You can create a `.kibconfig` file in any upstream directory to contain the configuration:

```json
{
    "url": "http://localhost:9200",
    "datadir": "kibana",
    "verbose": true
}
```

Config attributes correspond to the parameters that are shown via `kibconfig --help`.

You can also maintain different profiles, for example to maintain different stages:

```json
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

`yarn run compile`

Re-Install it locally after local updates:

```bash
# Don't forget to unlink first
yarn unlink
yarn build
yarn link
```
