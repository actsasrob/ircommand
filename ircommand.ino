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

/* TODO:

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

String IRCDBG = "IRC: DEBUG: ";
// Request strings
String CAPTUREIR = "captureir"; // capture an IR signal and return via Serial port
String SENDIR = "sendir"; // send IR signal received from caller

// Response string
String NO_IR_SIGNAL_DETECTED = "IRC: captureirresponse: No IR signal detected.";
String IRC_CAPTURE_IR_RESPONSE_PREFIX = "IRC: captureirresponse: codeType=";

/**
   Set IRCDBG to 1 for debug output. 0 to disable debug output
*/
#define IRCDEBUG  1

#if IRCDEBUG
#  define IRCDEBUG_PRINT(...)    Serial.print(__VA_ARGS__)
#  define IRCDEBUG_PRINTLN(...)  Serial.println(__VA_ARGS__)
#else
/**
   If IRCDEBUG, print the arguments, otherwise do nothing.
*/
#  define IRCDEBUG_PRINT(...) void()
/**
   If IRCDEBUG, print the arguments as a line, otherwise do nothing.
*/
#  define IRCDEBUG_PRINTLN(...) void()
#endif

// qsort requires you to create a sort function
int sort_desc(const void *cmp1, const void *cmp2)
{
  // Need to cast the void * to unsigned long *
  unsigned long a = *((unsigned long *)cmp1);
  unsigned long b = *((unsigned long *)cmp2);
  // The comparison
  return a > b ? -1 : (a < b ? 1 : 0);
}

/*
   Utility function to get next numeric substring from input string starting at startIndex.
   Note: Will not recognize negative numbers. Will only handle numbers in the range 0 - 2,147,483,647
         that can be returned as a long. Numbers containing commas will be treated as separate numbers
   Inputs:
     String str - The source string
     int startIndex - zero-based index where to start looking for next numeric substring
     int *lastIndex - pointer to var containing last index used to search for numeric chars
                      i.e. upon function return it will be the index of the first char after the last numeric
                           sequence found or will equal the length of the input string indicating the entire
                           string has been searched
   Returns:
     -1 - no numeric substring was found
     long number - the next numeric substring converted to long
*/
long getNextNumberFromString(String str, int startIndex, int *lastIndex)
{
  long retVal = -1; // default to no numeric substring found
  String workString = "";
  *lastIndex = startIndex;
  int strLength = str.length();
  int stage = 0; // 0 - looking for first numeric char, 1 - found numeric string

  while (*lastIndex < strLength)
  {
    String tmpString = str.substring(*lastIndex, *lastIndex + 1);
    *lastIndex = *lastIndex + 1;

    if (tmpString >= "0" && tmpString <= "9") // numeric char found
    {
      if (stage == 0) // move to stage 1 and start keeping chars
      {
        stage = 1;
      } // end if
      workString += tmpString;
    }
    else // non-numeric char found
    {
      if (stage == 1) // we found the entire numeric string
      {
        break;
      } // end if
    } // end else

  } // end while

  if (workString.length() > 0)
  {
    char tmpBuf[11];
    workString.toCharArray(tmpBuf, 11);
    retVal = atol(tmpBuf);
  } // end if

  return retVal;
} // end getNextNumberFromString()

