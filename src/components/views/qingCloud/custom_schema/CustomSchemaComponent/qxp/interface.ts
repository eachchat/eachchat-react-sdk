import { IFieldState, IForm, IMutators, ISchema, Schema, ValidatePatternRules } from "@formily/antd";
import { Rule } from "antd/lib/form";
import { Moment } from "moment";
import { JSXElementConstructor } from "react";

/* eslint-disable @typescript-eslint/naming-convention */
export type LabelValue = {
    label: string;
    value: string;
};

export interface Employee {
    id: string;
    name: string;
    phone: string;
    email: string;
    selfEmail?: string;
    idCard?: string;
    address?: string;
    avatar?: string;
    jobNumber?: string;
    gender?: 0 | 1 | 2;
    source?: string;
    useStatus?: number;
    status?: number;
    position?: string;
    depName?: string;
    departments?: Department[][];
    deps?: Department[][];
    leaders?: Leader[][];
  }

export interface Department {
    id: string;
    name: string;
    useStatus?: number;
    pid: string;
    superID: string;
    grade: number;
    child?: Array<Department>;
    leaderID?: string;
    attr: string | number;
    // deprecated
    departmentName?: string;
    departmentLeaderId?: string;
    superId?: string;
  }

export type Leader = {
    id: string;
    name: string;
  };

export interface Option {
    label: string;
    value: string;
    email: string;
  }

export interface Organization {
    name: string;
    id: string;
    pid: string;
    child?: Organization[];
    fullPath?: string;
  }

export type UserDepartment = {
    id: string;
    name: string;
    leaderID: string;
    pid: string;
    superID: string;
    grade: number;
    attr: 1 | 2;
  };
export type CurrentUser = {
    id: string;
    avatar: string;
    name: string;
    status: number;
    useStatus: number;
    selfEmail: string;
    email: string;
    phone: string;
    depIds: string[];
    deps: UserDepartment[][];
  };

export interface Department {
    id: string;
    name: string;
    useStatus?: number;
    pid: string;
    superID: string;
    grade: number;
    child?: Array<Department>;
    leaderID?: string;
    attr: string | number;
    // deprecated
    departmentName?: string;
    departmentLeaderId?: string;
    superId?: string;
  }

export declare enum OptionSetType {
    OptionSetListType = 1,
    OptionSetTreeType = 2,
  }

export type OptionSet = {
    id: string;
    name: string;
    tag?: string;
    type: OptionSetType;
    content?: string; // all option-set items serialized into content
  };

export type METHOD = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiDataType=[string, METHOD];

export type OptionSetListItem = {
  label: string;
  value: string;
};

export type AggType = 'count' | 'sum' | 'max' | 'min' | 'avg';
export type RoundMethod = 'round' | 'round-up' | 'round-down';

export interface QXPUploadFileBaseProps {
  uid: string;
  type: string;
  name: string;
  size: number;
}

export type QxpFileFormData = {
  label: string;
  value: string;
  type: string;
  size?: number;
};

export type FormFieldOption = {
  label: string;
  value: string;
  isSystem: boolean;
  isLayout: boolean;
  path: string;
  read: boolean;
  write: boolean;
  invisible: boolean;
  editable: boolean;
};

export type INVALID_PERMISSION = 4 | 8 | 9;

export type PERMISSION = 0 | 1 | 3 | 5 | 7 | 11 | INVALID_PERMISSION;

export type SchemaFieldItem = ISchema & {
  id: string;
  fieldName: string;
  componentName: string;
  tabIndex?: string;
};

type FilterTag = 'should' | 'must';

type FormValueArray =
    | Record<string, unknown>[]
    | number[]
    | string[]
    | LabelValue[]
    | Moment[];

type FormValue = string
    | Record<string, unknown>
    | number
    | FormValueArray
    | Moment;

type ValueFrom = 'form' | 'fixedValue';

type Condition = {
  key?: string;
  op?: string;
  value?: FormValue;
  valueFrom?: ValueFrom;
  path?: string;
};

export type FilterConfig = {
  condition: Condition[];
  tag: FilterTag;
};

export type GetTableSchemaResponse = null | { config: any, schema: ISchema, id: string, tableID: string };

export type Rules = (ValidatePatternRules | ValidatePatternRules[]) & Rule[];
export type Column = {
  title: string;
  dataIndex: string;
  componentName: string;
  props: Record<string, any>;
  readOnly: boolean;
  rules: Rules;
  schema: ISchema;
  component: JSXElementConstructor<any>;
  dataSource?: any[];
  required?: boolean;
  render?: (value: unknown) => JSX.Element;
};

export type Layout = 'default' | 'one' | 'two' | 'three';

export type Linkage = { rawFormula: string, targetField: string };

export type FormInfoCardDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
};

export type GroupInfo = {
  key: string;
  title: string;
  groups: FormInfoCardDataProp[];
};

export type FormDetailData = {
  type: 'details'| 'group';
  itemInfo: FormInfoCardDataProp | GroupInfo;
};

export interface QXPFilePartBlob {
  chunkBlob: Blob;
  partNumber: number;
}

export interface QXPUploadFileBaseProps {
  uid: string;
  type: string;
  name: string;
  size: number;
}

export interface QXPUploadFileTask extends QXPUploadFileBaseProps {
  uploadID?: string;
  progress?: number;
  state?: 'uploading' | 'processing' | 'success' | 'failed';
  blob?: File;
  md5?: string;
  uploadUrl?: string;
  md5Worker?: Worker | null;
  fileChunks?: QXPFilePartBlob[] | null;
}

export type FileUploaderProps = {
  accept?: string[];
  iconName?: string;
  isPrivate?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number;
  canDownload?: boolean;
  style?: React.CSSProperties;
  additionalPathPrefix?: string;
  originalThumbnail?: boolean;
  uploaderDescription?: React.ReactNode;
  fileData?: QXPUploadFileBaseProps[];
  children?: React.ReactNode;
  onFileDelete?: (file: QXPUploadFileBaseProps) => void;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
  onFileError?: (err: Error, file: QXPUploadFileBaseProps) => void;
  onFileAbort?: (file: QXPUploadFileBaseProps | QXPUploadFileBaseProps[]) => void;
};

export interface ISchemaFieldComponentProps extends IFieldState {
  schema: Schema;
  mutators: IMutators;
  form: IForm;
  renderField: (addtionKey: string | number, reactKey?: string | number) => React.ReactElement;
}

export type FileStoreProps = {
  files: QXPUploadFileBaseProps[];
  fileBucket: string;
  requestThumbnail?: boolean;
  additionalPathPrefix?: string;
  onSuccess?: (file: QXPUploadFileTask) => void;
  onError?: (err: Error, file: QXPUploadFileTask) => void;
};
