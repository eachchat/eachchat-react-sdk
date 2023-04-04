import httpClient, { request } from "../qxp/http";
import { ApiDataType, OptionSet, OptionSetListItem } from "../qxp/interface";

export function getOptionSetById(id: string): Promise<OptionSet> {
    // const side = window.SIDE === 'home' ? 'home' : 'm';
    const side = 'home';
    return httpClient(`/api/v1/persona/dataset/${side}/get`, { id });
}

export function getSelectApiData(
    value: ApiDataType|undefined,
    hasUser = false,
): Promise<OptionSetListItem[]> {
    if (!value) {
        return Promise.resolve([]);
    }
    const userData = window.USER;
    const [path, method]: ApiDataType = value;
    const apiUrl = `/api/v1/polyapi/request${path}`;
    const res = request<{entities: OptionSetListItem[]}>(apiUrl, method, hasUser ? userData : {});
    return res.then((val) => {
        if (!val || !Array.isArray(val.entities)) {
            return [];
        }
        return val.entities;
    }).catch(() => []);
}

