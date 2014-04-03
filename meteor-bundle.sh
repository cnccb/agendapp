#!/bin/sh
meteor bundle agendapp.tgz
tar -xvzf agendapp.tgz
cd bundle/programs/server/node_modules
rm -rf fibers
npm install fibers@1.0.1