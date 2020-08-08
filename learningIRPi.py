#!/usr/bin/env python3
import re
import serial
import time
import sys, select

# A code type of -1 (UNKNOWN, returned by the IRremote arduino library,)is used for unknown protocols which are then stored as raw mark and space numeric sequences.
# If we see a code type of -1 we'll treat the IR signal as raw
# From https://github.com/z3t0/Arduino-IRremote/blob/master/src/IRremote.h
#typedef enum {
#    UNKNOWN = -1,
#    UNUSED = 0,
#...
#}

UNKNOWN = "-1"
UNUSED = "0"

# Commands to arduino
IRC_CAPTURE_IR_REQUEST = "captureir"
IRC_SEND_IR_REQUEST = "sendir"

# Response from arduino
IRC_CAPTURE_IR_NO_IR_SIGNAL_DETECTED = "IRC: captureirresponse: No IR signal detected."
IRC_CAPTURE_IR_RESPONSE_PREFIX = "IRC: captureirresponse: codeType="
IRC_SEND_IR_RESPONSE_PREFIX = "IRC: sendirresponse:"

lastCodeType = UNUSED
lastCodeValue = ""
lastCodeLen = 0
lastRawCodes = ""

def resetLastIRVars():
    #print("resetLastIRVars(): here01\n")
   
    global lastCodeType
    global lastCodeValue
    global lastCodeLen
    global lastRawCodes
    
    lastCodeType = UNUSED
    lastCodeValue = ""
    globallastCodeLen = 0
    lastRawCodes = ""

def process_irc_capture_ir_response(message):
    print("process_irc_capture_ir_response(): " + message + "\n")
    global lastCodeType
    global lastCodeValue
    global lastCodeLen
    global lastRawCodes
    retVal = 0 # success

    intpattern = '=(-?\d+)'
 
    if re.search("codeType=" + UNKNOWN, message): # raw values
        matches = re.findall(intpattern, message)
        numMatches = len(matches)
        if numMatches < 3:
            print("process_irc_capture_ir_response(): error: invalid IR response\n")
            retVal = 1
        else:
            lastCodeType = UNKNOWN
            lastCodeLen = matches[1] 
            matches = re.findall("^.*rawCodes=(.*)$", message)
            if len(matches) != 1:
                print("process_irc_capture_ir_response(): error: didn't find rawCodes\n")
                retVal = 1
            else:
                lastRawCodes = matches[0]
    else: # non-raw values
        matches = re.findall(intpattern, message)
        numMatches = len(matches)
        if numMatches < 3:
            print("process_irc_capture_ir_response(): error: invalid IR response\n")
            retVal = 1
        else:
            lastCodeType = matches[0]
            lastCodeLen = matches[1]
            lastCodeValue = matches[2]
            print("process_irc_capture_ir_response(): lastCodeType=" + lastCodeType + " lastCodeLen=" + lastCodeLen + " lastCodeValue=" + lastCodeValue + "\n");
    return retVal

def process_irc_capture_ir_no_ir_signal_detected():
    print("process_irc_capture_ir_no_signal_detected():\n")
    resetLastIRVars()
    retVal = 0
    return retVal

def main():
    print("You have two seconds to answer!\n")
    while True:
        #print("main() lastCodeType=" + lastCodeType + "\n")
        prompt = "1-send captureir request to serial"
        if lastCodeType != UNUSED:
            prompt = prompt + ", 2-send sendir request to serial: "
        print(prompt)
        i, o, e = select.select( [sys.stdin], [], [], 2 )
    
        if (i):
            line = sys.stdin.readline().strip()
            if line == '1':
                print("DEBUG: Ask IRCommand to capture an IR signal\n")
                #ser.write(b"captureir\n")
                tmpStr = IRC_CAPTURE_IR_REQUEST + "\n"
                ser.write(tmpStr.encode())
            elif line == '2':
                print("DEBUG: Ask IRCommand to send an IR signal\n")
                tmpStr = IRC_SEND_IR_REQUEST + " codeType=" + lastCodeType + " codeLen=" + lastCodeLen
                if lastCodeType == UNKNOWN:
                    tmpStr = tmpStr + " rawCodes=" + lastRawCodes + "\n"
                else:
                    tmpStr = tmpStr + " codeValue=" + lastCodeValue + "\n"
                ser.write(tmpStr.encode())
        else:
            while True: # read/print/process anything coming from Serial port
               line = ser.readline().decode('utf-8').rstrip()
               if line != "":
                   if line.startswith(IRC_CAPTURE_IR_RESPONSE_PREFIX, 0, len(IRC_CAPTURE_IR_RESPONSE_PREFIX)):
                       retVal = process_irc_capture_ir_response(line)
                       if retVal != 0: # if an error occurred reset the captured IR signal values
                           resetLastIRVars()
                   elif line == IRC_CAPTURE_IR_NO_IR_SIGNAL_DETECTED:
                       process_irc_capture_ir_no_ir_signal_detected()
                   else:
                       print(line) # probably IRCommand debug output
               else:
                   break

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
    ser.flush()
    main()
