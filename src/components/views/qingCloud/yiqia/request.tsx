/* eslint-disable max-len */
import axios from "axios";
const elementBaseURL = 'element';

export const requestElement =() => {
    const MatrixID = localStorage.getItem("mx_user_id");
    const Authorization = `Bearer ${window?.mxMatrixClientPeg?.matrixClient.getAccessToken()}`;
    return axios.create({
        baseURL: elementBaseURL,
        headers: {
            "Matrix-Id": MatrixID,
            "Authorization": Authorization,
        },
    });
};

// 获取通讯录列表
export const getContactList = (parentId?: any) => {
    return requestElement()({
        method: 'GET',
        url: `api/v1/groups?parent=${parentId}`,
    })
        .then((res: any) => res?.data);
};
