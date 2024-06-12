# Intelligent Load Balancer

## Overview
This project is an intelligent load balancer that routes incoming requests to different API endpoints based on dynamic criteria such as API type, request payload size, and randomization.

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

## Folder Structure

Here's a Servers folder, multiple express server files are there.

Then there's the main server.js where all the feature's like dynamic routing, logging & metrics, function simulation, queue management, request handling are built.

Then there's worker.js file where request or tasks coming to a worker are processed & the result for every processed task is sent to the main thread.

## Logs

The requests.log & tasks.log files are there and if not, then they can be created by performing some tasks by sending requests to the server by testing the dynamic route.

I created all the functionalities in one route that is `dynamic-route`.

Then there are other routes for task `status`, checking `requests-logs` & `tasks logs`.

