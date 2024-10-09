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


// Transform stream //

// const { Transform } = require('stream');

// const transformStream = new Transform({
//         transform(data, encoding, callback) {
//                 const lowerCaseData = data.toString().toLowerCase();
//                 this.push(lowerCaseData);
//                 callback();
//         }
// });

// process.stdin.pipe(transformStream).pipe(process.stdout);



                                                  // Buffers //

                // Buffer of specified size
// const buf = Buffer.alloc(10);
// console.log(buf);


                // Create buffer of specified size, skips initialization
// const buf = Buffer.allocUnsafe(10);
// console.log(buf);



                // Buffer of specified size
// const buf1 = Buffer.from('Hello, World!');
// console.log(buf1);



                // Creating buffer from array of bytes
// const buf = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
// console.log(buf);
// console.log(buf.toString());



                // Creating buffer from string
// const buf = Buffer.from('Hello, World!');
// const buf1 = Buffer.from(buf);
// console.log(buf1);
// console.log(buf1.toString());



                // Concatenation of two buffers
// const buf = Buffer.from('Hello,');
// const buf1 = Buffer.from('World!');
// const buf2 = Buffer.concat([buf, buf1]);
// console.log(buf2.toString());




                // Write string to a buffer
// const buf = Buffer.alloc(10);
// buf.write('Hello', 0, 'utf8');
// console.log(buf);



                // Create buffer for filling with the given value
// const buf = Buffer.alloc(15);
// buf.fill(0x41);
// console.log(buf.toString());



                // Buffer representing the no. of bytes for given string
// const str = 'Shaban';
// console.log(`The no. of bytes for ${str} string needed to represent: `, Buffer.byteLength(str, 'utf8'));


                                        // ----------------------------------------------------- //