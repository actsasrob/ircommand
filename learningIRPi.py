#!/usr/bin/env python3
import serial
import time

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

import sys, select

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
               print(line)
           else:
               break
