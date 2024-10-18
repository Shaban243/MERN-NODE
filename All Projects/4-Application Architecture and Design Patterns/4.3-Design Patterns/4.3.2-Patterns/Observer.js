// The observer pattern is a behavioral pattern that defines one to many dependencies between objects. 
// It maintains a list of observers and provide notification to all its observers through the notification mechanism. 
// When one subject (Object) changes its state, all its observers or objects get notified about the state changes. 


// There are 4 key componens of observer pattern.
// 1 Subject  (interface)
// 2 Observer  (interface)
// 3 Concrete Subject (implements observer)
// 4 Concrete Observer (implements observer)


// Below java implementation of observer pattern 

// import java.util.List;
// import java.util.ArrayList;

// interface Observer{
//     void update(String weather);
// }

// interface Subject {
//     void addObserver(Observer observer);
//     void removeObserver(Observer observer);
//     void notifyObservers();
// }


// class WeatherStation implements Subject {
//     private String weather;
//     private List <Observer> observers = new ArrayList<> ();
    
//     public void addObserver(Observer observer) {
//         observers.add(observer);
//     }
    
//     public void removeObserver(Observer observer) {
//         observers.remove(observer);
//     }
    
//     public void notifyObservers() {
//     for(Observer observer: observers) {
//         observer.update(weather);
//     }
// }

//     public void setWeather(String newWeather) {
//         this.weather = newWeather;
//         notifyObservers();
//     }

// }


// class PhoneDisplay implements Observer {
//     private String weather;
    
//     public void update(String weather) {
//         this.weather = weather;
//         display();
//     }
    
//     public void display() {
//         System.out.println("PhoneDisplay shows weather updated: " + weather);
//     }
// }


// class TvDisplay implements Observer {
//     private String weather;
    
//     public void update(String weather) {
//         this.weather = weather;
//         display();
//     }
    
//     public void display() {
//         System.out.println("TvDsiplay show weather updated: " + weather);
//     }
// }


// public class weatherApp {
//     public static void  main(String [] args) {
        
//         WeatherStation weatherStation = new WeatherStation();
        
//         PhoneDisplay phoneDisplay = new PhoneDisplay();
//         TvDisplay tvDisplay = new TvDisplay();
        
//         weatherStation.addObserver(phoneDisplay);
//         weatherStation.addObserver(tvDisplay);
        
//         weatherStation.setWeather("Rainy");
        
//     }
// }