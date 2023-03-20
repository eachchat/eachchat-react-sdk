/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
// import { useQuery } from 'react-query';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { DataNode } from 'rc-tree-select/lib/interface';

import { LabelValue, Organization } from '../qxp/interface';
import { labelValueRenderer, getUserDepartment, getNoLabelValues } from '../qxp/utils';
import { getERPTree, getOrganizationDetail } from './request';
import MatrixClientContext from '../../../../../../contexts/MatrixClientContext';


type Props = TreeSelectProps<any> & {
  appID: string;
  onChange: (value: LabelValue[]) => void;
  optionalRange: 'all' | 'customize' | 'currentUserDep';
  defaultRange: 'customize' | 'currentUserDep';
  defaultValues?: LabelValue[];
  rangeList?: LabelValue[];
  value?: LabelValue[];
  editable?: boolean;
};

type ParseTreeProps = {
  depTreeData?: Organization | undefined;
  initData?: DataNode[];
  rootPId?: string | number;
  fullPath?: string;
};

function parseTree({
    depTreeData,
    initData = [],
    rootPId,
    fullPath,
}: ParseTreeProps): DataNode[] {
    if (!depTreeData) {
        return initData;
    }

    const _fullPath = fullPath ? `${fullPath}/${depTreeData?.id}` : depTreeData?.id;
    initData.push({
        id: depTreeData?.id,
        title: depTreeData?.name,
        pId: depTreeData?.pid || rootPId,
        value: depTreeData?.id,
        fullPath: _fullPath,
    });
    if (depTreeData?.child) {
        depTreeData.child.map((dep) => parseTree({ depTreeData: dep, initData, fullPath: _fullPath }));
    }

    return initData;
}

