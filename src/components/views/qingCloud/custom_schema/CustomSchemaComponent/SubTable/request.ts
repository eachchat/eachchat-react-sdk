import httpClient from "../qxp/http";
import { GetTableSchemaResponse } from "../qxp/interface";

export function getTableSchema(appID: string, tableID: string): Promise<GetTableSchemaResponse> {
    const path = window.SIDE === 'home' ?
        `/api/v1/form/${appID}/home/schema/${tableID}` :
        `/api/v1/form/${appID}/m/table/getByID`;

    return httpClient<GetTableSchemaResponse>(path, { tableID });
}
