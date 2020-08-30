#!/usr/bin/env python3
import re
import serial
import time
import sys, select
from functools import reduce

LIR_CMD_SIZE = 10

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

def sendLIR(command):
    tmpList = list(command[0:(LIR_CMD_SIZE - 1)])
    #bytesList = list(bytes(command[0:(LIR_CMD_SIZE - 1)], 'utf8'))
    #print(bytesList)
    theLength = len(tmpList)
    if theLength < LIR_CMD_SIZE - 1:
        for x in range(theLength, LIR_CMD_SIZE - 1):
            tmpList.append('_')
    checksum = ord(tmpList[0]) 
    for x in range(1, LIR_CMD_SIZE - 1):
        print(x)
        checksum = checksum ^ ord(tmpList[x])
    print("sendLIR: DEBUG command=" + str(tmpList) + " checksum=" + str(checksum) + "\n")
    ser.write(str(tmpList).encode())
    ser.write(bytes(checksum))

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
    #print("Enter LearnIR command sequence.\n")
    #print("Hit <ENTER> key when ready to send.\n")
    while True:
        #print("main() lastCodeType=" + lastCodeType + "\n")
        #prompt = "1-send captureir request to serial"
        #if lastCodeType != UNUSED:
        #    prompt = prompt + ", 2-send sendir request to serial: "
        prompt = "Enter LearnIR command sequence followed by <ENTER> key to send:"
        print(prompt)
        i, o, e = select.select( [sys.stdin], [], [], 2 )
    
        if (i):
            line = sys.stdin.readline().strip()
            print("DEBUG: Send '" + line + "' to LearnIR\n")
            tmpStr = line + "\n"
            #ser.write(tmpStr.encode())
            #ser.write(bytes(b"captureir"))
            sendLIR(line)
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
