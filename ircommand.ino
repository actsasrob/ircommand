/*
   IRrecord: record and play back IR signals as a minimal
   An IR detector/demodulator must be connected to the input RECV_PIN.
   An IR LED must be connected to the output PWM pin 3.
   A button must be connected between the input SEND_BUTTON_PIN and ground.
   A visible LED can be connected to STATUS_PIN to provide status.

   The logic is:
   If the button is pressed, send the IR code.
   If an IR code is received, record it.

   Version 0.11 September, 2009
   Copyright 2009 Ken Shirriff
   http://arcfn.com
*/

#include <IRremote.h>

#if defined(ESP32)
int IR_RECEIVE_PIN = 15;
int SEND_BUTTON_PIN = 16; // RX2 pin
#else
int IR_RECEIVE_PIN = 11;
int SEND_BUTTON_PIN = 12;
#endif
int STATUS_PIN = LED_BUILTIN;

IRrecv irrecv(IR_RECEIVE_PIN);
IRsend irsend;
decode_results results;

// On the Zero and others we switch explicitly to SerialUSB
#if defined(ARDUINO_ARCH_SAMD)
#define Serial SerialUSB
#endif

void setup() {
  Serial.begin(115200);
#if defined(__AVR_ATmega32U4__)
  while (!Serial); //delay for Leonardo, but this loops forever for Maple Serial
#endif
  // Just to know which program is running on my Arduino
  //Serial.println(F("START " __FILE__ " from " __DATE__));

  irrecv.enableIRIn(); // Start the receiver
  pinMode(SEND_BUTTON_PIN, INPUT_PULLUP);
  pinMode(STATUS_PIN, OUTPUT);

  //Serial.print(F("Ready to receive IR signals at pin "));
  //Serial.println(IR_RECEIVE_PIN);
  //Serial.print(F("Ready to send IR signals at pin "));
  //Serial.println(IR_SEND_PIN);
}

// Storage for the recorded code
int codeType = -1; // The type of code
unsigned long codeValue; // The code value if not raw
unsigned int rawCodes[RAW_BUFFER_LENGTH]; // The durations if raw
int codeLen; // The length of the code
int toggle = 0; // The RC5/6 toggle state

// Stores the code for later playback
// Most of this code is just logging
void storeCode(decode_results *results) {
  Serial.println("here in storeCode");
  codeType = results->decode_type;
  //  int count = results->rawlen;
  if (codeType == UNKNOWN) {
    Serial.println("Received unknown code, saving as raw");
    codeLen = results->rawlen - 1;
    // To store raw codes:
    // Drop first value (gap)
    // Convert from ticks to microseconds
    // Tweak marks shorter, and spaces longer to cancel out IR receiver distortion
    for (int i = 1; i <= codeLen; i++) {
      if (i % 2) {
        // Mark
        rawCodes[i - 1] = results->rawbuf[i] * MICROS_PER_TICK - MARK_EXCESS_MICROS;
        Serial.print(" m");
      } else {
        // Space
        rawCodes[i - 1] = results->rawbuf[i] * MICROS_PER_TICK + MARK_EXCESS_MICROS;
        Serial.print(" s");
      }
      Serial.print(rawCodes[i - 1], DEC);
    }
    Serial.println("");
  } else {
    if (codeType == NEC) {
      Serial.print("Received NEC: ");
      if (results->value == REPEAT) {
        // Don't record a NEC repeat value as that's useless.
        Serial.println("repeat; ignoring.");
        codeType = UNKNOWN;
        return;
      }
    } else if (codeType == SONY) {
      Serial.print("Received SONY: ");
    } else if (codeType == SAMSUNG) {
      Serial.print("Received SAMSUNG: ");
    } else if (codeType == PANASONIC) {
      Serial.print("Received PANASONIC: ");
    } else if (codeType == JVC) {
      Serial.print("Received JVC: ");
    } else if (codeType == RC5) {
      Serial.print("Received RC5: ");
    } else if (codeType == RC6) {
      Serial.print("Received RC6: ");
    } else {
      Serial.print("Unexpected codeType ");
      Serial.print(codeType, DEC);
      Serial.println("");
    }
    Serial.println(results->value, HEX);
    codeValue = results->value;
    codeLen = results->bits;
  }
}

void sendCode(int repeat) {
  if (codeType == NEC) {
    if (repeat) {
      irsend.sendNEC(REPEAT, codeLen);
      Serial.println("Sent NEC repeat");
    } else {
      irsend.sendNEC(codeValue, codeLen);
      Serial.print("Sent NEC ");
      Serial.println(codeValue, HEX);
    }
  } else if (codeType == SONY) {
    irsend.sendSony(codeValue, codeLen);
    Serial.print("Sent Sony ");
    Serial.println(codeValue, HEX);
  } else if (codeType == PANASONIC) {
    irsend.sendPanasonic(codeValue, codeLen);
    Serial.print("Sent Panasonic");
    Serial.println(codeValue, HEX);
  } else if (codeType == JVC) {
    irsend.sendJVC(codeValue, codeLen, false);
    Serial.print("Sent JVC");
    Serial.println(codeValue, HEX);
  } else if (codeType == RC5 || codeType == RC6) {
    if (!repeat) {
      // Flip the toggle bit for a new button press
      toggle = 1 - toggle;
    }
    // Put the toggle bit into the code to send
    codeValue = codeValue & ~(1 << (codeLen - 1));
    codeValue = codeValue | (toggle << (codeLen - 1));
    if (codeType == RC5) {
      Serial.print("Sent RC5 ");
      Serial.println(codeValue, HEX);
      irsend.sendRC5(codeValue, codeLen);
    } else {
      irsend.sendRC6(codeValue, codeLen);
      Serial.print("Sent RC6 ");
      Serial.println(codeValue, HEX);
    }
  } else if (codeType == UNKNOWN /* i.e. raw */) {
    // Assume 38 KHz
    irsend.sendRaw(rawCodes, codeLen, 38);
    Serial.println("Sent raw");
  }
}

