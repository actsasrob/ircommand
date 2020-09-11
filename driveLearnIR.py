#!/usr/bin/env python3
import re
import serial
import time
import sys, select

LIR_CMD_SIZE = 10

LastIRSignal = ""

def sendLIRSignal():
    global LastIRSignal

    tmpStr = LastIRSignal + " FF "
    ser.write(tmpStr.encode())
    print("SendLIRSignal: DEBUG: Sent: " + tmpStr)

def sendLIR(command):
    tmpList = list(command[0:(LIR_CMD_SIZE - 1)])
    theLength = len(tmpList)
    if theLength < LIR_CMD_SIZE - 1:
        for x in range(theLength, LIR_CMD_SIZE - 1):
            tmpList.append('_')
    checksum = ord(tmpList[0]) 
    #print("sendLIR: DEBUG: checksum=" + "ord(" + str(tmpList[0]) + ")=" + str(checksum))
    for x in range(1, LIR_CMD_SIZE - 1):
        checksum1 = checksum ^ ord(tmpList[x])
        #print("sendLIR: DEBUG: " + str(checksum) + " xor " + str(tmpList[x]) + "=" + str(checksum1))
        checksum = checksum1
    tmpList.append(chr(checksum))
    tmpStr1=""
    tmpStr=tmpStr1.join(tmpList)
    print("sendLIR: DEBUG command=" + tmpStr + " checksum=" + str(checksum) + " chr(" + str(checksum) + ")=" + str(chr(checksum)) +"\n")
    #f = open('/tmp/output', 'wb')
    #f.write(tmpStr.encode())
    #f.close()
    #ser.write(str(tmpList).encode())
    ser.write(tmpStr.encode())

def main():
    global LastIRSignal

    while True:
        prompt = "Enter LearnIR command sequence followed by <ENTER> key to send:"
        print(prompt)
        i, o, e = select.select( [sys.stdin], [], [], 2 )
    
        if (i):
            line = sys.stdin.readline().strip()
            print("DEBUG: Send '" + line + "' to LearnIR\n")
            sendLIR(line)
        else:
            while True: # read/print/process anything coming from Serial port
               line = ser.readline().decode('utf-8').rstrip()
               if line != "":
                   if line.startswith("LIR:"):
                       print("IR signal from LearnIR: " + line)
                       LastIRSignal = line
                   elif line.startswith("I>"):
                       print("LearnIR ready to send IR signal: " + line)
                       sendLIRSignal()
                   else:
                       print(line) # Possibly LearnIR debug output
               else:
                   break

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
    ser.flush()
    main()
