#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//set dir for the templates
const template = __dirname + '/../templates/createApp';

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
 * deleteFolderRecursive
 */
const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * copyFileSync
 */
const copyFileSync = ( source, target ) => {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

/**
 * copyFolderRecursiveSync
 */
const copyFolderRecursiveSync = ( source, target ) => {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
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
        process.chdir(dir);
        await runCommand('npm install --save react-jss react-redux redux redux-devtools-extension redux-logger redux-promise-middleware redux-thunk');
        process.chdir('../');

        //delete source and replace with our version
        deleteFolderRecursive(dir + '/src');

        //copy new src
        copyFolderRecursiveSync(template + '/src', dir);

        //All done
        console.log('\x1b[32m' + '%s\x1b[0m', 'We are all done. App successfully created!');
    } catch (error) {
        console.log('\x1b[31m' + '%s\x1b[0m', 'Error creating application!', error);
    }
}

//run
init();