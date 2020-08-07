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

String IRCDEBUG = "IRC: DEBUG: ";

// qsort requires you to create a sort function
int sort_desc(const void *cmp1, const void *cmp2)
{
  // Need to cast the void * to unsigned long *
  unsigned long a = *((unsigned long *)cmp1);
  unsigned long b = *((unsigned long *)cmp2);
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

#define MAX_CAPTURE_ATTEMPTS 15

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
  Serial.println(IRCDEBUG + "storeCode() here01");
  codeType = results->decode_type;
  //  int count = results->rawlen;
  if (codeType == UNKNOWN) {
    Serial.println(IRCDEBUG + "storeCode() Received unknown code, saving as raw");
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
      Serial.print(IRCDEBUG + "storeCode() Received NEC: ");
      if (results->value == REPEAT) {
        // Don't record a NEC repeat value as that's useless.
        Serial.println(IRCDEBUG + "storeCode() repeat; ignoring.");
        codeType = UNKNOWN;
        return;
      }
    } else if (codeType == SONY) {
      Serial.print(IRCDEBUG + "storeCode() Received SONY: ");
    } else if (codeType == SAMSUNG) {
      Serial.print(IRCDEBUG + "storeCode() Received SAMSUNG: ");
    } else if (codeType == PANASONIC) {
      Serial.print(IRCDEBUG + "storeCode() Received PANASONIC: ");
    } else if (codeType == JVC) {
      Serial.print(IRCDEBUG + "storeCode() Received JVC: ");
    } else if (codeType == RC5) {
      Serial.print(IRCDEBUG + "storeCode() Received RC5: ");
    } else if (codeType == RC6) {
      Serial.print(IRCDEBUG + "storeCode() Received RC6: ");
    } else {
      Serial.print(IRCDEBUG + "storeCode() Unexpected codeType ");
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
      Serial.println(IRCDEBUG + "sendCode() Sent NEC repeat");
    } else {
      irsend.sendNEC(codeValue, codeLen);
      Serial.print(IRCDEBUG + "sendCode() Sent NEC ");
      Serial.println(codeValue, HEX);
    }
  } else if (codeType == SONY) {
    irsend.sendSony(codeValue, codeLen);
    Serial.print(IRCDEBUG + "sendCode() Sent Sony ");
    Serial.println(codeValue, HEX);
  } else if (codeType == PANASONIC) {
    irsend.sendPanasonic(codeValue, codeLen);
    Serial.print(IRCDEBUG + "sendCode() Sent Panasonic");
    Serial.println(codeValue, HEX);
  } else if (codeType == JVC) {
    irsend.sendJVC(codeValue, codeLen, false);
    Serial.print(IRCDEBUG + "sendCode() Sent JVC");
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
      Serial.print(IRCDEBUG + "sendCode() Sent RC5 ");
      Serial.println(codeValue, HEX);
      irsend.sendRC5(codeValue, codeLen);
    } else {
      irsend.sendRC6(codeValue, codeLen);
      Serial.print(IRCDEBUG + "sendCode() Sent RC6 ");
      Serial.println(codeValue, HEX);
    }
  } else if (codeType == UNKNOWN /* i.e. raw */) {
    // Assume 38 KHz
    irsend.sendRaw(rawCodes, codeLen, 38);
    Serial.println(IRCDEBUG + "sendCode() Sent raw");
  }
}

/*
   Return the number that occurs most frequently in an array.
   If a tie occurs return the first number in the list of ties.
   NOTE: The value zero (0) is not a valid number that may appear in the input array.
   As such, the value zero (0) is returned to indicate an error occurred.

   Input:
      arr - the input array. May not contain the value 0.
      n - the number of elements in the array
   Returns:
   0 - Empty array is passed as input
   Most frequent number in array otherwise.
*/
unsigned long getMostFrequentNumber(unsigned long arr[], unsigned int n)
{
  unsigned long uniqueNumbers[n]; // array of unique numbers
  int uniqueNumbersCount[n]; // frequency of earch unique number
  unsigned long retVal = 0; // defaults to an error occurred

  if (n <= 0) {
    return retVal;
  }

  int numUniqueNumbers = 1; // number of unique numbers


//  Serial.print(IRCDEBUG + "getMostFrequentNumber() n = ");
//  Serial.println(n);

  // Sort the input array
  qsort(arr, n, sizeof(arr[0]), sort_desc);

  for (int i = 0; i < n; i++) { // initialize working arrays
    uniqueNumbersCount[i] = 0;
    uniqueNumbers[i] = 0;
  }
  // Finding unique numbers
  uniqueNumbers[0] = arr[0]; // first entry has to be unique
  uniqueNumbersCount[0] = 1;
  for (int i = 1; i < n; i++) {
    if (arr[i] == arr[i - 1]) { // duplicate number
      uniqueNumbersCount[numUniqueNumbers - 1]++;
    }
    else { // we are seeing a new number
      numUniqueNumbers++;
      uniqueNumbers[numUniqueNumbers - 1] = arr[i];
      uniqueNumbersCount[numUniqueNumbers - 1]++;
    }
  } // end for

  //  for (int i = 0; i < numUniqueNumbers; i++) {
  //    Serial.print(IRCDEBUG + "getMostFrequentNumber() Count of number x");
  //    Serial.print(uniqueNumbers[i], HEX);
  //    Serial.print(" is ");
  //    Serial.println(uniqueNumbersCount[i]);
  //  }

  retVal = uniqueNumbers[0];
  for (int i = 1; i < numUniqueNumbers; i++) {
    if (uniqueNumbersCount[i] > uniqueNumbersCount[i - 1]) {
      retVal = uniqueNumbers[i];
    } // end if
  } // end for

  return retVal;
} // end getMostFrequentNumber()


