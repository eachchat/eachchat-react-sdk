import * as React from "react";
import { useEffect, useState } from "react";

import YiQiaContactList from "../views/yiqia/YiQiaContactList";
import YiQiaOrgTree from '../views/yiqia/YiQiaOrgTree';

const mapActiveKey = {
    'organization': '组织架构',
    'my_contact': '我的联系人',
};
const YiqiaContactUserPage = (props: any) => {
    const { activeKey }=props;
    const [orgDeptId, setOrgDeptId]=useState();

    return <div className="yiqia_ContactUser_page">
        <div className="header">
            <span className="title">
                { mapActiveKey[activeKey] }
            </span>
        </div>
        <div className="content">
            <div className="organization-wrap">
                <div className="tree">
                    <YiQiaOrgTree
                        onSelect={setOrgDeptId}
                    />
                </div>
                <div className="contactList">
                    <YiQiaContactList
                        id={orgDeptId} />
                </div>
            </div>

        </div>
    </div>;
};

export default YiqiaContactUserPage;
