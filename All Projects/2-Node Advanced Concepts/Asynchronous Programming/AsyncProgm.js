                            // Asynchronous programming with callbacks

// const fs = require('fs');

// fs.readFile('text.txt', 'utf8', (err, data) => {
//     if(err) {
//         console.error('Error reading file: ', err);
//         return;
//     }
//     console.log("Reading data from the file: ", data);
// });


                        // Asynchronous programming with Promises
            
// const fs = require('fs').promises;

// fs.readFile('text.txt', 'utf8')
// .then( data => console.log("Data is reading from the file: ", data))
// .catch( err => console.err("Error reading file: ", err));


                        // Asynchronous programming with async/await

// const fs = require('fs').promises;

// async function readFile() {
//     try {
//         let data = await fs.readFile('text.txt', 'utf8');
//         console.log("Data is reading from the file: ", data);
//     } catch (error) {
//         console.error('Error reading file: ', error);
//     }
    
// }

// readFile();



