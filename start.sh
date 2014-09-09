#!/bin/bash

supervisor bin/www > /var/log/access.log 2>&1 &
