#!/usr/bin/env node

const fs = require('fs');

//set dir for the templates
const template = __dirname + '/../templates/statefulComp';

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
const renameFile = async(oldN, newN) => {
    let from = dir + '/' + oldN;
    let to = dir + '/' + newN;
    await fs.rename(from, to, () => {});
}

//find and replace function
const findReplace = async(fileName , find, replace) => {

    const file = dir + '/' + fileName;

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var result = data.replace(find, replace);

        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
    
}

//run tasks function
const run = async() => {
    //create dir
    fs.mkdirSync(dir);

    //copy files
    copyFile('Component.js');
    copyFile('Container.js');
    copyFile('index.js');
    copyFile('styles.js');

    //rename files
    await renameFile('Component.js', compNameFormatted + 'Component.js');
    await renameFile('Container.js', compNameFormatted + 'Container.js');

    //edit files with new name
    findReplace(compNameFormatted + 'Component.js', /ComponentName/g, compNameFormatted + 'Component');
    findReplace(compNameFormatted + 'Container.js', /ComponentName/g, compNameFormatted + 'Component');
    findReplace(compNameFormatted + 'Container.js', /ContainerName/g, compNameFormatted + 'Container');
    findReplace('index.js', /ContainerName/g, compNameFormatted + 'Container');
    findReplace('styles.js', /ComponentName/g, compNameFormatted + 'Component');

    //All done
    console.log('\x1b[32m' + '%s\x1b[0m', 'Component successfully created!');
}

//run tasks
run();