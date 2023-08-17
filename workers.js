import axios from 'axios';
import { workerData, parentPort } from 'worker_threads';

let counter = 0;

for (let i = 0; i < workerData.unchecked_jobs.length; i++) {
    axios.get(workerData.unchecked_jobs[i]['url'], )
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.log(error.status);
        });
    counter++;
}

parentPort.postMessage(counter);
