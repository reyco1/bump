# @reyco1/bump

Bump is a simple yet powerful command line utility that allows you to maintain your projects [semver](http://semver.org/) version.

You can configure it to update the version in a standalone json file as well as your package.json, and it can also automatically commit and publish the changes.

## Rationale
An easy to use cli to bump the [semver](http://semver.org/) version of a JSON file.

## Installation

    npm i @reyco1/bump -g

  
## Command-line example
The following command will increment your patch version as well as ask you for a commit message and then commit your code prefixing the message with your complete version number and then publishes the code.

    bump -c -s patch

## Usage
Usage: bump [options] [command]

### Commands:
| Command | Description |
|--|--|
| **help** | Display help |
| **version** | Display version |

### Options:
| Flag | Description |
|--|--|
| **-i, --init**  | Initialize the bump config file |
| **-c, --commit** | Determines if the code should be committed and pushed |
| **-d, --display** | Displays the latest version |
| **-h, --help** | Output usage information |
| **-s, --semver** | major, minor or patch |
| **-v, --version** | Output the bump tool version number |
