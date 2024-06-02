#!/usr/bin/env bash

db_host=$1
db_port=$2
db_name=$3
db_username=$4
db_password=`cat $5`
command=$6

echo "Waiting for MySQL to start..."
until mysql -h $db_host -P $db_port -u $db_username -p$db_password -e "show databases;" &> /dev/null;
do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done
echo "MySQL is up - executing command"

migrate -path ./scripts -database mysql://$db_username:$db_password@tcp\($db_host:$db_port\)/$db_name $command