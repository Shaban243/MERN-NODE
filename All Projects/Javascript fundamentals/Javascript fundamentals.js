
// Working with arrow functions

// const add = (a, b) => a + b;
// console.log(add(4,5));


// arrow function to work with default values
// const sum = (a, b = 5) => a + b;
// console.log(sum(4));
// console.log(sum(8 + 1));

////Arrow function with strings                                 
// const greet = name => `Hello, ${name}!`;
// console.log(greet('Muhammad Shaban'));


//Arrow function with map functions
// const numbers = [1,2,3,4];
// const multipliedByTwo = numbers.map(num => num * 2);
// console.log(multipliedByTwo);

//Arrow function with prompt/confirm/alert
// function ask(question, yes, no) {
//     if(confirm(question)) yes();
//     else no();
// }

// ask(
//     "Do You Agree?", 
//     () => alert('You agreed!'),
//     () => alert('You cancelled the execution')
// );


//Arrow function with filter 
// const numbers = [1,2,3,5,7,9,10];
// const lessthanFive = numbers.filter(num => num < 5);
// console.log(lessthanFive);
//Arrow function with string methods
// Arrow function to convert string into uppercase
// const toUpperCase = string => string.toUpperCase();
// console.log(toUpperCase('hello'));


// Arrow function with objects
// const person = {
//     name: "Muhammad Shaban",
//     getName: function() {return this.name}
// }
// console.log(person.getName());



// Arrow function with rest parameter
// const totalSum = (...args) => args.reduce((total, num) => total + num);
// console.log(totalSum(1,2,3,4));

// Arrow function to return true if number is even or false if number is odd 
// const checkEvenOdd = n => (n % 2 === 0) ? 'True' : 'false';
// console.log(checkEvenOdd(10));


//  ---------------------------------------------------   //



// Working with destructuring assignment


// array destructuring
// let arr = ['Muhammad', 'Shaban'];
// let [firstName, surName] = arr;
// console.log(firstName);
// console.log(surName);    

// let [firstName, surName] = 'Muhammad Shaban'.split(' ');
// console.log(firstName);
// console.log(surName);


// let numbers = [1,2,3,4];
// let [one, two , three, four] = numbers;
// console.log(one, two, three, four);


// ignoring elements using commas in an Array

// let users = ['Muhammad', 'Shaban', 'Hassan', 'Ali', 'Usman', 'Ahmad'];
// let [,,, surName] = users;
// console.log('surName is: ', surName);
// let [firstName, nickName,, secondName,, thirdName] = users;
// console.log(firstName, nickName,secondName, thirdName);


// Assigning values to the left side                                                                       
// let user = {};
// [user.name, user.surName] = ['Muhammad Shaban', 'Muhammad Ahmad'];
// console.log(user.name, user.surName);


// working with iterables
// let [one, two, three] = new Set([1, 2, 3]);
// console.log(one);


// looping over Object.entries()

// let user = {
//     name: 'Muhammad Gulzar',
//     age: 30
// };

// for( let[key,value] of Object.entries(user)) {
//     console.log(`${key}: ${value}`);
// }

// let software = {
//     name: 'Snipping tool',
//     capacity: '120mah',
//     model: 'redC',
//     manufacturedCity: 'Japan'
// };

// for( let[key, value] of Object.entries(software)) {
//     console.log(`${key}: ${value}`);
// }

// destructuring assignment with iterables of Map or setting the values of user properties using set method
// let user = new Map();
// user.set('name', 'Muhammad Shaban');
// user.set('city', 'Kasur');
// user.set('skill', 'node.js');

// for(let[key, value] of user) {
//     console.log(`${key}: ${value}`);
// }



// swapping variable's values using destructuirng assignemnt

// let chiefGuest = 'Haiz Nabil';
// let ministerGuest = 'Hafiz Ali';

// [chiefGuest, ministerGuest] = [ministerGuest, chiefGuest];
// console.log(chiefGuest, ministerGuest);


// working with rest parameter
// let[name1, name2] = ['Muhammad', 'shaban', 'Hassan', 'ali'];
// console.log(name1, name2);


// The rest pattern 
// let options = {
//     title: 'Menu',
//     height: 200,
//     width: 100,
// };

// let { title, ...rest } = options;
// console.log(options.width); console.log(title);
// console.log(options.title); console.log(rest.height);
// console.log(options.height); console.log(rest.width);



// nested destructuring assignment with more complex pattern 
// let options = {
//     size : {
//         width: 200,
//         height: 100
//     }, 

//     items: ['Donut', 'Cake'],
//     extra: true,
//     };

