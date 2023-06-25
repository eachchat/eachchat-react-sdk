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

const desktopHost = SdkConfig.get('setting_defaults')?.QingCloud?.desktop_host;
export const elementBaseURL = desktopHost ? `${desktopHost}/element` : 'element';
export const nextCloudBaseURL = desktopHost ? `${desktopHost}/nextCloud` : 'nextCloud';