#include <Servo.h> // This loads the library needed to control the servo
#include <DHT.h>

Servo myServo;  // Create a servo object to control your motor
Servo myServo2; // Create a servo object to control your motor

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // CRITICAL: Start the serial communication so Python can hear it!
  Serial.begin(9600);
  
  myServo.attach(9);  // Tells the Arduino that the servo is connected to Digital Pin 9
  myServo2.attach(7); // Tells the Arduino that the servo is connected to Digital Pin 7 (Updated comment)
  
  Serial.println("DHTxx test!");
  dht.begin();
}

void loop() {
  myServo.write(0);   // Tell the servo to go to the 0-degree position
  delay(1000);        // Wait for 1 second (1000 milliseconds)
  
  myServo2.write(0);  // Tell the servo to go to the 0-degree position
  delay(1000);        // Wait for 1 second (1000 milliseconds)

  delay(2000);        // Wait for 2 seconds for the DHT sensor

  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Fixed the semicolon and bracket placement here!
  if (isnan(humidity) || isnan(tempC)) {
    Serial.println("Error");
    return;
  }

  // Send the data over to Python
  Serial.print(tempC);
  Serial.print(",");
  Serial.println(humidity);
}
