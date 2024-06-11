import {parentPort} from 'worker_threads';

// Mock data processing function
function processData(data) {
    // Simulate a CPU-intensive task
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        result += data.charCodeAt(i);
    }
    return result;
}

parentPort.on('message', (task) => {
    const { id, data } = task;
    const result = processData(data);
    parentPort.postMessage({ id, result });
});