void setup() {
  Serial.begin(115200);
#if defined(__AVR_ATmega32U4__)
  while (!Serial); //delay for Leonardo, but this loops forever for Maple Serial
#endif
  // Just to know which program is running on my Arduino
  IRCDEBUG_PRINTLN(IRCDBG + F("START " __FILE__ " from " __DATE__));

  irrecv.enableIRIn(); // Start the receiver
  pinMode(SEND_BUTTON_PIN, INPUT_PULLUP);
  pinMode(STATUS_PIN, OUTPUT);

  IRCDEBUG_PRINT(IRCDBG + F("Ready to receive IR signals at pin "));
  IRCDEBUG_PRINTLN(IR_RECEIVE_PIN);
  IRCDEBUG_PRINT(IRCDBG + F("Ready to send IR signals at pin "));
  IRCDEBUG_PRINTLN(IR_SEND_PIN);

  // "sendir codeType=4 codeLen=20 codeValue=691090"
  // "012345678901234567890123456789
  //  String data = "sendir codeType=4 codeLen=20 codeValue=691090";
  //  int lastIndex;
  //  int theCodeType = getNextNumberFromString(data, 16, &lastIndex);
  //  IRCDEBUG_PRINT(IRCDBG + "setup() theCodeType=");
  //  IRCDEBUG_PRINTLN(theCodeType);
  //  int theCodeLen = getNextNumberFromString(data, lastIndex, &lastIndex);
  //  IRCDEBUG_PRINT(IRCDBG + "setup() theCodeLen=");
  //  IRCDEBUG_PRINTLN(theCodeLen);
  //  unsigned long theCodeValue = getNextNumberFromString(data, lastIndex, &lastIndex);
  //  IRCDEBUG_PRINT(IRCDBG + "setup() theCodeValue=");
  //  IRCDEBUG_PRINTLN(theCodeValue);
//  String data = "sendir codeType=-1 codeLen=67 rawCodes=8800 4600 400 700 400 1800 450 700 350 800 350 1850 400 650 450 1800 400 1850 400 1800 400 750 400 1850 350 1850 400 700 400 1800 400 1800 450 700 400 750 350 1850 350 1850 400 750 400 1800 400 700 400 700 450 700 400 1850 350 750 400 700 400 1800 400 700 400 1850 400 1800 450 1800 400";
//  int lastIndex;
//  theCodeType = UNKNOWN;
//  IRCDEBUG_PRINT(IRCDBG + "setup() sendir raw processing theCodeType=");
//  IRCDEBUG_PRINTLN(theCodeType);
//  theCodeLen = getNextNumberFromString(data, 27, &lastIndex);
//  IRCDEBUG_PRINT(IRCDBG + "setup() sendir raw processing theCodeLen=");
//  IRCDEBUG_PRINTLN(theCodeLen);
//  IRCDEBUG_PRINT(IRCDBG + "loop() sendir raw processing rawCodes=");
//  for (int ndx = 0; ndx < codeLen; ndx++)
//  {
//    /*rawCodes[ndx]*/ theRawCode = getNextNumberFromString(data, lastIndex, &lastIndex);
//    IRCDEBUG_PRINT(theRawCode);
//    IRCDEBUG_PRINT(" ");
//  }
//  IRCDEBUG_PRINTLN();
}

// Storage for the recorded code
int codeType = -1; // The type of code
unsigned long codeValue; // The code value if not raw
unsigned int rawCodes[RAW_BUFFER_LENGTH]; // The durations if raw
int codeLen; // The length of the code
int toggle = 0; // The RC5/6 toggle state

#define MAX_CAPTURE_ATTEMPTS 10

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
void storeCode(decode_results * results) {
  IRCDEBUG_PRINTLN(IRCDBG + "storeCode() here01");
  codeType = results->decode_type;
  //  int count = results->rawlen;
  if (codeType == UNKNOWN) {
    IRCDEBUG_PRINTLN(IRCDBG + "storeCode() Received unknown code, saving as raw");
    codeLen = results->rawlen - 1;
    // To store raw codes:
    // Drop first value (gap)
    // Convert from ticks to microseconds
    // Tweak marks shorter, and spaces longer to cancel out IR receiver distortion
    for (int i = 1; i <= codeLen; i++) {
      if (i % 2) {
        // Mark
        rawCodes[i - 1] = results->rawbuf[i] * MICROS_PER_TICK - MARK_EXCESS_MICROS;
        IRCDEBUG_PRINT(" m");
      } else {
        // Space
        rawCodes[i - 1] = results->rawbuf[i] * MICROS_PER_TICK + MARK_EXCESS_MICROS;
        IRCDEBUG_PRINT(" s");
      }
      IRCDEBUG_PRINT(rawCodes[i - 1], DEC);
    }
    IRCDEBUG_PRINTLN("");
  } else {
    if (codeType == NEC) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received NEC: ");
      if (results->value == REPEAT) {
        // Don't record a NEC repeat value as that's useless.
        IRCDEBUG_PRINTLN(IRCDBG + "storeCode() repeat; ignoring.");
        codeType = UNKNOWN;
        return;
      }
    } else if (codeType == SONY) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received SONY: ");
    } else if (codeType == SAMSUNG) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received SAMSUNG: ");
    } else if (codeType == PANASONIC) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received PANASONIC: ");
    } else if (codeType == JVC) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received JVC: ");
    } else if (codeType == RC5) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received RC5: ");
    } else if (codeType == RC6) {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Received RC6: ");
    } else {
      IRCDEBUG_PRINT(IRCDBG + "storeCode() Unexpected codeType ");
      IRCDEBUG_PRINT(codeType, DEC);
      IRCDEBUG_PRINTLN("");
    }
    IRCDEBUG_PRINTLN(results->value, HEX);
    codeValue = results->value;
    codeLen = results->bits;
  }
}

