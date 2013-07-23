#!/bin/bash
git ci -a;
git pull;
git push;
meteor deploy agendapp.meteor.com
