/*
 * A simple sketch that maps a single pin on the ESP32 to a single button on the controller
 */

#include <Arduino.h>
#include <BleGamepad.h>  // https://github.com/lemmingDev/ESP32-BLE-Gamepad

#define LED_BUILTIN 2
#define BUTTONPIN 23  // Pin button is attached to


BleGamepad bleGamepad("Manette X", "Lemonware", 100);

int previousButton1State = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTONPIN, INPUT_PULLDOWN);
  pinMode(LED_BUILTIN, OUTPUT);

  digitalWrite(LED_BUILTIN, HIGH);
  bleGamepad.begin();
}

void loop() {
  if (!bleGamepad.isConnected()) {
    Serial.println("Gamepad not connected...");
    return;
  }

  int currentButton1State = digitalRead(BUTTONPIN);
  Serial.print("current button state : ");
  Serial.println(currentButton1State);

  if (currentButton1State != previousButton1State) {
    if (currentButton1State == LOW) {
      Serial.println("Boutton 1 pressed");
      bleGamepad.press(BUTTON_1);
    } else {
      Serial.println("Boutton 1 released");
      bleGamepad.release(BUTTON_1);
    }
  }
  previousButton1State = currentButton1State;
}