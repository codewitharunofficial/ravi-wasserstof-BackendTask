// Here is the complete `server.js` file with all the implemented features:

// server.js
import express from "express";
import request from "request";
import fs from "fs";
import { Worker } from "worker_threads";

const app = express();
const port = 8080;

app.use(express.json());

//Defining different endpoint for different type of api request

const endpoints = {
  REST: "http://localhost:8081",
  GraphQL: "http://localhost:8082",
  gRPC: "http://localhost:8083",
};

const servers = [
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
];

//for writing logs:

const logStream = fs.createWriteStream("requests.log", { flags: "a" });
const taskLogStream = fs.createWriteStream('tasks.log', { flags: 'a' });


let tasks = [];
let taskId = 0;
let workers = [];
const maxWorkers = 4;


//Create a new worker

function createWorker() {
    const worker = new Worker('./worker.js');
    worker.isAvailable = true;
    worker.on('message', (message) => {
        const { id, result } = message;
        taskLogStream.write(`Task ${id} completed with result: ${result}\n`);
        worker.isAvailable = true;
        distributeTasks();
    });
    worker.on('error', (error) => {
        console.error(`Worker error: ${error}`);
    });
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
    workers.push(worker);
}

// initialize workers

for (let i = 0; i < maxWorkers; i++) {
    createWorker();
}

//Distributing tasks:

function distributeTasks() {
    if (tasks.length > 0) {
        const worker = workers.find(w => w.isAvailable);
        if (worker) {
            const task = tasks.shift();
            worker.isAvailable = false;
            worker.postMessage(task);
        }
    }
}

//Endpoint for dynamic routing

app.post("/dynamic-route", (req, res) => {
  //request headers
  //Note:- header log-request should be passed as true to get logs. Logs are saved in requests.log file
  const apiType = req.headers["api-type"];
  const routeType = req.headers["route-type"];
  const logRequest = req.headers["log-request"] === "true";
  
  //set this header true for task-processing:
  const taskProcessing = req.headers['task-processing'] === 'true';
  let endpoint;

  if (taskProcessing) {
    const { data } = req.body;
    const id = taskId++;
    tasks.push({ id, data });
    distributeTasks();
    res.send(`Task ${id} received and is being processed`);
} else {
    if (routeType === 'random') {
        endpoint = servers[Math.floor(Math.random() * servers.length)];
    } else if (routeType === 'custom') {
        const payloadSize = JSON.stringify(req.body).length;
        endpoint = payloadSize > 1000 ? 'http://localhost:8081' : 'http://localhost:8081';
    } else {
        endpoint = endpoints[apiType] || 'http://localhost:8083';
    }

    const startTime = Date.now();

    request.post({ url: endpoint, json: req.body }, (error, response, body) => {
        const responseTime = Date.now() - startTime;

        if (logRequest) {
            const logEntry = `API Type: ${apiType}, Route Type: ${routeType}, Endpoint: ${endpoint}, Response Time: ${responseTime}ms\n`;
            logStream.write(logEntry);
        }

        if (error) {
            return res.status(500).send(error);
        }
        res.send(body);
    });
}
});


// Endpoint to get the status of tasks
app.get('/status', (req, res) => {
    res.json(tasks);
});

//Endpoint to get task logs

app.get('/logs/tasks', (req, res) => {
    fs.readFile('tasks.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.type('text/plain').send(data);
    });
});


// Endpoint to get request logs
app.get('/logs/requests', (req, res) => {
    fs.readFile('requests.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.type('text/plain').send(data);
    });
});

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`);
});
