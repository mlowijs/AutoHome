#!/bin/bash

npm pack
PACKAGE_NAME=`ls *.tgz`

mkdir temp

tar xzf $PACKAGE_NAME -C temp
rm $PACKAGE_NAME

tar czf $PACKAGE_NAME -C temp/package .
rm -rf temp
