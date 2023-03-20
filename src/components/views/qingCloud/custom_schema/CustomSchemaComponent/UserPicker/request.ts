import httpClient, { httpClientGraphQL } from "../qxp/http";

export async function searchUser<T>(params: any) {
    return await httpClientGraphQL<T>('/api/v1/search/user', params);
}

export const getUserDetail = <T>(IDs: string[]) => {
    return httpClient<T>('/api/v1/org/h/user/ids', { IDs });
};
