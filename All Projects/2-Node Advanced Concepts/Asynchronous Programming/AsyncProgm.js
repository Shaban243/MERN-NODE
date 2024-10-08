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


                                    // Streams //

        //Readable stream
// const fs = require('fs');

// const stream = fs.createReadStream('largefile.txt', 'utf8');

// stream.on("data", data  => {
//     console.log("The data in chunks is read as following : \n", data);
// });

// stream.on("end", () => {
//     console.log("The data is successfully read from the file!");
// });

// stream.on("error", (err) => {
//     console.log("Error occured during reading the data from the file: ", err);
// });


// Writeable stream 

// const fs = require('fs');

// const writeStream = fs.createWriteStream('largfile.txt');

// writeStream.write("I'm going to write some data in file. \n");
// writeStream.write("I'm going in the mid of file to update content of file. \n");
// writeStream.end();

// writeStream.on('end', () => {
//     console.log('Finishing writing content to the file!');
// });

// writeStream.on('error', (err) => {
//     console.log('Error occurred in writing file!: ', err);
// });



                                // Duplex Stream
// const {duplex} = require('stream');

// const duplexStream = new Duplex({
//     read(size) {
//         this.push('This is a duplex stream!');
//         this.push(null);
//     }, 

//     write(data, encoding, callback) {
//         console.log("Data received from the file: ", data);
//         callback();
//     }

// });

// duplexStream.on('data', data => {
//     console.log("Data read from the file: ", data);
// });

// duplexStream.write('Writing data to duplex stream!');
// duplexStream.end();
