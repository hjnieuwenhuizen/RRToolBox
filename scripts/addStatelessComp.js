#!/usr/bin/env node
const fs = require('fs');

//get directory that command has been run
const workingDir = process.cwd();

//set dir for the templates
const template = __dirname + '/../templates/statelessComp';

//get args
const [,, ...args] = process.argv;

//get comp name
const compName = args[0];

//check that a name was provided
if(compName === undefined) {
    console.log('\x1b[31m' + '%s\x1b[0m', 'Please provide component name!');
    return;
}

//set new dir
const dir = './' + compName;

//check if already there
if (fs.existsSync(dir)){
    console.log('\x1b[31m' + '%s\x1b[0m', 'Component already exists!');
    return;
}

//Foramted camelcase name
const compNameFormatted = compName.charAt(0).toUpperCase() + compName.substr(1);

//copy file function
const copyFile = (name) => {
    let from = template + '/' + name;
    let to = dir + '/' + name;
    fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

//rename file function
const renameFile = (oldN, newN) => {
    return new Promise((resolve, reject) => {
        let from = dir + '/' + oldN;
        let to = dir + '/' + newN;
        fs.rename(from, to, () => {
            resolve();
        });
    });

}

//find and replace function
const findReplace = (fileName , find, replace) => {
    return new Promise(async(resolve, reject) => {
        const file = dir + '/' + fileName;

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }
    
            var result = data.replace(find, replace);
    
            fs.writeFile(file, result, 'utf8', function (err) {
                if (err) return reject(err);

                resolve();
            });
        });
    });
}

//run tasks function
const run = async() => {
    //create dir
    fs.mkdirSync(dir);

    //copy files
    copyFile('Component.js');
    copyFile('index.js');
    copyFile('styles.js');

    //rename files
    await renameFile('Component.js', compNameFormatted + 'Component.js');

    //edit files with new name
    await findReplace(compNameFormatted + 'Component.js', /ComponentName/g, compNameFormatted + 'Component');
    await findReplace('index.js', /ComponentName/g, compNameFormatted + 'Component');
    await findReplace('styles.js', /ComponentName/g, compNameFormatted + 'Component');

    //All done
    console.log('\x1b[32m' + '%s\x1b[0m', 'Component successfully created!');
}

//run tasks
run();