//     let {
//         size: {width, height},
//         title= "Menu",
//         items: [item1, item2]
//     } = options;

//     console.log(width, height, item1, item2, title);



// let brackets = {
//     quality : {
//         capacity: 'good',
//         container: 'heavy'
//     }, 

//     products: ['pipeline', 'dockerization'],
//     addition: true,
// };

// let {
//     quality: {capacity, container},
//     products : [product1, product2],
//     tag = 'Mr. Chips'
// } = brackets;

// console.log(capacity, container, product1, product2, tag);


// Task: 01)

// let user = {
//     name: "John",
//     years: 30
//   };
//   Write the destructuring assignment that reads:

//   name property into the variable name.
//   years property into the variable age.
//   isAdmin property into the variable isAdmin (false, if no such property)


// solution:

// let user = {
//     name: 'john',
//     years: 30
// };

// let {name, years: age, isAdmin = false} = user;
// console.log(user.name, age, isAdmin);


// Task no: 02)
// The maximal salary

// let salaries = {
//     "John": 100,
//     "Pete": 300,
//     "Mary": 250
// };

// function topSalary(salaries) {
//     let maxSalary = 0;
//     let maxName = null;

//     for (let [name, salary] of Object.entries(salaries)) {
//         if (maxSalary < salary) {
//             maxSalary = salary;
//             maxName = name;
//         }
//         return maxName;
//     }
// }
// console.log(topSalary(salaries));

                                // -------------------------------------------------  //

     
                                
// function to loadScript in document using call backs and promises

// using call back 
// function loadScript(src, callback) {
//     let script = document.createElement('script');
//     script.src = src;

//     script.onload = () => callback(null, script);
//     script.onerror = () => callback(new Error(`Script load error for ${src}`));

//     document.head.append(script);
//     console.log(script);
// }


// using promises

// function loadScript(script) {
//     let script = document.createElement('script');
//     script.src = src;

//     script.onload = () => resolve('The script is successfully loaded in the document ', script);
//     script.onerror = () => reject(new Error(`The script load error is occured: ${src}`));

//     document.head.append(script);
// }


// let promise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js');
// promise.then(script => console.log(`${script.src} is loaded!`));
// promise.catch(error => console.log(`Error: ${err.message}`));

// promise.then(script => console.log('Another handler...'));



// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('This is a successfull operation!');
//         reject(new Error('Whoops an error occurred!.'));
//     }, 2000);
//     console.log(1);
// });
// promise
// .then(result => console.log(result))
// .catch(error => console.log(error.message));



                                    // -----------------------------------------//

                                // let's move to the next topic ---- Closures

// basic closure understanding
// function outerFunction() {
//     let outerValue = "This is outer function value";

//     function innerFunction() {
//         console.log(outerValue);
//     }
//     return innerFunction;
// };

// const myClosure = outerFunction();
// myClosure();



// function createCount() {
//     let count = 0;

//     return function() {
//         return count += 1;
//     }
// };

// const increment = createCount();
// console.log(increment());
// console.log(increment());


// function getCount() {
//     let count = 4;

//     return function() {
//         return count -= 1;
//     }

// };

// const decrement = getCount();
// console.log(decrement());
// console.log(decrement());



// closures in asynchronous programming and in callbacks

// function fetchData(url) {
//     let data = "Fetching data from the following URL: " + url;

//     setTimeout(() => {
//         console.log(data);
//     }, 2000);
// }

// fetchData("https://example.com");


                        // Common pitfalls with closures || working closures with loops 

// for(let i = 1; i <= 5; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, i * 2000);
// }                      


// function multiply(a) {
//     return function(b) {
//         return a * b;
//     }
// }

// const multiply2 = multiply(2);
// console.log(multiply2(5));


// function outerFunction() {
//     let outerValue = "This is outerfunction value";

//     function innerFunction() {
//         console.log(outerValue);
//     }

//     return innerFunction;
// };

// myClosure = outerFunction();
// myClosure();


// function counter() {
//     let count = 0;

//     return function() {
//         return count += 2;
//     }
// };

// const increment = counter();
// console.log(increment());
// console.log(increment());


// function fetchData(url) {
//     let URL = "The data is fetching from the following URL: " + url;

//     setTimeout(() => {
//         console.log(URL);
//     }, 3000);
// };

// fetchData("https://example.com")


// for(let i = 1; i < 10; i++) {
//     setTimeout(() => {
//         console.log("The value of i after iterating through the loop: " , i);
//     }, i * 1000);
// };


                            // Task for creating the function for password checking

// function passwordChecker(password) {
//     return function(input) {
//         return input === password;
//     }
// };

