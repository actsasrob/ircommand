#!/bin/bash

echo "$1" | sed -e 's/ \([[:digit:]]\)/ +\1/g' -e 's/^\([[:digit:]]\)/+\1/g'
