
# @reyco1/bump

 
[![GitHub license](https://img.shields.io/github/license/reyco1/bump)](https://github.com/reyco1/bump/blob/main/LICENSE)  [![GitHub issues](https://img.shields.io/github/issues/reyco1/bump)](https://github.com/reyco1/bump/issues)  ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/reyco1/bump)  ![npm](https://img.shields.io/npm/dw/@reyco1/bump)  ![npm](https://img.shields.io/npm/v/@reyco1/bump)

**Bump** is a simple yet powerful command line utility that allows you to maintain your projects [semver](http://semver.org/) version.

You can configure it to update the version in a standalone json file as well as your package.json, and it can also automatically commit and publish the changes.

## Rationale

An easy to use cli to bump the [semver](http://semver.org/) version of a JSON file.

## Installation

    npm i @reyco1/bump -g

After installation is complete. In order to add Bump to any project, go to the project root and run the following command and follow the instructions:

    bump --init

## Command-line example

If you simply run the **bump** command on your timeline, you will be asked which part of your semver version number you would like to increment: major, minor, patch. Once you make a selection, your version json file (and optionally your package.json file) will have their version numbers updated.

    bump

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
| **-i, --init** | Initialize the bump config file |
| **-c, --commit** | Determines if the code should be committed and pushed |
| **-d, --display** | Displays the latest version |
| **-h, --help** | Output usage information |
| **-s, --semver** | major, minor or patch |
| **-v, --version** | Output the bump tool version number |
  

## License

(MIT License)

Copyright (c) 2023 **Rey Columna** 
Email: [hello@reyco.me](mailto:hello@reyco.me) 
Website: https://reyco.me

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.