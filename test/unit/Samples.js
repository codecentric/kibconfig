
import exampleSearchLocalJson from '../samples/exampleSearchLocal.json';
import exampleSearchRemoteJson from '../samples/exampleSearchRemote.json';

export default class Samples {
    static exampleHits() {
        return [
            Object.assign({}, exampleSearchRemoteJson, { _id: 'id1' }),
            Object.assign({}, exampleSearchRemoteJson, { _id: 'id2' })
        ];
    }

    static exampleSearchLocal() {
        return Samples.clone(exampleSearchLocalJson);
    }

    static exampleSearchRemote() {
        return Samples.clone(exampleSearchRemoteJson);
    }

    static clone(data) {
        return JSON.parse(JSON.stringify(data));
    }
}
