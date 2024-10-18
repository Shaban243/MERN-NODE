//  This is a creational design pattern that creates an object of concrete classes without exposing creation logic to the client. 
//  In this pattern, shape is an interface with draw method declaration.
//  The concrete classes (circle, square, rectangle) will implement interface methods.
//  Then, create a factoryShape class to generate the instances of concrete classes of type shape. 
//  Then, create the factorypatterndemo class and in that class, using entry point method (main) of java, create the instance of factoryShape class and by using this instance we're getting the types of concrete classes and calling its relevant draw method.

// Below, java imlementation of factory pattern 

// interface shape {
//     void draw();
// }

// public class Circle implements shape {
    
//     public void draw() {
//         System.out.println("shape method is override by circle class!");
//     }
// }

// public class Square implements shape {
    
//     public void draw() {
//     System.out.println("Shape method is override by square class!");
//     }
// }


// public class Rectangle implements shape {
    
//     public void draw() {
//         System.out.println("Shape method is override by rectangle class!");
//     }
// }


// public class FactoryShape {
    
//     public shape getShape(String shapeType) {
//         if(shapeType == null) {
//             return null;
//         }
        
//         if(shapeType.ignoreCase("Circle")) {
//             return new Cicle();
            
//         } else if(shapeType.ignoreCase("Square")) {
//             return new Square();
            
//         } else if(shapeType.ignoreCase("Rectangle")) {
//             return new Rectangle();
//         }
        
//         return null;
//     }
// }


// public class FactoryPatternDemo {
    
//     public static void main(String [] args) {
        
//         FactoryShape factoryShape = new FactoryShape();
        
//         Shape shape1 = factoryShape.getShape("Circle");
//         shape1.draw();
        
//         Shape shape2 = factoryShape.getShape("Square");
//         shape2.draw();
        
//         Shape shape3 = factoryShape.getShape("Rectangle");
//         shape3.draw();
//     }
// }