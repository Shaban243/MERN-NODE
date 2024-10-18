const Singleton = (function () {
    let instance;

    //constructor
    function Singleton() {
        if(instance) {
            throw new Error('Singleton instance already exist, call get instance method!');
        }
        this.data = Math.random();
    };

        // Get instance method
        Singleton.getInstance = function() {
            if(!instance) {
                instance = new Singleton();
            }
            return instance;
        };

        Singleton.prototype.clone = function() {
            throw new Error('Cloning of singleton instance is not allowed!');
        };

        Singleton.prototype.customDeserialize = function() {
            throw new Error('Deserialization of singleton instance is not allowed!');
        };


        // JSON.parse reviver function to prevent deserialization 
        function revive(key, value) {
            if(key === ' ' && value && value.__isSingleton) {
                return instance;
            }
            return value;
        };


        Singleton.prototype.toJSON = function() {
            return JSON.stringify({ __isSingleton: true, data: this.data});
        };

        return Singleton;

}) ();


// Usage of Singleton

try {
    const singletonInstance1 = Singleton.getInstance();
    console.log(singletonInstance1);

    const singletonInstance2 = new Singleton();
    console.log(singletonInstance2);
} catch (error) {
    console.error(error.message);
}



// Attempt to cloned the singleton instance
try {
    const clonedInstance = Object.create(singletonInstance1);
    console.log(clonedInstance);
} catch (error) {
    console.error(error.message);
}



// Attempt to serialized the singletonInstance
try {
    const seriliazedInstance = JSON.stringify(singletonInstance1);
    console.log(seriliazedInstance);
} catch (error) {
    console.error(error.message);
}


// Attempt to deserialize the singletonIntance1
try {
    const jsonString = JSON.stringify(singletonInstance1);
    const deserializedInstance = JSON.parse(jsonString, revive)
    console.log(deserializedInstance);
} catch (error) {
    console.error(error.message);
}




// Theory:
// The singleton pattern is a creational desing pattern that has only one instance to that class and provide a global point of access to it throught the application. 
// Singleton pattern is used in many real life applications and is useful for many scanerios like sharing single database connection to all the objects, network issues and thread pools. 
// It has following properties:
// It has private static instance
// It has private constructor
// It has public static method of getInstance, this method checks that if the instance is already created, then it will throw a new error or exception. Otherwise, it returns an existing instance.
