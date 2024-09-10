#!/bin/bash

lsof -i :9999 | awk -F ' ' '{ print $2 }' | tail -n 1 | xargs kill -9
