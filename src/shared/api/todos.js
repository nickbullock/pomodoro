import { http } from "../http";
import { BASE_URL } from './base';

const TODOS_URL = 'api/v1/todos/'
const API_URL = BASE_URL + TODOS_URL;

const headers = {
    'Content-Type': 'application/json; charset=utf-8'
};

export class TodosAPI {
    static create(body) {
        return http.post(API_URL, {
            headers,
            body
        });
    }

    static query() {
        return http.get(API_URL, {
            headers
        });
    }

    static get(id) {
        return http.get(API_URL + id, {
            headers
        });
    }

    static delete(id) {
        return http.delete(API_URL + id, {
            headers
        });
    }

    static update(id, body) {
        return http.update(API_URL + id, {
            headers,
            body
        });
    }
}