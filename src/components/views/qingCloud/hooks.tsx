import { useEffect, useState } from "react";
import SettingsStore from "../../../settings/SettingsStore";
import ThemeWatcher from "../../../settings/watchers/ThemeWatcher";

export const useElementTheme = ()=>{
    const [elementTheme, setElementTheme] = useState<any>(new ThemeWatcher().getEffectiveTheme());
    useEffect(()=>{
        SettingsStore.watchSetting("theme", null, ()=>setElementTheme(new ThemeWatcher().getEffectiveTheme()));
    },[])
    return elementTheme;
}