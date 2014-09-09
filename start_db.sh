mkdir -p db
/home/admin/mongodb-linux-i686-2.6.3/bin/mongod -v --logpath /var/log/mongodb/server1.log --logappend --noprealloc --dbpath ./db &
