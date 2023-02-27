/* eslint-disable max-len */
import { notification } from "antd";
import axios from "axios";
const elementBaseURL = 'element';

export const requestElement =() => {
    const MatrixID = localStorage.getItem("mx_user_id");
    const Authorization = `Bearer ${localStorage.getItem('mx_authorization')}`;
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
    // .catch(err => {
    //     notification['error']({
    //         message: 'Error',
    //         description: err?.message,
    //     });
    // });
};
