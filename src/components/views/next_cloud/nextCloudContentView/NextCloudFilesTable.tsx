import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, Table } from 'antd';
import {
    PlusOutlined,
    DownloadOutlined,
    DeleteOutlined,
    FolderOutlined,
    FileOutlined,
    // FileZipOutlined,
    // FileTextOutlined,
    // FileMarkdownOutlined,
    // FileImageOutlined,
    // FileGifOutlined,
    // FileJpgOutlined,
    // FilePdfOutlined,
    // FilePptOutlined,
    // FileExcelOutlined,
    // FileWordOutlined,
} from '@ant-design/icons';

import { createNewFolder, deleteNextCloudFile, downLoadNextCloudFile } from '../request';
import NextCloudUpload from './NextCloudUpload';
import NextCloudDownload from './NextCloudDownload';

const NextCloudFilesTable = (props) => {
    const { loading, userName, data=[], currentPath, onFileNameClick, onRefresh }=props;
    const nextCloudTableRef = useRef<any>();
    const [scrollY, setScrollY]=useState<any>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows]=useState([]);
    const [disabled, setDisabled]=useState(true);
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const addNewFolderInputRef = useRef<InputRef>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const headerHeight = 80;

    useEffect(() => {
        try {
            setScrollY(nextCloudTableRef?.current?.clientHeight - headerHeight);
        } catch (error) {

        }
    }, [nextCloudTableRef]);

    useEffect(() => {
        selectedRowKeys.length ? setDisabled(false):setDisabled(true);
    }, [selectedRowKeys]);

    const handleFlieNameClick = (row) => {
        onFileNameClick && onFileNameClick(row);
    };

    const handleDownload = (data: any) => {
        const { downloadPath, isFolder, name, dir }=data;
        downLoadNextCloudFile(downloadPath, isFolder, {
            dir,
            files: name,
        });
    };

    const handleMutiDownload = () => {
        let path = currentPath;
        path[0] === '/' && (path = path.slice(1));
        path[path.length-1] === '/' && (path = path.slice(0, -1));
        const pathArr = path.split('/');
        let dir; let files;
        if (selectedRowKeys.length===data.length) {
            dir = '/' + pathArr.slice(0, pathArr.length-1).join('/');
            files = pathArr[pathArr.length-1];
        } else {
            dir = '/' + pathArr.join('/');
            let filesStr="";
            selectedRowKeys.forEach((item) => {
                filesStr += `"${item}",`;
            });
            filesStr = filesStr.slice(0, -1);
            files = `[${filesStr}]`;
        }

        downLoadNextCloudFile(currentPath, true, {
            dir,
            files,
        });
    };

    const handleDelete = (data: any) => {
        const { currentPath }=data;
        deleteNextCloudFile(userName, currentPath)
            .then((res: any) => {
                onRefresh && onRefresh();
            });
    };

    const handleMutiDelete = () => {
        const _selectedRows = selectedRows.map(item => {
            const { currentPath }=item;
            return new Promise((resolve, reject) => {
                resolve(
                    deleteNextCloudFile(userName, currentPath)
                        .then((res: any) => {
                            // onRefresh && onRefresh();
                        })
                        .catch(err => {
                            console.log('handleMutiDelete item err', err);
                        }),
                );
            });
        });
        Promise.all([..._selectedRows])
            .then(res => {
                setSelectedRowKeys([]);
                onRefresh && onRefresh();
            })
            .catch(err => {
                console.log('handleMutiDelete err', err);
            });
    };

    const handleUploadedRefresh = () => {
        onRefresh && onRefresh();
    };

    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (val, row) => {
                const { isFolder }=row;
                return <div
                    className={`file-name-wrap ${(isFolder?'isFolder':'isFile')}`}
                    onClick={() => handleFlieNameClick(row)}
                >
                    { isFolder ? <FolderOutlined /> : <FileOutlined /> }
                    <span className='name'>{ val }</span>
                </div>;
            },
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            width: 120,
            // sorter: true,
        },
        {
            title: '修改时间',
            dataIndex: 'modified',
            key: 'modified',
            width: 200,
            // sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, row) => {
                return <div className="nextCloud-file-action">
                    <DownloadOutlined onClick={() => handleDownload(row)} />
                    <DeleteOutlined onClick={() => handleDelete(row)} />
                </div>;
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows) => {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    const handleAddNewFolderName = () => {
        const folderName = encodeURI(addNewFolderInputRef?.current?.input?.value);
        createNewFolder(userName, currentPath, folderName)
            .then((res: any) => {
                console.log(res);
                onRefresh && onRefresh();
            }).catch((err => {
            }));
    };

    const NewFolderInput = () => {
        return (
            <Input
                ref={addNewFolderInputRef}
                className='new-forder-input'
                placeholder="新建文件夹"
                size='small'
                suffix={<PlusOutlined className='new-forder-add'
                    onClick={handleAddNewFolderName}
                />}
            />
        );
    };
    const Header = () => {
        return <div className="table-header">
            {/* <div className="btn">
                <NewFolderInput />
            </div> */}
            <div className="btn">
                <NextCloudUpload
                    userName={userName}
                    currentPath={currentPath}
                    onRefresh={handleUploadedRefresh} />
            </div>
            {/* <div className="btn">
                <Button type="primary"
                    disabled={disabled}
                    icon={<DownloadOutlined />}
                    onClick={handleMutiDownload}
                >下载</Button>
            </div>
            <div className="btn">
                <Button type="primary"
                    disabled={disabled}
                    icon={<DeleteOutlined />}
                    onClick={handleMutiDelete}
                >删除</Button>
            </div> */}
        </div>;
    };

    return <div className='NextCloudFilesTable-wrap' ref={nextCloudTableRef}>
        <Header />
        <Table
            size='small'
            scroll={{ y: scrollY }}
            pagination={false}
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey={row => row?.name}
            // rowSelection={rowSelection}
        />
    </div>;
};

export default NextCloudFilesTable;
