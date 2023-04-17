const tesetFolder = '../data/';
const fs = require('fs');

fs.readdir(tesetFolder, (err, files) => {
    files.forEach(file => {
        console.log(`<li>${file}</li>`);
    })
})