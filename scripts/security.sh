#!/bin/sh
yarn audit --level moderate
status=$?
if [ $status -gt 2 ]; then exit $status
else exit 0
fi
