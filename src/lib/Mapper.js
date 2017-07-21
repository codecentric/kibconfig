
export default class Mapper {
    static mapToLocal(entry) {
        const source = entry._source;

        return Mapper.removeUndefined(Mapper.replaceJsonWithJs({
            ...source,
            id: entry._id,
            visState: source.visState ? Mapper.sortByKey(source.visState) : undefined,
            kibanaSavedObjectMeta: Mapper.replaceJsonWithJs(source.kibanaSavedObjectMeta)
        }));
    }

    static mapToRemote(content) {
        return Mapper.removeUndefined(Mapper.replaceJsWithJson({
            ...content,
            id: undefined,
            visState: JSON.stringify(content.visState),
            kibanaSavedObjectMeta: Mapper.replaceJsWithJson(content.kibanaSavedObjectMeta)
        }));
    }

    static replaceJsonWithJs(target) {
        return Object.keys(target).reduce((converted, key) => ({
            ...converted,
            [key]: key.endsWith('JSON') ? Mapper.sortByKey(JSON.parse(target[key])) : target[key]
        }), {});
    }

    static replaceJsWithJson(target) {
        return Object.keys(target).reduce((converted, key) => ({
            ...converted,
            [key]: key.endsWith('JSON') ? JSON.stringify(target[key]) : target[key]
        }), {});
    }

    static sortByKey(unordered) {
        if (unordered === null) {
            return null;
        } else if (unordered instanceof Array) {
            return unordered.map(entry => Mapper.sortByKey(entry));
        } else if (typeof unordered === 'object') {
            return Object.keys(unordered).sort().reduce((ordered, key) => ({
                ...ordered,
                [key]: Mapper.sortByKey(unordered[key])
            }), {});
        }
        return unordered;
    }

    static removeUndefined(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
