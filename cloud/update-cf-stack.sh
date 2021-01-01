#!/bin/bash

paramFile="autom-dash-dev.json"

if [ "$#" -gt 0 ]; then
   paramFile=$1
fi

if [ ! -f "$paramFile" ]; then
   echo "error: $paramFile does not exit. exiting..."
   exit 1
fi

environment=$(grep Environment -A 1 $paramFile | grep ParameterValue | awk '{ print $2 }' | sed -e 's/"//g')

if [ -z "$environment" ]; then
   echo "error: could not determine environment from param file ${paramFile}. esiting..."
   exit 1
fi

aws cloudformation validate-template \
    --template-body file://autom-dash.template

if [ "$?" -ne 0 ]; then
   echo "error: CloudFormation template validation failed. exiting..."
   exit 1
else
   bucketName=$(grep BucketName -A 1 autom-dash-prod.json | grep ParameterValue | awk '{ print $2 }' | sed -s 's/"//g')
   aws s3 cp ./autom-dash.template s3://${bucketName}
   aws cloudformation update-stack  --stack-name "AutomDashWeb${environment^}" \
    --template-url https://autom-dash.s3.amazonaws.com/autom-dash.template \
    --parameters "file://${paramFile}"
fi
