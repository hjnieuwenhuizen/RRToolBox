#!/usr/bin/env node
const fs = require('fs');
const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//set dir for the templates
const template = __dirname + '/../templates/statefulComp';

//get args
const [,, ...args] = process.argv;

//get app name
const appName = args[0].toLowerCase();

//check that a name was provided
if(appName === undefined) {
    console.log('\x1b[31m' + '%s\x1b[0m', 'Please provide a app name!');
    return;
}

/**
 * log
 */
const log = (msg) => {
    console.log('\x1b[33m' + '%s\x1b[0m', msg);
}

/**
 * runCommand
 */
const runCommand = (command) => {
    return new Promise(async(resolve, reject) => {
        try {
            log('Runnning command ' + command);
            await exec(command);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * init
 */
const init = async() => {
    try {

        console.log('\x1b[34m' + '%s\x1b[0m', 'This may take a few minutes. Maybe go grab a cup of coffee...');

        //install create-react-app
        await runCommand('npm install create-react-app -g');

        //set new dir
        const dir = './' + appName;

        //check if already there
        if (fs.existsSync(dir)){
            console.log('\x1b[31m' + '%s\x1b[0m', 'App already exists!');
            return;
        }

        //create-react-app
        await runCommand('create-react-app ' + appName);

        //install dependencies
        await runCommand('npm --prefix ./'+ appName + ' install --save react-jss react-redux redux redux-devtools-extension redux-logger redux-promise-middleware redux-thunk');

        //All done
        console.log('\x1b[32m' + '%s\x1b[0m', 'We are all done. App successfully created!');
    } catch (error) {
        console.log('\x1b[31m' + '%s\x1b[0m', 'Error creating application!', error);
    }
}

//run
init();