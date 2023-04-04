import SdkConfig from "../../../SdkConfig";

export enum ShareType {
    User = 0, //人
    Dept = 1,   //部门
}

export enum Theme {
    Lignt = "light",
    Dark = "dark"
}

export  const ConfitProviderToken =  {
    colorPrimary: '#0dbd8b',
    colorLink: '#0dbd8b',
    colorLinkActive: '#0dbd8b',
    colorLinkHover: '#0dbd8b',
    colorBgContainer: 'transparent',
}

const desktop_host = SdkConfig.get('setting_defaults').desktop_host;
export const elementBaseURL = desktop_host ? `${desktop_host}/element` : 'element';
export const nextCloudBaseURL = desktop_host ? `${desktop_host}/nextCloud` : 'nextCloud';