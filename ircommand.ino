/*
   Much credit to Ken Shirriff. The bulk of this code adapted from https://github.com/z3t0/Arduino-IRremote/blob/master/examples/IRrecord/IRrecord.ino

   ircommand: Record an IR signal when tasked via the serial USB port. Return IR signal via serial USB port.
              Send IR signal when tasked via the serial USB port.

   An IR detector/demodulator must be connected to the input RECV_PIN.
   An IR LED must be connected to the output PWM pin 3.
   A button must be connected between the input SEND_BUTTON_PIN and ground.
   A visible LED can be connected to STATUS_PIN to provide status.

   With the proper circuit attached you can also:
   If the button is pressed, send the IR code.
   If an IR code is received, record it.

   Version 0.1 August 2020
   Copyright 2020 Rob Hughes
   http://robhughes.net
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

// qsort requires you to create a sort function
int sort_desc(const void *cmp1, const void *cmp2)
{
  // Need to cast the void * to int *
  int a = *((int *)cmp1);
  int b = *((int *)cmp2);
  // The comparison
  return a > b ? -1 : (a < b ? 1 : 0);
  // A simpler, probably faster way:
  //return b - a;
}

void setup() {
  Serial.begin(115200);
#if defined(__AVR_ATmega32U4__)
  while (!Serial); //delay for Leonardo, but this loops forever for Maple Serial
#endif
  // Just to know which program is running on my Arduino
  Serial.println(F("START " __FILE__ " from " __DATE__));

  irrecv.enableIRIn(); // Start the receiver
  pinMode(SEND_BUTTON_PIN, INPUT_PULLUP);
  pinMode(STATUS_PIN, OUTPUT);

  Serial.print(F("Ready to receive IR signals at pin "));
  Serial.println(IR_RECEIVE_PIN);
  Serial.print(F("Ready to send IR signals at pin "));
  Serial.println(IR_SEND_PIN);

  // The array
  int lt[6] = {35, 15, 80, 2, 40, 110};
  // Number of items in the array
  int lt_length = sizeof(lt) / sizeof(lt[0]);
  // qsort - last parameter is a function pointer to the sort function
  qsort(lt, lt_length, sizeof(lt[0]), sort_desc);
  // lt is now sorted
}

// Storage for the recorded code
int codeType = -1; // The type of code
unsigned long codeValue; // The code value if not raw
unsigned int rawCodes[RAW_BUFFER_LENGTH]; // The durations if raw
int codeLen; // The length of the code
int toggle = 0; // The RC5/6 toggle state

#define MAX_CAPTURE_ATTEMPTS 20

// For various reasons attempting to continuously capture the same IR signal over a short period of time
// may result in different IR signals being recognized. We will capture up to MAX_CAPTURE_ATTEMPTS signals
// and then look for the most recognized signal to achieve consensus and use that as the final IR signal
// to return to the caller

// Vars to record various IR signal captures to get consensus
int codeTypes[MAX_CAPTURE_ATTEMPTS]; // The code types
unsigned long codeValues[MAX_CAPTURE_ATTEMPTS]; // The code value if not raw
int codeLens[MAX_CAPTURE_ATTEMPTS]; // The length of the code
unsigned int numSignalsCaptured; // how many signals did we actually capture

int codeTypesRaw[MAX_CAPTURE_ATTEMPTS]; // The code types
unsigned int rawCodess[MAX_CAPTURE_ATTEMPTS][RAW_BUFFER_LENGTH]; // The durations if raw
int codeLensRaw[MAX_CAPTURE_ATTEMPTS]; // The length of the code
unsigned int numSignalsCapturedRaw; // how many raw signals did we actually capture

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

int getMostFrequentNumber(unsigned long arr[], unsigned int n)
{
  unsigned long uniqueNumbers[n]; // array of unique numbers
  int uniqueNumbersCount[n]; // frequency of earch unique number

  if (n <= 0) {
    return 0;
  }

  int numUniqueNumbers = 1; // number of unique numbers

  // NOTE: in the below logic 0 should never be a valid unique number
  // Sorting the given array
  int arr_length = *(&arr + 1) - arr;
  //int arr_length = sizeof(arr) / sizeof(arr[0]);
  // qsort - last parameter is a function pointer to the sort function

  Serial.print("IRC: DEBUG: unique_number(): arr_length = ");
  Serial.println(arr_length);
  
  qsort(arr, arr_length, sizeof(arr[0]), sort_desc);

  for (int i = 0; i < n; i++) { // initialize working arrays
    uniqueNumbersCount[i] = 0;
    uniqueNumbers[i] = 0;
  }
  // Finding unique numbers
  uniqueNumbers[0] = arr[0]; // first entry has to be unique
  uniqueNumbersCount[0] = 1;
  for (int i = 0; i < n; i++) {
    if (arr[i] == arr[i + 1]) { // duplicate number
      uniqueNumbersCount[numUniqueNumbers - 1]++;
    }
    else { // we are seeing a new number
      numUniqueNumbers++;
      uniqueNumbers[numUniqueNumbers - 1] = arr[i + 1];
      uniqueNumbersCount[numUniqueNumbers - 1]++;
    }
  } // end for

  for (int i = 0; i < numUniqueNumbers; i++) {
    Serial.print("IRC: DEBUG: Count of number ");
    Serial.print(uniqueNumbers[i], HEX);
    Serial.print(" is ");
    Serial.println(uniqueNumbersCount[i]);
  }
  
  return uniqueNumbers[0];
} // end unique_number()

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
    //Serial.println("IRC: got here01");
    String data = Serial.readStringUntil('\n');
    if (data.equals("captureir")) {
      Serial.println("IRC: got here01");
      numSignalsCaptured = 0;
      numSignalsCapturedRaw = 0;
      for (int i = 0; i < MAX_CAPTURE_ATTEMPTS; i++) {
        if (irrecv.decode(&results)) {
          //Serial.println("IRC: got here02");
          digitalWrite(STATUS_PIN, HIGH);
          storeCode(&results);
          digitalWrite(STATUS_PIN, LOW);

          Serial.print("IRC: Got IR signal: codeType=");
          Serial.println(codeType, DEC);

          if (codeType == UNKNOWN) {
            Serial.print("raw");
            Serial.print(" codeValue=?");
            for (int ndx = 0; ndx < codeLen; ndx++) {
              rawCodess[numSignalsCapturedRaw][ndx] = rawCodes[ndx];
              numSignalsCapturedRaw++;
            }
            codeTypesRaw[numSignalsCapturedRaw] = codeType;
            codeLensRaw[numSignalsCapturedRaw] = codeLen;
            numSignalsCapturedRaw++;
          } else {
            Serial.print(codeType, HEX);
            Serial.print(" codeValue=");
            Serial.print(codeValue, HEX);
            codeValues[numSignalsCaptured] = codeValue;
            codeTypes[numSignalsCaptured] = codeType;
            codeLens[numSignalsCaptured] = codeLen;
            numSignalsCaptured++;
          }
          Serial.print(" codeLen=");
          Serial.println(codeLen, DEC);

          irrecv.resume(); // resume receiver
        } // if we got an IR signal
        else { // else wait and try again
          Serial.println("IRC: DEBUG: wait 50ms and try again");
          delay(50);
        } // end if

      } // end for

      if ((numSignalsCaptured == 0) && (numSignalsCapturedRaw == 0)) {
        Serial.println("IRC: No IR signal detected.");
      } // end if
      else { // we captured at least one signal
        if (numSignalsCaptured > 0) {
          for (int ndx = 0; ndx < numSignalsCaptured; ndx++) {
            Serial.print("IRC: DEBUG: Consensus IR Signal: codeType=");
            Serial.print(codeTypes[ndx], HEX);
            Serial.print(" codeValue=");
            Serial.print(codeValues[ndx], HEX);
            Serial.print(" codeLen=");
            Serial.println(codeLens[ndx], DEC);
          }
          int codeValueConsensus = getMostFrequentNumber(codeValues, numSignalsCaptured);
          Serial.print("IRC: DEBUG: Final consensus code value is: ");
          Serial.println(codeValueConsensus);
        } // if at least one non-raw value

      } // end else
    } // if (data.equals("captureir"))
  } // else if (Serial.available() > 0)

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
