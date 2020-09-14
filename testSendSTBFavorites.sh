#!/bin/bash

PORT=8080

numTimes=1

if [ "$#" -gt 0 ]; then
	numTimes=$1
fi

echo "numTimes=$numTimes"
for ((i=0; i<"$numTimes"; i+=1 )) ;
  do
     echo '26 22C6 1162 01C4 1184 01C2 08D6 01C8 7784 22A8 08CC 01C2 5613 01 21 21 F2 81 21 34 54 54 54 54 54 54 54 1F' | curl --data-binary @- http://localhost:$PORT/
     sleep 2
     echo "got here"
 done

