import exampleSearchLocalJson from '../samples/exampleSearchLocal.json';
import exampleSearchRemoteJson from '../samples/exampleSearchRemote.json';

export default class Samples {
    static exampleHits() {
        return [
            { ...exampleSearchRemoteJson, _id: 'id1' },
            { ...exampleSearchRemoteJson, _id: 'id2' }
        ];
    }

    static exampleFiles() {
        return [
            {
                id: 'id1',
                type: 'search',
                content: { ...exampleSearchLocalJson, id: 'id1' }
            },
            {
                id: 'id2',
                type: 'search',
                content: { ...exampleSearchLocalJson, id: 'id2' }
            }
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