void sendCode(int repeat) {
  if (codeType == NEC) {
    if (repeat) {
      irsend.sendNEC(REPEAT, codeLen);
      IRCDEBUG_PRINTLN(IRCDBG + "sendCode() Sent NEC repeat");
    } else {
      irsend.sendNEC(codeValue, codeLen);
      IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent NEC ");
      IRCDEBUG_PRINT(codeValue, HEX);
    }
  } else if (codeType == SONY) {
    irsend.sendSony(codeValue, codeLen);
    IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent Sony ");
    IRCDEBUG_PRINTLN(codeValue, HEX);
  } else if (codeType == PANASONIC) {
    irsend.sendPanasonic(codeValue, codeLen);
    IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent Panasonic");
    IRCDEBUG_PRINTLN(codeValue, HEX);
  } else if (codeType == JVC) {
    irsend.sendJVC(codeValue, codeLen, false);
    IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent JVC");
    IRCDEBUG_PRINTLN(codeValue, HEX);
  } else if (codeType == RC5 || codeType == RC6) {
    if (!repeat) {
      // Flip the toggle bit for a new button press
      toggle = 1 - toggle;
    }
    // Put the toggle bit into the code to send
    codeValue = codeValue & ~(1 << (codeLen - 1));
    codeValue = codeValue | (toggle << (codeLen - 1));
    if (codeType == RC5) {
      IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent RC5 ");
      IRCDEBUG_PRINTLN(codeValue, HEX);
      irsend.sendRC5(codeValue, codeLen);
    } else {
      irsend.sendRC6(codeValue, codeLen);
      IRCDEBUG_PRINT(IRCDBG + "sendCode() Sent RC6 ");
      IRCDEBUG_PRINTLN(codeValue, HEX);
    }
  } else if (codeType == UNKNOWN /* i.e. raw */) {
    // Assume 38 KHz
    irsend.sendRaw(rawCodes, codeLen, 38);
    IRCDEBUG_PRINTLN(IRCDBG + "sendCode() Sent raw");
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
  int uniqueNumbersCount[n]; // frequency of each unique number
  unsigned long retVal = 0; // defaults to an error occurred

  if (n <= 0) {
    return retVal;
  }

  int numUniqueNumbers = 1; // number of unique numbers


  //  IRCDEBUG_PRINT(IRCDBG + "getMostFrequentNumber() n = ");
  //  IRCDEBUG_PRINTLN(n);

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
  //    IRCDEBUG_PRINT(IRCDBG + "getMostFrequentNumber() Count of number x");
  //    IRCDEBUG_PRINT(uniqueNumbers[i], HEX);
  //    IRCDEBUG_PRINT(" is ");
  //    IRCDEBUG_PRINTLN(uniqueNumbersCount[i]);
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

/*
   Utility function to find the best raw IR signal from the captured signals
   TODO: Needs to be implemented. There seems to be an issue with the IRremote library where the last IR signal captured
   on previous capture attempts is returned as the first IR signal on the next IR capture attempt. Possibly the signal remains
   in a buffer somewhere. As a workaround, return the last captured signal to atleast avoid the first signal when possible
*/
int getBestRawCodessIndex()
{
  int retVal = numSignalsCapturedRaw - 1;

  return retVal;

} // end getBestRawCodessIndex()

int lastButtonState;

void loop()
{
  // If button pressed, send the code.
  int buttonState = digitalRead(SEND_BUTTON_PIN); // Button pin is active LOW
  if (lastButtonState == LOW && buttonState == HIGH)
  {
    IRCDEBUG_PRINTLN(IRCDBG + "loop() Released");
    irrecv.enableIRIn(); // Re-enable receiver
  }

  if (buttonState == LOW)
  {
    IRCDEBUG_PRINTLN(IRCDBG + "loop() Pressed, sending");
    digitalWrite(STATUS_PIN, HIGH);
    sendCode(lastButtonState == buttonState);
    digitalWrite(STATUS_PIN, LOW);
    delay(50); // Wait a bit between retransmissions
  } else if (Serial.available() > 0)
  {
    //IRCDEBUG_PRINTLN("IRC: got here01");
    String data = Serial.readStringUntil('\n');
    if (data.equals(CAPTUREIR))
    {
      //IRCDEBUG_PRINTLN(IRCDBG + " loop() got here02");
      numSignalsCaptured = 0;
      numSignalsCapturedRaw = 0;
      for (int i = 0; i < MAX_CAPTURE_ATTEMPTS; i++)
      {
        if (irrecv.decode(&results))
        {
          //IRCDEBUG_PRINTLN(IRCDBG + " loop() got here03");
          digitalWrite(STATUS_PIN, HIGH);
          storeCode(&results);
          digitalWrite(STATUS_PIN, LOW);

          //IRCDEBUG_PRINT(IRCDBG + " loop() Got IR signal: codeType=");
          //IRCDEBUG_PRINTLN(codeType, DEC);

          if (codeType == -1)
          {
            IRCDEBUG_PRINT(IRCDBG + " loop() codeType=raw");
            IRCDEBUG_PRINT(" codeLen=");
            IRCDEBUG_PRINTLN(codeLen, DEC);
            for (int ndx = 0; ndx < codeLen; ndx++)
            {
              rawCodess[numSignalsCapturedRaw][ndx] = rawCodes[ndx];
            }
            codeTypesRaw[numSignalsCapturedRaw] = codeType;
            codeLensRaw[numSignalsCapturedRaw] = codeLen;
            numSignalsCapturedRaw++;
          }
          else
          {
            IRCDEBUG_PRINT(IRCDBG + " loop() codeType=");
            IRCDEBUG_PRINT(codeType, HEX);
            IRCDEBUG_PRINT(" codeValue=");
            IRCDEBUG_PRINT(codeValue, HEX);
            IRCDEBUG_PRINT(" codeLen=");
            IRCDEBUG_PRINTLN(codeLen, DEC);
            codeValues[numSignalsCaptured] = codeValue;
            codeTypes[numSignalsCaptured] = codeType;
            codeLens[numSignalsCaptured] = codeLen;
            numSignalsCaptured++;
          }

          irrecv.resume(); // resume receiver
        } // if we got an IR signal
        else
        { // else wait and try again
          IRCDEBUG_PRINTLN(IRCDBG + "wait 50ms and try again");
          delay(50);
        } // end if

      } // end for

      if ((numSignalsCaptured == 0) && (numSignalsCapturedRaw == 0))
      {
        IRCDEBUG_PRINTLN(NO_IR_SIGNAL_DETECTED);
      } // end if
      else
      { // we captured at least one signal
        if ((numSignalsCaptured > 0) && (numSignalsCaptured >= numSignalsCapturedRaw))
        { // prefer non-raw values over raw values
          for (int ndx = 0; ndx < numSignalsCaptured; ndx++)
          {
            IRCDEBUG_PRINT(IRCDBG + " loop() Candidate:1 IR Signal: codeType=");
            IRCDEBUG_PRINT(codeTypes[ndx], HEX);
            IRCDEBUG_PRINT(" codeValue=");
            IRCDEBUG_PRINT(codeValues[ndx], HEX);
            IRCDEBUG_PRINT(" codeLen=");
            IRCDEBUG_PRINTLN(codeLens[ndx], DEC);
          }
          unsigned long codeValueConsensus = getMostFrequentNumber(codeValues, numSignalsCaptured);
          if (codeValueConsensus == 0) // something went wrong
          {
            IRCDEBUG_PRINTLN(NO_IR_SIGNAL_DETECTED);
          }
          else // we have a final consensus value
          {
            IRCDEBUG_PRINT(IRCDBG + " loop() Final consensus code value is: x");
            IRCDEBUG_PRINTLN(codeValueConsensus, HEX);
            // look up first matching code value in list of captured IR signals to get code type and length
            for (int ndx = 0; ndx < numSignalsCaptured; ndx++)
            {
              if (codeValues[ndx] == codeValueConsensus)
              {
                codeValue = codeValueConsensus;
                codeType = codeTypes[ndx];
                codeLen = codeLens[ndx];
                //                String ircresponse = "";
                //                ircresponse = "IRC: captureirresponse: codeType=" + codeType;
                //                ircresponse = ircresponse + " codeLen=" + codeLen;
                //                ircresponse = ircresponse + " codeValue=" + codeValue;
                //                Serial.println(ircresponse);

                Serial.print("IRC: captureirresponse: codeType=");
                Serial.print(codeType);
                Serial.print(" codeLen=");
                Serial.print(codeLen);
                Serial.print(" codeValue=");
                Serial.println(codeValue);
              } // end if
            } // end for
          } // end else
        }
        else
        { // more raw values than non-raw values
          int bestRawValuessIndex = getBestRawCodessIndex();
          //IRCDEBUG_PRINT(IRCDBG + " loop() bestRawValuessIndex=");
          //IRCDEBUG_PRINTLN(bestRawValuessIndex);

          codeType = -1;
          codeLen = codeLensRaw[bestRawValuessIndex];
          Serial.print(IRC_CAPTURE_IR_RESPONSE_PREFIX);
          Serial.print(codeType); // UNKNOWN/raw
          Serial.print(" codeLen=");
          Serial.print(codeLen);
          Serial.print(" rawCodes=");
          //          ircresponse = "IRC_CAPTURE_IR_RESPONSE_PREFIX" + codeType;
          //          ircresponse = ircresponse + " codeLen=" + codeLen;
          //          ircresponse = ircresponse + " rawCodes=";
          //          Serial.print(ircresponse);

          for (int ndx = 0; ndx < codeLen; ndx++)
          {
            rawCodes[ndx] = rawCodess[bestRawValuessIndex][ndx];
            Serial.print(rawCodes[ndx]);
            Serial.print(" ");
          } // end for
          Serial.println("");
        } // end else we captured at least one signal
      } // end else
    } // if (data.equals(CAPTUREIR))
    else if (data.startsWith(SENDIR))
    {
      IRCDEBUG_PRINT(IRCDBG + " loop() received sendir request:");
      IRCDEBUG_PRINTLN(data);
      String rawsendirPrefix = SENDIR + " codeType=-1";
      if (data.startsWith(rawsendirPrefix)) // send IR with raw codes
      {
        // "sendir codeType=-1 codeLen=XXX rawCodes=2500 500..."
        // "012345678901234567890123456789
        int lastIndex;
        codeType = UNKNOWN;
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir raw processing codeType=");
        IRCDEBUG_PRINTLN(codeType);
        codeLen = getNextNumberFromString(data, 27, &lastIndex);
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir raw processing codeLen=");
        IRCDEBUG_PRINTLN(codeLen);
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir raw processing rawCodes=");
        for (int ndx = 0; ndx < codeLen; ndx++)
        {
          rawCodes[ndx] = getNextNumberFromString(data, lastIndex, &lastIndex);
          IRCDEBUG_PRINT(rawCodes[ndx]);
          IRCDEBUG_PRINT(" ");
        } // end for
        IRCDEBUG_PRINTLN();
      } // end if
      else // send IR with non-raw value
      {
        // "sendir codeType=4 codeLen=20 codeValue=691090"
        // "012345678901234567890123456789
        int lastIndex;
        codeType = getNextNumberFromString(data, 16, &lastIndex);
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir processing codeType=");
        IRCDEBUG_PRINTLN(codeType);
        codeLen = getNextNumberFromString(data, lastIndex, &lastIndex);
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir processing codeLen=");
        IRCDEBUG_PRINTLN(codeLen);
        codeValue = getNextNumberFromString(data, lastIndex, &lastIndex);
        IRCDEBUG_PRINT(IRCDBG + "loop() sendir processing codeValue=");
        IRCDEBUG_PRINT(codeValue);
        IRCDEBUG_PRINT(" x");
        IRCDEBUG_PRINTLN(codeValue, HEX);
      } // end else

      digitalWrite(STATUS_PIN, HIGH);
      sendCode(0); // TODO: Handle repeat
      digitalWrite(STATUS_PIN, LOW);
      irrecv.enableIRIn(); // Re-enable receiver
    } // else if sendir
  } // else if (Serial.available() > 0)

  lastButtonState = buttonState;
} // loop()
