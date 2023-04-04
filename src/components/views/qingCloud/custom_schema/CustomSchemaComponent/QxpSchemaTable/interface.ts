import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";

export interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export type TableColumnConfig = {
  id: string;
  width?: number;
}