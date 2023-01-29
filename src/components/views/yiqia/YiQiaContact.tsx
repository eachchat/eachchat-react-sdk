/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useEffect } from "react";

import AutoHideScrollbar from "../../structures/AutoHideScrollbar";
import dis from '../../../dispatcher/dispatcher';
import { Action } from "../../../dispatcher/actions";
import YiQiaContactList from "./YiQiaContactList";

const YiQiaContact = (props) => {
    const { contactContent, onReload }=props;
    useEffect(() => {
        sessionStorage.removeItem('activeContactData');
        dis.dispatch({
            action: Action.ViewYiqiaContact,
            context: 'organization',
        });
    }, []);

    const handleReload = () => onReload && onReload();

    return (
        <AutoHideScrollbar>
            <div className="yiqia_ContactBody">
                <div className="title"
                    style={{
                        fontWeight: "bold",
                        fontSize: '14px',
                    }}>通讯录</div>

                <YiQiaContactList
                    loading={contactContent.loading}
                    userList={contactContent.userList}
                    error={contactContent.error}
                    onReload={handleReload}
                />
            </div>
        </AutoHideScrollbar>
    );
};

export default React.memo(YiQiaContact);
