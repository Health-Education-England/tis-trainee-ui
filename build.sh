#!/bin/bash

# Replace the production dotenv if building for preprod.
if test "$ENV" = "preprod"; then
  echo "Setting up preprod environment."
  cp -fb ./.env.preprod ./.env.production
fi

# Continue building the Next.js application.
next build

# Restore the original production dotenv.
if test -f "./.env.production~"; then
  echo "Restoring original production environment."
  mv -f ./.env.production~ ./.env.production
fi
