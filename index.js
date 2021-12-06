#!/usr/bin/env node

var fs = require('fs');
var inquirer = require('inquirer');
var cmd = require('node-cmd');
var table = require('table');
var chalk = require('chalk');
var args = require('args');
var config = null;

args
    .option('semver',   'major, minor or patch')
    .option('display',  'displays the latest version')
    .option('commit',   'determines if the code should be commited and pushed');

const flags = args.parse(process.argv);

if (flags.display) {
    loadBumpConfig()
        .then(load)
        .then(displayVersion)
} else {
    loadBumpConfig()
        .then(inquire)
        .then(load)
        .then(increment)
        .then(save)
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
                    data: { major: 0, minor: 0, patch: 0 }
                });
            } else {
                resolve({
                    answers,
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
                border: table.getBorderCharacters(`honeywell`),
                columnDefault: {
                    width: 20,
                },
                columnCount: 2,
                columns: {
                    0: {
                        alignment: 'center',
                    },
                    1: {
                        width: 20,
                        alignment: 'center',
                    },
                },
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
        ['New version', chalk.green(msg)],
    ];

    const config = {
        border: table.getBorderCharacters(`honeywell`),
        columnDefault: {
            width: 20,
        },
        columnCount: 2,
        columns: {
            0: {
                alignment: 'center',
            },
            1: {
                width: 20,
                alignment: 'center',
            },
        },
    };

    console.log(table.table(data, config));
}

function commit(response) {
    if (flags.commit) {
        return inquirer.prompt([{ type: 'input', name: 'commit_message', message: 'Enter commit message:' }])
            .then(answers => runAsync(`git add .`, { answers }))
            .then(data => runAsync(`git commit -m "(${response.versionStr}) ${data.details.answers.commit_message}"`))
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

