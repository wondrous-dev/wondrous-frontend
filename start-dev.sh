#!/bin/bash

CURRENT_IP_ADDR=$(ipconfig getifaddr en0)

REACT_APP_SERVER_URL="http://${CURRENT_IP_ADDR}:4000/graphql" yarn start