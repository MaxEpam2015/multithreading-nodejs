import { Worker } from 'worker_threads';
import os from 'os';
import axios from 'axios';
import 'dotenv/config'

const THREAD_COUNT = os.cpus().length;

let workerPromises = [];

axios.get(process.env.SERVICE_URL)
    .then(response => {
        let dataChunkSize = Math.ceil(response.data.length / THREAD_COUNT);
        for (let i = 0; i < response.data.length; i += dataChunkSize) {
            let chunk = response.data.slice(i, i + dataChunkSize);
            workerPromises.push(createWorker(chunk));
        }

        return response.data;
    })
    .catch(error => {
        console.log(error);
    });


function createWorker(unchecked_jobs) {
    return new Promise(function (resolve, reject) {
        const worker = new Worker('./' + process.env.WORKER_FILE, {
            workerData: {
                unchecked_jobs: unchecked_jobs,
            },
        });
        worker.on("message", (data) => {
            resolve(data);
        });
        worker.on("error", (msg) => {
            reject(`An error occurred: ${msg}`);
        });
    });
}
