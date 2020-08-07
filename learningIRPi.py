#!/usr/bin/env python3
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


if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
    ser.flush()

    #line=""
    #while line != "IRC: ready":
    #    line = ser.readline().decode('utf-8').rstrip()
    #    print(line)
    #    time.sleep(1)

    #while True:
    #    theinput = input("1: Read from serial and display, 2: send captureir to serial: ");
    #    if theinput == '1':
    #        line = ser.readline().decode('utf-8').rstrip()
    #        print(line)
    #    elif theinput == '2':
    #        print("DEBUG: Ask IRCommand to capture an IR signal\n")
    #        ser.write(b"captureir\n")
    #    else:
    #        print("DEBUG: don't recognized request" + theinput + "\n")
    #    time.sleep(1)

    #print("DEBUG: loop until we get a result\n")
    #while True:
    #    while True:
    #        line = ser.readline().decode('utf-8').rstrip()


IRC_CAPTURE_IR_RESPONSE_PREFIX = "IRC: captureirresponse:"
 
#print("You have two seconds to answer!\n"
#while True:
#    print("1: send captureir to serial: ")
#    i, o, e = select.select( [sys.stdin], [], [], 2 )
#
#    if (i):
#        line = sys.stdin.readline().strip()
#        if line == '1':
#            print("DEBUG: Ask IRCommand to capture an IR signal\n")
#            ser.write(b"captureir\n")
#    else:
#        while True:
#           line = ser.readline().decode('utf-8').rstrip()
#           if line != "":
#               if line.startswith(IRC_CAPTURE_IR_RESPONSE_PREFIX, beg=0, end=len(IRC_CAPTURE_IR_RESPONSE_PREFIX)):
#                   process_irc_capture_ir_response(line)
#               print(line)
#           else:
#               break

def  process_irc_capture_ir_response(message):
    print("process_irc_capture_ir_response(): " + message + "\n")
    return 1

def main():
    print("You have two seconds to answer!\n")
    while True:
        print("1: send captureir to serial: ")
        i, o, e = select.select( [sys.stdin], [], [], 2 )
    
        if (i):
            line = sys.stdin.readline().strip()
            if line == '1':
                print("DEBUG: Ask IRCommand to capture an IR signal\n")
                ser.write(b"captureir\n")
        else:
            while True:
               line = ser.readline().decode('utf-8').rstrip()
               if line != "":
                   if line.startswith(IRC_CAPTURE_IR_RESPONSE_PREFIX, 0, len(IRC_CAPTURE_IR_RESPONSE_PREFIX)):
                       process_irc_capture_ir_response(line)
                   else:
                       print(line)
               else:
                   break

if __name__ == '__main__':
    main()