int lastButtonState;

void loopKSdemo() {
  // If button pressed, send the code.
  int buttonState = digitalRead(SEND_BUTTON_PIN); // Button pin is active LOW
  if (lastButtonState == LOW && buttonState == HIGH) {
    Serial.println("Released");
    irrecv.enableIRIn(); // Re-enable receiver
  }

  if (buttonState == LOW) {
    Serial.println("Pressed, sending");
    digitalWrite(STATUS_PIN, HIGH);
    sendCode(lastButtonState == buttonState);
    digitalWrite(STATUS_PIN, LOW);
    delay(50); // Wait a bit between retransmissions
  } else if (irrecv.decode(&results)) {
    Serial.println("IRC: got here01");
    digitalWrite(STATUS_PIN, HIGH);
    storeCode(&results);
    irrecv.resume(); // resume receiver
    digitalWrite(STATUS_PIN, LOW);
  }
  lastButtonState = buttonState;
}

void loop() {
  // If button pressed, send the code.
  int buttonState = digitalRead(SEND_BUTTON_PIN); // Button pin is active LOW
  if (lastButtonState == LOW && buttonState == HIGH) {
    Serial.println("Released");
    irrecv.enableIRIn(); // Re-enable receiver
  }

  if (buttonState == LOW) {
    Serial.println("Pressed, sending");
    digitalWrite(STATUS_PIN, HIGH);
    sendCode(lastButtonState == buttonState);
    digitalWrite(STATUS_PIN, LOW);
    delay(50); // Wait a bit between retransmissions
  } else if (Serial.available() > 0) {
    Serial.println("IRC: got here01");
    String data = Serial.readStringUntil('\n');
    if (data.equals("captureir")) {
      Serial.println("IRC: got here02");
      //      if (irrecv.decode(&results)) {
      //        digitalWrite(STATUS_PIN, HIGH);
      //        storeCode(&results);
      //        irrecv.resume(); // resume receiver
      //        digitalWrite(STATUS_PIN, LOW);
      //      }
      for (int i = 0; i < 10; i++) {
        if (irrecv.decode(&results)) {
          Serial.println("IRC: got here01");
          digitalWrite(STATUS_PIN, HIGH);
          storeCode(&results);
          digitalWrite(STATUS_PIN, LOW);

          Serial.print("IRC: Got IR signal: codeType=");
          if (codeType == UNKNOWN) {
            Serial.print("raw");
            Serial.print(" codeValue=?");
          } else {
            Serial.print(codeType, HEX);
            Serial.print(" codeValue=");
            Serial.print(codeValue, HEX);
          }
          Serial.print(" codeLen=");
          Serial.println(codeLen, DEC);
          irrecv.resume(); // resume receiver
          break;
        } else {
          Serial.println("IRC: DEBUG: wait 50ms and try again");
          delay(50);
        }
        //Serial.println("IRC: No IR signal detected.");
      } // end for
    }

  }
  lastButtonState = buttonState;
} // loop()

void loopmain() {
  if (Serial.available() > 0) {
    //Serial.println("IRC: ready");
    String data = Serial.readStringUntil('\n');
    if (data.equals("captureir")) {
      irrecv.enableIRIn(); // Re-enable receiver
      for (int i = 0; i < 10; i++) {
        if (irrecv.decode(&results)) {
          Serial.println("IRC: got here01");
          digitalWrite(STATUS_PIN, HIGH);
          storeCode(&results);
          digitalWrite(STATUS_PIN, LOW);

          Serial.print("IRC: Got IR signal: codeType=");
          if (codeType == UNKNOWN) {
            Serial.print("raw");
            Serial.print(" codeValue=?");
          } else {
            Serial.print(codeType, HEX);
            Serial.print(" codeValue=");
            Serial.print(codeValue, HEX);
          }
          Serial.print(" codeLen=");
          Serial.println(codeLen, DEC);
          irrecv.resume(); // resume receiver
          break;
        } else {
          Serial.println("IRC: DEBUG: wait 50ms and try again");
          delay(50);
        }
        //Serial.println("IRC: No IR signal detected.");
      } // end for

    } else {
      Serial.println("IRC: Command not recognized");
    }
  }
} // loop()

void loop3() {
  Serial.println("IRC: inside loop");
  if (Serial.available() > 0) {
    Serial.println("IRC: serial available...");
    String data = Serial.readStringUntil('\n');
    Serial.print("You sent me: ");
    Serial.println(data);
    irrecv.enableIRIn(); // Re-enable receiver
    if (irrecv.decode(&results)) {
      Serial.println("IRC: got here01");
      storeCode(&results);

      Serial.print("IRC: Got IR signal: codeType=");
      if (codeType == UNKNOWN) {
        Serial.print("raw");
        Serial.print(" codeValue=?");
      } else {
        Serial.print(codeType, HEX);
        Serial.print(" codeValue=");
        Serial.print(codeValue, HEX);
      }
    }
    delay(50);
  }
} // loop()
