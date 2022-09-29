#!/usr/bin/env node

var fs = require('fs');
var inquirer = require('inquirer');
var cmd = require('node-cmd');
var table = require('table');
var chalk = require('chalk');
var args = require('args');
var config = null;

args
    .option('semver', 'major, minor or patch')
    .option('display', 'displays the latest version')
    .option('commit', 'determines if the code should be commited and pushed')
    .option('tag', 'determines if the code should be tagged (only works if the commit flag is set)')
    .option('init', 'initializes a bump config file');

const flags = args.parse(process.argv);

if (flags.display) {
    loadBumpConfig()
        .then(load)
        .then(displayVersion)
} else if (flags.init) {
    inquirer.prompt(
        [
            { type: 'input', name: 'version_path', message: 'Enter the path where to save the json sempath file (e.i.: ./version.json):' },
            { type: 'confirm', name: 'update_package_json', message: 'Should the package json version also be updated?' }
        ]).then(async answers => {
            config = {
                version_path: answers.version_path,
                update_package_json: answers.update_package_json
            }
            fs.writeFile('bump.json', JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.log(chalk.red(err));
                }
                console.log(chalk.green('Bump config created successfully!'));
            });
            // check if config.version_path includes directories
            if (config.version_path.includes('/')) {
                var dirs = config.version_path.split('/');
                var file = dirs.pop();
                var dir = dirs.join('/');
                // check if the directory exists
                if (!fs.existsSync(dir)) {
                    // create the directory
                    await runAsync(`mkdir -p ${dir}`)
                        .then(data => {
                            console.log(chalk.green(`Directory ${dir} created successfully!`));
                        })
                        .catch(err => {
                            console.log(chalk.red(err));
                        })
                }
            } else {
                await runAsync(`touch ${config.version_path}`)
                    .catch(err => {
                        console.log(chalk.red(err));
                    })
            }

            fs.writeFile(config.version_path, JSON.stringify({ major: 0, minor: 0, patch: 0 }, null, 4), (err) => {
                if (err) {
                    console.log(chalk.red(err));
                }
                console.log(chalk.green(`${config.version_path} created successfully!`));
            });
        });
} else {
    loadBumpConfig()
        .then(inquire)
        .then(load)
        .then(increment)
        .then(updatePackageJson)
        .then(save)
        .then(tag)
        .then(commit)
        .catch(err => {
            console.log(chalk.red(err.message));
        });
}

function loadBumpConfig() {
    return new Promise((resolve, reject) => {
        fs.readFile('bump.json', (err, data) => {
            if (err) { reject(err); }
            config = JSON.parse(data.toString());
            resolve(config);
        });
    });
}

function inquire(config) {
    if (flags.semver) {
        var answers = {
            version: flags.semver
        }
        return Promise.resolve(answers);
    } else {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'version',
                message: 'Version to increment:',
                default: 'patch',
                choices: [
                    {
                        name: 'major',
                        value: 'major',
                        short: 'major'
                    },
                    {
                        name: 'minor',
                        value: 'minor',
                        short: 'minor'
                    },
                    {
                        name: 'patch',
                        value: 'patch',
                        short: 'patch'
                    }
                ]
            }
        ]);
    }
}

function load(answers) {
    return new Promise((resolve, reject) => {
        fs.readFile(config.version_path, (err, data) => {
            if (err) {
                resolve({
                    answers,
                    config,
                    data: { major: 0, minor: 0, patch: 0 }
                });
            } else {
                resolve({
                    answers,
                    config,
                    data: JSON.parse(data.toString())
                });
            }

        });
    });
}

function increment(response) {
    return new Promise((resolve, reject) => {
        response.data[response.answers.version] += 1;
        if (response.answers.version === 'minor') { response.data.patch = 0 }
        if (response.answers.version === 'major') { response.data.minor = 0; response.data.patch = 0 }
        resolve(response)
    });
}

function updatePackageJson(response) {
    if (response.config.update_package_json) {
        var versionStr = `${response.data.major}.${response.data.minor}.${response.data.patch}`;
        return runAsync(`npm version ${versionStr} --no-git-tag-version`)
            .then(data => {
                if (data.err) {
                    throw new Error(data.stderr);
                }
                console.log(chalk.green(data.data));
            })
            .then(() => {
                return response;
            });
    } else {
        return Promise.resolve(response);
    }
}

function save(response) {
    return new Promise((resolve, reject) => {
        fs.writeFile(config.version_path, JSON.stringify(response.data, null, 4), (err) => {
            if (err) {
                reject({
                    status: 'error',
                    message: err.message,
                });
            }

            var versionStr = `v${response.data.major}.${response.data.minor}.${response.data.patch}`;
            var msg = `${versionStr}`;

            const data = [
                ['New version', chalk.green(msg)],
            ];

            const config = {
                border: table.getBorderCharacters(`honeywell`)
            };

            console.log(table.table(data, config));

            resolve({ answers: response.answers, versionStr: versionStr });
        });
    });
}

function displayVersion(response) {
    var versionStr = `v${response.data.major}.${response.data.minor}.${response.data.patch}`;
    var msg = `${versionStr}`;

    const data = [
        ['Current version', chalk.blue(msg)],
    ];

    const config = {
        border: table.getBorderCharacters(`honeywell`)
    };

    console.log(table.table(data, config));
}

function tag(response) {
    if (flags.tag) {
        return inquirer
            .prompt([{ type: 'input', name: 'tag_message', message: 'Enter tag message:' }])
            .then(answers => {
                var command = `git tag -a v${response.versionStr}) -m "${answers.tag_message}"`
                chalk.green(command)
                return runAsync(command)
            })
            .then(_ => response);
    } else {
        return Promise.resolve(response);
    }
}

function commit(response) {
    if (flags.commit) {
        return inquirer.prompt([{ type: 'input', name: 'commit_message', message: 'Enter commit message:' }])
            .then(answers => runAsync(`git add .`, { answers }))
            .then(data => {
                var command = `git commit -m "(${response.versionStr}) ${data.details.answers.commit_message}"`
                chalk.green(command)
                return runAsync(command)
            })
            .then(_ => runAsync(`git push`));
    } else {
        return Promise.resolve();
    }
}

function runAsync(string, details) {
    return new Promise((resolve, reject) => {
        cmd.get(string, (err, data, stderr) => {
            resolve({ err, data, stderr, details });
        })
    })
}

