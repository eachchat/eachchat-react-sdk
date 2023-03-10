/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useEffect } from "react";

import AutoHideScrollbar from "../../../structures/AutoHideScrollbar";
import dis from '../../../../dispatcher/dispatcher';
import { Action } from "../../../../dispatcher/actions";
import YiQiaContactList from "./YiQiaContactList";
import { ConfigProvider, theme } from "antd";
import { ConfitProviderToken, Theme } from "../constant";
import { useElementTheme } from "../hooks";

const YiQiaContact = () => {
    const elementTheme = useElementTheme();
    
    useEffect(() => {
        sessionStorage.removeItem('activeContactData');
        dis.dispatch({
            action: Action.ViewYiqiaContact,
        });
    }, []);


    return (
        <AutoHideScrollbar>
            <ConfigProvider
                theme={{
                    algorithm: elementTheme === Theme.Lignt ?  theme.defaultAlgorithm : theme.darkAlgorithm,
                    token: ConfitProviderToken
                }}
            >
            <div className="yiqia_ContactBody">
                <div className="title"
                    style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginBottom: "20px",
                    }}>通讯录</div>

                <YiQiaContactList/>
            </div>
            </ConfigProvider>
        </AutoHideScrollbar>
    );
};

export default React.memo(YiQiaContact);
