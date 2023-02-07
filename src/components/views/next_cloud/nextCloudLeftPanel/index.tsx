/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';

import dis from '../../../../dispatcher/dispatcher';
import NextCloudSearch from './NextCloudSearch';
import NextCloudFilesNav from './nextCloudFilesNav';
import { Action } from '../../../../dispatcher/actions';
import MatrixClientContext from '../../../../contexts/MatrixClientContext';
import { MatrixClientPeg } from '../../../../MatrixClientPeg';

const NextCloudLeftPanel= () => {
    // const cli = useContext(MatrixClientContext);
    // const matrixID = localStorage.getItem('mx_user_id');
    // const matrixToken = `Bearer ${localStorage.getItem('mx_authorization')}`;
    // const [userName, setUserName]= useState();

    useEffect(() => {
        dis.dispatch({ action: Action.ViewNextCloud });
    }, []);

    // useEffect(() => {
    //     console.log('nextcloud userName', userName);
    // }, [userName]);

    // const getNextCloudUserName = () => {
    //     cli.getNextCloudUserName()
    //         .then(res => {
    //             setUserName(res?.username);
    //             localStorage.setItem('mx_next_cloud_username', res?.username);
    //         }).catch(err => {
    //             console.log('getNextCloudUserName', err);
    //         });
    // };

    // const download = () => {
    //     cli.downLoadNextCloudFile({
    //         username: userName,
    //         password: `${matrixID}|${matrixToken}`,
    //     }, null, {
    //         username: userName,
    //         fileName: 'Readme.md',
    //     });
    // };
    return <>
        { /* <NextCloudSearch /> */ }
        { /* <NextCloudFilesNav /> */ }
    </>;
};

export default NextCloudLeftPanel;
