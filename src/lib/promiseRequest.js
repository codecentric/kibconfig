const superagent = module.exports = require('superagent');
const Request = superagent.Request;

Request.prototype.promise = function promise() {
    return new Promise((resolve, reject) => {
        this.end((err, result) => {
            if (err && result && !result.ok) {
                const msg = `Cannot ${this.method} ${this.url} (${result.status})`;
                const error = new Error(msg, err);

                error.result = result;
                error.status = result.status;
                error.body = result.body;
                reject(error);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

Request.prototype.then = () => {
    const promise = this.promise();

    return promise.then.apply(promise, arguments);
};
