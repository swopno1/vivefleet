#!/bin/bash

# Test user registration
echo "Testing user registration..."
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password",
    "username": "testuser"
  }'

echo -e "\n\n"

# Test user login
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }')

echo $LOGIN_RESPONSE

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo -e "\n\n"

# Test protected route
echo "Testing protected route..."
curl -X GET http://localhost:4000/user/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
