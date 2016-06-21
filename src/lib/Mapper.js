
export default class Mapper {
    static mapToLocal(entry) {
        const source = entry._source;
        const target = Object.assign(
            { id: entry._id },
            JSON.parse(JSON.stringify(source))
        );

        if (target.visState) {
            target.visState = Mapper.sortByKey(JSON.parse(target.visState));
        }
        Mapper.replaceJsonWithJs(target);
        if (target.kibanaSavedObjectMeta) {
            Mapper.replaceJsonWithJs(target.kibanaSavedObjectMeta);
        }
        return target;
    }

    static mapToRemote(content) {
        const target = JSON.parse(JSON.stringify(content));

        delete target.id;
        if (target.visState) {
            target.visState = JSON.stringify(target.visState);
        }
        Mapper.replaceJsWithJson(target);
        if (target.kibanaSavedObjectMeta) {
            Mapper.replaceJsWithJson(target.kibanaSavedObjectMeta);
        }
        return target;
    }

    static replaceJsonWithJs(target) {
        Object.keys(target).forEach(key => {
            if (key.endsWith('JSON')) {
                target[key] = Mapper.sortByKey(JSON.parse(target[key])); // eslint-disable-line no-param-reassign
            }
        });
    }

    static replaceJsWithJson(target) {
        Object.keys(target).forEach(key => {
            if (key.endsWith('JSON')) {
                target[key] = JSON.stringify(target[key]); // eslint-disable-line no-param-reassign
            }
        });
    }

    static sortByKey(unordered) {
        if (unordered instanceof Array) {
            return unordered.map(entry => Mapper.sortByKey(entry));
        } else if (typeof unordered === 'object') {
            const ordered = {};

            Object.keys(unordered).sort().forEach(key => {
                ordered[key] = Mapper.sortByKey(unordered[key]);
            });
            return ordered;
        }
        return unordered;
    }
}
