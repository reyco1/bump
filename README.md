# bump
bumps the "version" entry for a JSON file

## rationale

An easy to use cli to bump the [semver](http://semver.org/) version of a JSON file.

## installation

    npm i @reyco1/bump --save-dev

## command-line example

    Usage: bump [options] [command]
  
    Commands:
        help     Display help
        version  Display version
    
    Options:
        -i, --init     Initialize the bump config file
        -c, --commit   Determines if the code should be commited and pushed
        -d, --display  Displays the latest version
        -h, --help     Output usage information
        -s, --semver   Major, Minor or Patch
        -v, --version  Output the version number