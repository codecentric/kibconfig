import exampleSearchLocalJson from '../samples/exampleSearchLocal.json';
import exampleSearchRemoteJson from '../samples/exampleSearchRemote.json';
import exampleDashboardJson from '../samples/exampleDashboard.json';
import exampleVisualizationLogCountJson from '../samples/exampleVisualizationLogCount.json';
import exampleVisualizationNavigationJson from '../samples/exampleVisualizationNavigation.json';
import exampleSearchAllLogsJson from '../samples/exampleSearchAllLogs.json';
import exampleSearchAllErrorsJson from '../samples/exampleSearchAllErrors.json';

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

    static exampleDashboardFiles() {
        return [
            {
                id: 'Example-Dashboard',
                type: 'dashboard',
                content: Samples.exampleDashboard()
            },
            {
                id: 'Example-Log-count-by-level',
                type: 'visualization',
                content: Samples.exampleVisualizationLogCount()
            },
            {
                id: 'Navigation',
                type: 'visualization',
                content: Samples.exampleVisualizationNavigation()
            },
            {
                id: 'Example-all-logs',
                type: 'search',
                content: Samples.exampleSearchAllLogs()
            },
            {
                id: 'Example-all-errors',
                type: 'search',
                content: Samples.exampleSearchAllErrors()
            }
        ];
    }

    static exampleDashboard() {
        return Samples.clone(exampleDashboardJson);
    }

    static exampleVisualizationLogCount() {
        return Samples.clone(exampleVisualizationLogCountJson);
    }

    static exampleVisualizationNavigation() {
        return Samples.clone(exampleVisualizationNavigationJson);
    }

    static exampleSearchAllLogs() {
        return Samples.clone(exampleSearchAllLogsJson);
    }

    static exampleSearchAllErrors() {
        return Samples.clone(exampleSearchAllErrorsJson);
    }

    static clone(data) {
        return JSON.parse(JSON.stringify(data));
    }
}
