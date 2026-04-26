#include <Servo.h>

Servo panServo;
Servo panServo2;
int panPosition = 90; // Start looking straight ahead

// Variable to store our current mode, starting in Mode 1
int currentMode = 1; 

void setup() {
  // Bring back the Serial Monitor
  Serial.begin(9600); 

  panServo.attach(9);
  panServo2.attach(10);
  
  pinMode(A0, INPUT_PULLUP); // Left LDR
  pinMode(A1, INPUT_PULLUP); // Right LDR

  // Print instructions to the Serial Monitor when the Arduino turns on
  Serial.println("System Ready!");
  Serial.println("Type 1: Sun Tracking | Type 2: Rain Shield (90 deg) | Type 3: Open Roof (0 deg)");
}

void loop() {
  // --- 1. CHECK FOR REMOTE CONTROL INPUT ---
  // Read the Serial Monitor to see if you typed 1, 2, or 3
  if (Serial.available() > 0) {
    char incomingCommand = Serial.read();
    
    if (incomingCommand == '1') {
      currentMode = 1;
      Serial.println("--> Switched to Mode 1: SUN TRACKING");
    } 
    else if (incomingCommand == '2') {
      currentMode = 2;
      Serial.println("--> Switched to Mode 2: RAIN SHIELD (90 Degrees)");
    } 
    else if (incomingCommand == '3') {
      currentMode = 3;
      Serial.println("--> Switched to Mode 3: OPEN ROOF (0 Degrees)");
    }
  }

  // --- 2. EXECUTE THE CURRENT MODE ---
  
  if (currentMode == 1) {
    // MODE 1: SUN TRACKING
    int leftLight = analogRead(A0);
    int rightLight = analogRead(A1);

    // Print the values so you can watch them live
    Serial.print("Left: "); Serial.print(leftLight);
    Serial.print(" | Right: "); Serial.println(rightLight);

    // --- REVERSED LOGIC ---
    if (rightLight > leftLight) {
      panPosition = panPosition - 1; 
    }
    else if (leftLight > rightLight) {
      panPosition = panPosition + 1; 
    }
  } 
  else if (currentMode == 2) {
    // MODE 2: RAIN SHIELD
    // Lock the position to 90 degrees
    panPosition = 90;
  } 
  else if (currentMode == 3) {
    // MODE 3: OPEN ROOF
    // Lock the position to 0 degrees
    panPosition = 0;
  }

  // --- 3. MOVE BOTH SERVOS ---
  // Prevent the servos from trying to spin past their physical limits
  if (panPosition > 180) { panPosition = 180; }
  if (panPosition < 0) { panPosition = 0; }
  
  // Tell both servos to update their position
  panServo.write(panPosition);
  panServo2.write(panPosition);

  // A tiny pause so the motors actually have time to move
  delay(20); 
}