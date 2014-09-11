#!/bin/bash

#supervisor bin/www > /var/log/access.log 2>&1 &
supervisor -w routes,config -e node,js,json bin/www > /var/log/access.log 2>&1 &
