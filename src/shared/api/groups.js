import { http } from "../http";
import { BASE_URL } from './base';

const GROUPS_URL = 'api/v1/groups/'
const API_URL = BASE_URL + GROUPS_URL;

const headers = {
    'Content-Type': 'application/json; charset=utf-8'
};

export class GroupsAPI {
    static create(userId, body) {
        return http.post(API_URL, {
            headers,
            body,
            params: { userId }
        });
    }

    static query(userId) {
        return http.get(API_URL, {
            headers,
            params: {
                userId
            }
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