const OrganizationPicker = ({
    rangeList,
    appID,
    onChange,
    optionalRange,
    defaultRange,
    defaultValues,
    editable = true,
    value = [],
    ...otherProps
}: Props): JSX.Element => {
    const cli = useContext(MatrixClientContext);
    const [data, setData] = useState<any>();
    useEffect(() => {
        // const { id, name } = getUserDepartment(window.USER);
        if (value.length) {
            return;
        }

        if (defaultRange === 'currentUserDep' || optionalRange === 'currentUserDep') {
            // onChange?.([{ label: name, value: id }]);
            return;
        }

        if (defaultValues && defaultValues.length) {
            onChange?.(defaultValues);
        }
    }, []);

    useEffect(() => {
        const noLabelValues = getNoLabelValues(value);

        if (noLabelValues.length) {
            getOrganizationDetail<{ deps: { id: string, name: string }[] }>(noLabelValues).then((res) => {
                const newValue = (value as LabelValue[]).map(({ label, value }) => {
                    if (value && !label) {
                        const deps = res?.deps || [];
                        const curUser = deps.find(({ id }) => id === value);
                        return { label: curUser?.name || '', value };
                    }

                    return { label, value };
                });
                onChange?.(newValue);
            });
        }
    }, []);

    // const { data } = useQuery(['query_dep_picker'], () => getERPTree());
    useEffect(() => {
        // getERPTree().then((res: any) => {
        //     setData(res?.data);
        // }).catch(err => {
        //     console.log(err);
        // });
        // cli.getQXPDeptist({ page: 1, size: 10 }).then((res: any) => {
        //     console.log('getQXPDeptist',res);
        //     const dept = {"code":0,"data":{"id":"1","name":"QXP","useStatus":1,"superID":"1","grade":1,"attr":2,"child":[{"id":"zHJBtnDT","name":"A测试部门","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"j1Gcw2QP","name":"权限部门1111","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":[{"id":"WggnpzbZ","name":"dfd","useStatus":1,"pid":"j1Gcw2QP","superID":"1","grade":3,"attr":-1,"child":null}]},{"id":"mxxQ7FLD","name":"部门名称c","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"HfHN9pN6","name":"dapr权限测试222","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":[{"id":"RalR7HCW","name":"ttt","useStatus":1,"pid":"HfHN9pN6","superID":"1","grade":3,"attr":2,"child":[{"id":"cV9KRWvT","name":"sda","useStatus":1,"pid":"RalR7HCW","superID":"1","grade":4,"attr":-1,"child":null}]}]},{"id":"rPTGT6rX","name":"com1","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":-1,"child":null},{"id":"aRfHRFxb","name":"aa","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"kK6FRrsr","name":"test","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":[{"id":"zGXGLlQx","name":"inner","useStatus":1,"pid":"kK6FRrsr","superID":"1","grade":3,"attr":2,"child":null}]},{"id":"49633824-9075-4ef0-a898-605c54b0e369","name":"sdffs1","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"25b90d92-b64e-412c-8f80-88fbeba8e503","name":"客服-工单处理","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"112866","name":"青云科技股份有限公司","useStatus":1,"pid":"1","superID":"1","attr":2,"child":[{"id":"223ba539-2dd9-48b6-803b-364af7339f43","name":"部门名称B","useStatus":1,"pid":"112866","superID":"1","grade":1,"attr":2,"child":null},{"id":"198130","name":"互联网部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":[{"id":"198145","name":"中后台部","useStatus":1,"pid":"198130","superID":"1","attr":2,"child":null},{"id":"198146","name":"运营支撑部","useStatus":1,"pid":"198130","superID":"1","attr":2,"child":null},{"id":"198144","name":"云市场部","useStatus":1,"pid":"198130","superID":"1","attr":2,"child":null},{"id":"112849","name":"销售部","useStatus":1,"pid":"198130","superID":"1","attr":2,"child":[{"id":"236216","name":"销售部北区","useStatus":1,"pid":"112849","superID":"1","attr":2,"child":null}]}]},{"id":"112814","name":"行业业务部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112810","name":"人力资源部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112804","name":"服务与咨询部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112809","name":"全象平台部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112808","name":"区域业务部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":[{"id":"198125","name":"西南区","useStatus":1,"pid":"112808","superID":"1","attr":2,"child":null},{"id":"112857","name":"西北区","useStatus":1,"pid":"112808","superID":"1","attr":2,"child":null}]},{"id":"112798","name":"产品体验部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112797","name":"财务部","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null},{"id":"112795","name":"总裁办","useStatus":1,"pid":"112866","superID":"1","attr":2,"child":null}]},{"id":"bfc922d5-3b27-4490-8ba2-d820340a43be","name":"临时测试使用","useStatus":1,"pid":"1","superID":"16e105d1-231b-4412-8191-9ad288a17d90","grade":2,"attr":2,"child":null},{"id":"f1a80bab-5fae-4cc0-bea4-febc5704c244","name":"工单组","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"79a685e1-429c-4bac-9108-58dc35715e00","name":"设计体验部门","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":[{"id":"ca97bcf3-d1d6-45ca-81f5-bab488ac02d9","name":"部门名称CC","useStatus":1,"pid":"79a685e1-429c-4bac-9108-58dc35715e00","superID":"1","grade":3,"attr":2,"child":[{"id":"45fafe94-efb1-40b3-b2c3-1c06a80123f1","name":"部门C1","useStatus":1,"pid":"ca97bcf3-d1d6-45ca-81f5-bab488ac02d9","superID":"1","grade":4,"attr":2,"child":null}]}]},{"id":"24b5888a-99c6-4f7e-b250-f0410b3ad6e2","name":"部门father","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":[{"id":"ceee3cff-660e-4d60-9408-03308b2f4893","name":"son1","useStatus":1,"pid":"24b5888a-99c6-4f7e-b250-f0410b3ad6e2","superID":"1","grade":3,"attr":2,"child":[{"id":"68169e46-2c19-4083-8638-ac657b77123a","name":"dep-1-1-1","useStatus":1,"pid":"ceee3cff-660e-4d60-9408-03308b2f4893","superID":"1","grade":4,"attr":2,"child":null}]}]},{"id":"a0643507-cd55-45e2-9004-dbdf6d337b2b","name":"部门名称A","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null},{"id":"3f96144c-6055-4eb8-b654-a19a09ac9702","name":"部门名称B","useStatus":1,"pid":"1","superID":"1","grade":2,"attr":2,"child":null}]}}
        //     setData(dept.data)
        // }).catch(err => {
        //     console.log(err);
        // });
    }, []);
    const treeData = React.useMemo(() => {
        const treeDataTmp = parseTree({ depTreeData: data, rootPId: data?.id });
        if (optionalRange === 'customize') {
            if (!rangeList || !rangeList.length) {
                return [];
            }

            const fullPaths: string[] = [];
            const visibleParentNodes: string[] = rangeList.reduce((acc, { value }) => {
                const nodeTmp = treeDataTmp?.find(({ id }) => id === value);
                if (nodeTmp) {
                    fullPaths.push(nodeTmp.fullPath);
                    return acc.concat(nodeTmp.fullPath.split('/'));
                }

                return acc;
            }, rangeList.map(({ value }) => value)).filter((id, index, self) => {
                return self.indexOf(id) === index;
            });

            return treeDataTmp.filter(({ id, fullPath }) => {
                if (visibleParentNodes.includes(id) || fullPaths.some((path) => fullPath.startsWith(path))) {
                    return true;
                }

                return false;
            });
        }

        if (optionalRange === 'currentUserDep') {
            // const { id, name } = getUserDepartment(window.USER);
            // const myDep = {
            //     id,
            //     fullPath: id,
            //     pId: 0,
            //     title: name,
            //     value: id,
            // };
            // return [myDep] || [];
            return [];
        }

        return treeDataTmp;
    }, [data, optionalRange, rangeList, defaultRange]);

    const handleChange = (selected: LabelValue | LabelValue[]): void => {
        if (!selected) {
            onChange([]);
            return;
        }

        onChange(([] as LabelValue[]).concat(selected));
    };

    if (!editable) {
        return (
            <span>
                {
                    value && value.length ?
                        labelValueRenderer(value) : '—'
                }
            </span>
        );
    }

    const selected = otherProps.multiple ? value : [...value].shift();

    return (
        <TreeSelect
            {...otherProps}
            allowClear
            labelInValue
            showSearch
            value={selected}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            className='flex-1 dep-selector'
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeNodeFilterProp="title"
            onChange={handleChange}
            treeData={treeData}
        />
    );
};

export default OrganizationPicker;
