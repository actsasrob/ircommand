#!/bin/bash

PORT=8080

echo '26 22C6 1162 01C4 08D6 01C8 1184 01C4 7784 22AA 08CE 01C4 560D 01 21 12 F1 72 12 23 45 45 45 45 45 45 41' | curl --data-binary @- http://localhost:$PORT/
echo
