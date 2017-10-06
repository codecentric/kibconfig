
export default class Mapper {
    static mapToLocal(entry) {
        const source = entry._source;

        return Mapper.removeUndefined(Mapper.replaceJsonWithJs({
            ...source,
            id: entry._id,
            visState: source.visState ? JSON.parse(source.visState) : undefined,
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
        if (target === undefined || target === null) {
            return target;
        }
        return Object.keys(target).reduce((converted, key) => ({
            ...converted,
            [key]: key.endsWith('JSON') ? JSON.parse(target[key]) : target[key]
        }), {});
    }

    static replaceJsWithJson(target) {
        if (target === undefined || target === null) {
            return target;
        }
        return Object.keys(target).reduce((converted, key) => ({
            ...converted,
            [key]: key.endsWith('JSON') ? JSON.stringify(target[key]) : target[key]
        }), {});
    }

    static removeUndefined(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
