/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import { init } from 'linkifyjs';

import { getNextCloudFilesList, getNextCloudUserName } from '../request';
import NextCloudFilesTable from './NextCloudFilesTable';
import NextCloudNavBar from './NextCloudNavBar';
import MatrixClientContext from '../../../../../contexts/MatrixClientContext';
import { MatrixClientPeg } from '../../../../../MatrixClientPeg';

const NextCloudContentView= (props: any) => {
    const cli = useContext(MatrixClientContext);
    const [userName, setUserName]=useState();
    const [currentPath, setCurrentPath]=useState('');
    const [fileList, setFileList]=useState([]);
    const [loading, setLoading]=useState(false);
    const [refresh, setRefresh]=useState(new Date().getTime());

    useEffect(() => {
        getUserName();
    }, []);

    useEffect(() => {
        userName && setLoading(true);
        userName && localStorage.setItem('mx_next_cloud_username', userName);
    }, [userName]);

    useEffect(() => {
        getFilesList(userName, currentPath);
    }, [userName, currentPath, refresh]);

    const getUserName = () => {
        getNextCloudUserName()
            .then((res: any) => {
                setUserName(res?.username);
            }).catch(err => {
                console.log('getUserName error', err);
            });
    };

    const getFilesList = (username, currentPath) => {
        if (!userName) return;
        setLoading(true);
        getNextCloudFilesList(username, currentPath)
            .then((res: any) => {
                setFileList(res);
            }).catch(err => {
                console.log('getFilesList error', err);
            }).finally(() => {
                setLoading(false);
            });
    };

    const handleFileNameClick = (data: any) => {
        const { isFolder, currentPath } = data;
        isFolder && setCurrentPath(currentPath);
    };

    const handleChangePath = (path) => {
        setCurrentPath(path);
    };

    const handleRefresh = () => {
        setRefresh(new Date().getTime());
    };

    return <div className='nextCloudContentView'>
        <div className="header">
            <NextCloudNavBar currentPath={currentPath} onClick={handleChangePath} />
        </div>
        <Splitter direction={SplitDirection.Horizontal}>
            <NextCloudFilesTable
                data={fileList}
                loading={loading}
                userName={userName}
                currentPath={currentPath}
                onRefresh={handleRefresh}
                onFileNameClick={handleFileNameClick}
            />
        </Splitter>
    </div>;
};

export default NextCloudContentView;

