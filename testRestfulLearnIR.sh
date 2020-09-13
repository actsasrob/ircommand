#!/bin/bash

PORT=8080

curl http://localhost:$PORT/
echo

curl -X POST -d "some test data" http://localhost:$PORT/
echo

curl -X PUT -d "some test data" http://localhost:$PORT/
echo

echo 'hello world' | curl --data-binary @- http://localhost:$PORT/
echo
