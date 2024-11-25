// Implement a polling request class using axios
import axios, { Axios } from 'axios';

export default class BackendRequester {
    axios: Axios;
    constructor(baseURL: string = 'http://localhost:9961/api', timeout = 1000){
        this.axios = axios.create({
            baseURL,
            timeout,
            headers: { 'Content-Type': 'application/json' }
        });
        this.axios.defaults.headers.common['Content-Type'] = 'application/json';
    }
    async post(path: string, data: string, config?: object){
        return this.axios.post(path, data, config);
    }
    async getWithoutPolling(path: string, config?: object){
        return this.axios.get(path, config);
    }
    /**
     * Polls the /api/task/:id/status endpoint every pollingTimeout milliseconds
     * If the return value is { status: Success }, requests /api/task/:id/result to fetch the result
     * If not, report the error to the caller
     * 
     * @param task_id The task id to poll
     * @param pollingTimeout The polling timeout in milliseconds
     */
    async getWithPolling(task_id: string, pollingTimeout: number = 100, maxRetries: number = 10000) {
        let status = 'InQueue';
        let retries = 0;
        while ((status === 'InQueue' || status === 'Running') && retries < maxRetries) {
            const delay = pollingTimeout * Math.pow(2, retries);
            await new Promise(resolve => setTimeout(resolve, delay));
            const response = await this.getWithoutPolling(`/task/${task_id}/status`);
            status = response.data.status;
            retries++;
        }
        if (status === 'Success') {
            return this.getWithoutPolling(`/task/${task_id}/result`);
        }
        return Promise.reject('Task failed or timed out');
    }

    /**
     * Submits a task to the specified endpoint
     * 
     * This function encapsulates the logic of fetching the task_id and then polling using the raw APIs 
     * already implemented
     */
    async submitTask(path: string, data: any, pollingTimeout: number){
        const response = await this.post(path, data);
        return this.getWithPolling(response.data.task_id, pollingTimeout);
    }
}