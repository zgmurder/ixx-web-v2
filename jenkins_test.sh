#!/bin/sh 
 
npm run build:ixx:stage

sleep 2

eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa

rsync -e "ssh -p 10022" -rcvPz dist/* root@47.74.255.117:~/web_ixx_test_new

ssh -p 10022 root@47.74.255.117 'rsync -e "ssh -p 10022" -rcvPz ~/web_ixx_test_new/ test:/var/www/ixx_new'
 
 
   