// const checkPassword = passwordChecker('securePassword123');
// console.log(checkPassword('wrongPassword'));
// console.log(checkPassword('securePassword123'));


                        // Task for event handlres with closures        

// function createButtonHandler(label) {
//     return {

//         onClick: function () {
//             console.log(`Button ${label} is clicked!`);
//         },

//         onHover: function () {
//             console.log(`Hovering over the button ${label}`);
//         }
//     };
// }

// const handlers = createButtonHandler('submit');
// handlers.onClick();
// handlers.onHover();



                        //  Higher order functions 
// function as an argument
// function applyOperation(a, b, operation) {
//     return operation(a, b);
// }

//     function add(x, y) {
//         return x + y;
//     }

//     function multiply(x, y) {
//         return x * y;
//     }
          

// console.log(applyOperation(2, 5, add));
// console.log(applyOperation(2, 5, multiply));


// function return a new function
// function greet(greetings) {
//     return function(name) {
//         return (`${greetings}, ${name}`);
//     }
// }

// const result = greet('Hello');
// console.log(result('Muhammad Shaban!'));



        // Task for multiplying the number to its original number 

// function makeMultiplier(n1) {
//     return function(n2) {
//         return n1 * n2;
//     }
// }

// const result = makeMultiplier(10);
// console.log(result(10));


                // Task for creat custom for each function of array 
// function customForEach(arr, callback) {
//     for(let i = 0; i < arr.length(); i++) {
//         callback(arr[i], i, arr);
//     }
// }

// const numbers = [1, 2, 3];
// numbers.forEach(num => console.log(num * 2));


// function compose(...functions) {
//     return function(value) {
//         return functions.reduceRight((acc, fn) => fn(acc), value);
//     };
// }

// //Task for composing the functions using reduceRight method of array
// const add = (x) => x + 2;
// const multiply = (x) => x * 3;

// const combinedFunction = compose(multiply, add);
// console.log(combinedFunction(5)); // Output: 21


// function compose(...functions) {
//     return function(value) {
//         return functions.reduceRight((acc, fn) => fn(acc), value);
//     }
// }

// const add = (x) => {
//     return x + 2;
// }

// const multiply = (x) => {
//     return x * 5;
// }

// const combinedFunctions = compose(multiply, add);
// console.log(combinedFunctions(10));

// Hello world 







// Working with arrow functions

// const add = (a, b) => a + b;
// console.log(add(4,5));


// arrow function to work with default values
// const sum = (a, b = 5) => a + b;
// console.log(sum(4));
// console.log(sum(8 + 1));

////Arrow function with strings                                 
// const greet = name => `Hello, ${name}!`;
// console.log(greet('Muhammad Shaban'));


//Arrow function with map functions
// const numbers = [1,2,3,4];
// const multipliedByTwo = numbers.map(num => num * 2);
// console.log(multipliedByTwo);

//Arrow function with prompt/confirm/alert
// function ask(question, yes, no) {
//     if(confirm(question)) yes();
//     else no();
// }

// ask(
//     "Do You Agree?", 
//     () => alert('You agreed!'),
//     () => alert('You cancelled the execution')
// );


//Arrow function with filter 
// const numbers = [1,2,3,5,7,9,10];
// const lessthanFive = numbers.filter(num => num < 5);
// console.log(lessthanFive);
//Arrow function with string methods
// Arrow function to convert string into uppercase
// const toUpperCase = string => string.toUpperCase();
// console.log(toUpperCase('hello'));


// Arrow function with objects
// const person = {
//     name: "Muhammad Shaban",
//     getName: function() {return this.name}
// }
// console.log(person.getName());



// Arrow function with rest parameter
// const totalSum = (...args) => args.reduce((total, num) => total + num);
// console.log(totalSum(1,2,3,4));

// Arrow function to return true if number is even or false if number is odd 
// const checkEvenOdd = n => (n % 2 === 0) ? 'True' : 'false';
// console.log(checkEvenOdd(10));


//  ---------------------------------------------------   //



// Working with destructuring assignment


// array destructuring
// let arr = ['Muhammad', 'Shaban'];
// let [firstName, surName] = arr;
// console.log(firstName);
// console.log(surName);    

// let [firstName, surName] = 'Muhammad Shaban'.split(' ');
// console.log(firstName);
// console.log(surName);


// let numbers = [1,2,3,4];
// let [one, two , three, four] = numbers;
// console.log(one, two, three, four);


// ignoring elements using commas in an Array

