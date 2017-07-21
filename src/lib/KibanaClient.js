import assert from 'assert';
import * as request from 'superagent';

export default class KibanaClient {
    constructor(config) {
        this.url = config.url;
        this.query = config.query;
        this.verbose = config.verbose;
        this.checkConfig();
    }

    checkConfig() {
        assert(this.url, '<url> is required');
    }

    findAll() {
        const url = `${this.url}/.kibana/_search?size=1000&q=${encodeURIComponent(this.query)}`;

        if (this.verbose) {
            console.log(`Querying via ${url}`);
        }

        return request
            .get(url)
            .set('Accept', 'application/json')
            .then(result => result.body.hits.hits);
    }

    delete(type, id) {
        const url = `${this.url}/.kibana/${type}/${id}`;

        if (this.verbose) {
            console.log(`Deleting ${url}`);
        }

        return request
            .delete(url)
            .then(() => ({ type, id }));
    }

    upload(type, id, body) {
        const url = `${this.url}/.kibana/${type}/${encodeURIComponent(id)}`;

        if (this.verbose) {
            console.log(`Uploading to ${url}`);
        }

        return request
            .put(url)
            .send(body)
            .then(() => ({ id, body }))
            .catch(err => {
                console.error(`Error uploading ${url}: ${err.message}`);
                throw err;
            });
    }
}
