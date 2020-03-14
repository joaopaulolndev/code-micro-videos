#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh

### FRONTEND ###
# config npm cache
npm config set cache /var/www/.docker/.cache/npm --global

# install dependencies
cd /var/www/frontend && npm install && cd ..

### BACKEND ###
#cd /var/www/backend
cd backend

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

if [ ! -f ".env.testing" ]; then
  cp .env.testing.example .env.testing
fi

composer install
php artisan key:generate
php artisan migrate

php-fpm