// let users = ['Muhammad', 'Shaban', 'Hassan', 'Ali', 'Usman', 'Ahmad'];
// let [,,, surName] = users;
// console.log('surName is: ', surName);
// let [firstName, nickName,, secondName,, thirdName] = users;
// console.log(firstName, nickName,secondName, thirdName);


// Assigning values to the left side                                                                       
// let user = {};
// [user.name, user.surName] = ['Muhammad Shaban', 'Muhammad Ahmad'];
// console.log(user.name, user.surName);


// working with iterables
// let [one, two, three] = new Set([1, 2, 3]);
// console.log(one);


// looping over Object.entries()

// let user = {
//     name: 'Muhammad Gulzar',
//     age: 30
// };

// for( let[key,value] of Object.entries(user)) {
//     console.log(`${key}: ${value}`);
// }

// let software = {
//     name: 'Snipping tool',
//     capacity: '120mah',
//     model: 'redC',
//     manufacturedCity: 'Japan'
// };

// for( let[key, value] of Object.entries(software)) {
//     console.log(`${key}: ${value}`);
// }

// destructuring assignment with iterables of Map or setting the values of user properties using set method
// let user = new Map();
// user.set('name', 'Muhammad Shaban');
// user.set('city', 'Kasur');
// user.set('skill', 'node.js');

// for(let[key, value] of user) {
//     console.log(`${key}: ${value}`);
// }



// swapping variable's values using destructuirng assignemnt

// let chiefGuest = 'Haiz Nabil';
// let ministerGuest = 'Hafiz Ali';

// [chiefGuest, ministerGuest] = [ministerGuest, chiefGuest];
// console.log(chiefGuest, ministerGuest);


// working with rest parameter
// let[name1, name2] = ['Muhammad', 'shaban', 'Hassan', 'ali'];
// console.log(name1, name2);


// The rest pattern 
// let options = {
//     title: 'Menu',
//     height: 200,
//     width: 100,
// };

// let { title, ...rest } = options;
// console.log(options.width); console.log(title);
// console.log(options.title); console.log(rest.height);
// console.log(options.height); console.log(rest.width);



// nested destructuring assignment with more complex pattern 
// let options = {
//     size : {
//         width: 200,
//         height: 100
//     }, 

//     items: ['Donut', 'Cake'],
//     extra: true,
//     };

//     let {
//         size: {width, height},
//         title= "Menu",
//         items: [item1, item2]
//     } = options;

//     console.log(width, height, item1, item2, title);



// let brackets = {
//     quality : {
//         capacity: 'good',
//         container: 'heavy'
//     }, 

//     products: ['pipeline', 'dockerization'],
//     addition: true,
// };

// let {
//     quality: {capacity, container},
//     products : [product1, product2],
//     tag = 'Mr. Chips'
// } = brackets;

// console.log(capacity, container, product1, product2, tag);


// Task: 01)

// let user = {
//     name: "John",
//     years: 30
//   };
//   Write the destructuring assignment that reads:

//   name property into the variable name.
//   years property into the variable age.
//   isAdmin property into the variable isAdmin (false, if no such property)


// solution:

// let user = {
//     name: 'john',
//     years: 30
// };

// let {name, years: age, isAdmin = false} = user;
// console.log(user.name, age, isAdmin);


// Task no: 02)
// The maximal salary

// let salaries = {
//     "John": 100,
//     "Pete": 300,
//     "Mary": 250
// };

// function topSalary(salaries) {
//     let maxSalary = 0;
//     let maxName = null;

//     for (let [name, salary] of Object.entries(salaries)) {
//         if (maxSalary < salary) {
//             maxSalary = salary;
//             maxName = name;
//         }
//         return maxName;
//     }
// }
// console.log(topSalary(salaries));

                                // -------------------------------------------------  //

     
                                
// function to loadScript in document using call backs and promises

// using call back 
// function loadScript(src, callback) {
//     let script = document.createElement('script');
//     script.src = src;

//     script.onload = () => callback(null, script);
//     script.onerror = () => callback(new Error(`Script load error for ${src}`));

//     document.head.append(script);
//     console.log(script);
// }


// using promises

// function loadScript(script) {
//     let script = document.createElement('script');
//     script.src = src;

//     script.onload = () => resolve('The script is successfully loaded in the document ', script);
//     script.onerror = () => reject(new Error(`The script load error is occured: ${src}`));

//     document.head.append(script);
// }


// let promise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js');
// promise.then(script => console.log(`${script.src} is loaded!`));
// promise.catch(error => console.log(`Error: ${err.message}`));

// promise.then(script => console.log('Another handler...'));



// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('This is a successfull operation!');
//         reject(new Error('Whoops an error occurred!.'));
//     }, 2000);
//     console.log(1);
// });
// promise
// .then(result => console.log(result))
// .catch(error => console.log(error.message));



                                    // -----------------------------------------//

                                // let's move to the next topic ---- Closures

// basic closure understanding
// function outerFunction() {
//     let outerValue = "This is outer function value";

//     function innerFunction() {
//         console.log(outerValue);
//     }
//     return innerFunction;
// };

// const myClosure = outerFunction();
// myClosure();



// function createCount() {
//     let count = 0;

//     return function() {
//         return count += 1;
//     }
// };

// const increment = createCount();
// console.log(increment());
// console.log(increment());


// function getCount() {
//     let count = 4;

//     return function() {
//         return count -= 1;
//     }

// };

// const decrement = getCount();
// console.log(decrement());
// console.log(decrement());



// closures in asynchronous programming and in callbacks

// function fetchData(url) {
//     let data = "Fetching data from the following URL: " + url;

//     setTimeout(() => {
//         console.log(data);
//     }, 2000);
// }

// fetchData("https://example.com");


                        // Common pitfalls with closures || working closures with loops 

// for(let i = 1; i <= 5; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, i * 2000);
// }                      


// function multiply(a) {
//     return function(b) {
//         return a * b;
//     }
// }

// const multiply2 = multiply(2);
// console.log(multiply2(5));


// function outerFunction() {
//     let outerValue = "This is outerfunction value";

//     function innerFunction() {
//         console.log(outerValue);
//     }

//     return innerFunction;
// };

// myClosure = outerFunction();
// myClosure();


// function counter() {
//     let count = 0;

//     return function() {
//         return count += 2;
//     }
// };

// const increment = counter();
// console.log(increment());
// console.log(increment());


// function fetchData(url) {
//     let URL = "The data is fetching from the following URL: " + url;

//     setTimeout(() => {
//         console.log(URL);
//     }, 3000);
// };

// fetchData("https://example.com")


// for(let i = 1; i < 10; i++) {
//     setTimeout(() => {
//         console.log("The value of i after iterating through the loop: " , i);
//     }, i * 1000);
// };


                            // Task for creating the function for password checking

// function passwordChecker(password) {
//     return function(input) {
//         return input === password;
//     }
// };

// const checkPassword = passwordChecker('securePassword123');
// console.log(checkPassword('wrongPassword'));
// console.log(checkPassword('securePassword123'));


                        // Task for event handlres with closures        

// function createButtonHandler(label) {
//     return {

//         onClick: function () {
//             console.log(`Button ${label} is clicked!`);
//         },

//         onHover: function () {
//             console.log(`Hovering over the button ${label}`);
//         }
//     };
// }

// const handlers = createButtonHandler('submit');
// handlers.onClick();
// handlers.onHover();



                        //  Higher order functions 
// function as an argument
// function applyOperation(a, b, operation) {
//     return operation(a, b);
// }

//     function add(x, y) {
//         return x + y;
//     }

//     function multiply(x, y) {
//         return x * y;
//     }
          

// console.log(applyOperation(2, 5, add));
// console.log(applyOperation(2, 5, multiply));


// function return a new function
// function greet(greetings) {
//     return function(name) {
//         return (`${greetings}, ${name}`);
//     }
// }

// const result = greet('Hello');
// console.log(result('Muhammad Shaban!'));



        // Task for multiplying the number to its original number 

// function makeMultiplier(n1) {
//     return function(n2) {
//         return n1 * n2;
//     }
// }

// const result = makeMultiplier(10);
// console.log(result(10));


                // Task for creat custom for each function of array 
// function customForEach(arr, callback) {
//     for(let i = 0; i < arr.length(); i++) {
//         callback(arr[i], i, arr);
//     }
// }

// const numbers = [1, 2, 3];
// numbers.forEach(num => console.log(num * 2));


// function compose(...functions) {
//     return function(value) {
//         return functions.reduceRight((acc, fn) => fn(acc), value);
//     };
// }

// //Task for composing the functions using reduceRight method of array
// const add = (x) => x + 2;
// const multiply = (x) => x * 3;

// const combinedFunction = compose(multiply, add);
// console.log(combinedFunction(5)); // Output: 21


// function compose(...functions) {
//     return function(value) {
//         return functions.reduceRight((acc, fn) => fn(acc), value);
//     }
// }

// const add = (x) => {
//     return x + 2;
// }

// const multiply = (x) => {
//     return x * 5;
// }

// const combinedFunctions = compose(multiply, add);
// console.log(combinedFunctions(10));


// Hllow wordl 