//int codeTypesRaw[MAX_CAPTURE_ATTEMPTS]; // The code types
//unsigned int rawCodess[MAX_CAPTURE_ATTEMPTS][RAW_BUFFER_LENGTH]; // The durations if raw
//int codeLensRaw[MAX_CAPTURE_ATTEMPTS]; // The length of the code
//unsigned int numSignalsCapturedRaw; // how many raw signals did we actually capture

int getBestRawCodessIndex()
{
  int retVal = -1;

  return retVal;
  
} // end getBestRawCodessIndex()

int lastButtonState;

void loop()
{
  // If button pressed, send the code.
  int buttonState = digitalRead(SEND_BUTTON_PIN); // Button pin is active LOW
  if (lastButtonState == LOW && buttonState == HIGH)
  {
    Serial.println(IRCDEBUG + "loop() Released");
    irrecv.enableIRIn(); // Re-enable receiver
  }

  if (buttonState == LOW)
  {
    Serial.println(IRCDEBUG + "Pressed, sending");
    digitalWrite(STATUS_PIN, HIGH);
    sendCode(lastButtonState == buttonState);
    digitalWrite(STATUS_PIN, LOW);
    delay(50); // Wait a bit between retransmissions
  } else if (Serial.available() > 0)
  {
    //Serial.println("IRC: got here01");
    String data = Serial.readStringUntil('\n');
    if (data.equals("captureir"))
    {
      Serial.println(IRCDEBUG + "got here01");
      numSignalsCaptured = 0;
      numSignalsCapturedRaw = 0;
      for (int i = 0; i < MAX_CAPTURE_ATTEMPTS; i++)
      {
        if (irrecv.decode(&results))
        {
          //Serial.println(IRCDEBUG + "got here02");
          digitalWrite(STATUS_PIN, HIGH);
          storeCode(&results);
          digitalWrite(STATUS_PIN, LOW);

          Serial.print(IRCDEBUG + "Got IR signal: codeType=");
          Serial.println(codeType, DEC);

          if (codeType == UNKNOWN)
          {
            Serial.print("raw");
            Serial.print(" codeValue=?");
            for (int ndx = 0; ndx < codeLen; ndx++)
            {
              rawCodess[numSignalsCapturedRaw][ndx] = rawCodes[ndx];
              numSignalsCapturedRaw++;
            }
            codeTypesRaw[numSignalsCapturedRaw] = codeType;
            codeLensRaw[numSignalsCapturedRaw] = codeLen;
            numSignalsCapturedRaw++;
          }
          else
          {
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
        else
        { // else wait and try again
          Serial.println(IRCDEBUG + "wait 50ms and try again");
          delay(50);
        } // end if

      } // end for

      if ((numSignalsCaptured == 0) && (numSignalsCapturedRaw == 0))
      {
        Serial.println("IRC: No IR signal detected.");
      } // end if
      else
      { // we captured at least one signal
        if ((numSignalsCaptured > 0) && (numSignalsCaptured >= numSignalsCapturedRaw))
        { // prefer non-raw values over raw values
          for (int ndx = 0; ndx < numSignalsCaptured; ndx++)
          {
            Serial.print(IRCDEBUG + "Consensus IR Signal: codeType=");
            Serial.print(codeTypes[ndx], HEX);
            Serial.print(" codeValue=");
            Serial.print(codeValues[ndx], HEX);
            Serial.print(" codeLen=");
            Serial.println(codeLens[ndx], DEC);
          }
          unsigned long codeValueConsensus = getMostFrequentNumber(codeValues, numSignalsCaptured);
          Serial.print(IRCDEBUG + "Final consensus code value is: x");
          Serial.println(codeValueConsensus, HEX);
        }
        else
        { // more raw values than non-raw values
          int bestRawValuessIndex = getBestRawCodessIndex();
        }

      } // end else
    } // if (data.equals("captureir"))
  } // else if (Serial.available() > 0)

  lastButtonState = buttonState;
} // loop()
