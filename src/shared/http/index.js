const OK = 200;

function formatParams(params) {
    const query = Object
        .keys(params)
        .map(function (key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&");

    return query.length ? '?' + query : query;
}

function request(
    url,
    { headers = {}, method, body, params = {} } = {}
) {
    return new Promise((resolve, reject) => {
        const urlWithParams = url + formatParams(params);
        const xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === OK) {
                    resolve(JSON.parse(xmlHttp.responseText));
                } else {
                    reject('HTTP_ERROR', xmlHttp.statusText);
                }
            }
        };
        xmlHttp.open(method, urlWithParams, true);
        Object.keys(headers).forEach(key =>
            xmlHttp.setRequestHeader(key, headers[key])
        );
        xmlHttp.send(JSON.stringify(body));
    });
}

const get = (url, options) => request(url, { ...options, method: 'GET' });
const post = (url, options) => request(url, { ...options, method: 'POST' });
const update = (url, options) => request(url, { ...options, method: 'PUT' });
const remove = (url, options) => request(url, { ...options, method: 'DELETE' });

export const http = { get, post, update, delete: remove };