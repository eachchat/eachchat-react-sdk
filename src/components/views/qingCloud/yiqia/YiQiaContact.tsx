/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useEffect } from "react";

import AutoHideScrollbar from "../../../structures/AutoHideScrollbar";
import dis from '../../../../dispatcher/dispatcher';
import { Action } from "../../../../dispatcher/actions";
import YiQiaContactList from "./YiQiaContactList";

const YiQiaContact = () => {
    useEffect(() => {
        sessionStorage.removeItem('activeContactData');
        dis.dispatch({
            action: Action.ViewYiqiaContact,
        });
    }, []);


    return (
        <AutoHideScrollbar>
            <div className="yiqia_ContactBody">
                <div className="title"
                    style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginBottom: "20px",
                    }}>通讯录</div>

                <YiQiaContactList/>
            </div>
        </AutoHideScrollbar>
    );
};

export default React.memo(YiQiaContact);
