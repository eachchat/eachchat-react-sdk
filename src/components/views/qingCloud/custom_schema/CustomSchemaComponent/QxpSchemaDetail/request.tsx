import { ISchema } from "@formily/antd";

import httpClient from "../qxp/http";
import { GetTableSchemaResponse } from "../qxp/interface";
import schemaToFields from "../qxp/schema-convert";
import { toEs } from "../qxp/utils";
import { getTableSchema } from "../SubTable/request";

export function buildQueryRef(schema: ISchema) {
    const refFields = schemaToFields(schema, (schemaField) => {
        return ['SubTable', 'AggregationRecords', 'AssociatedRecords'].includes(schemaField['x-component'] || '');
    });

    const ref = {};
    if (refFields.length) {
        refFields.forEach((field) => {
            switch (field.componentName) {
                case 'subtable': {
                    const { subordination, appID, tableID } = field?.['x-component-props'] || {};
                    ref[field.id] = {
                        type: subordination || 'sub_table',
                        appID,
                        tableID,
                    };
                    break;
                }
                case 'associatedrecords': {
                    const { appID, tableID } = field?.['x-component-props'] || {};
                    ref[field.id] = {
                        type: 'associated_records',
                        appID,
                        tableID,
                    };
                    break;
                }
                case 'aggregationrecords': {
                    const {
                        sourceFieldId, appID, tableID, aggType, fieldName, condition,
                    } = field?.['x-component-props'] || {};

                    ref[field.id] = {
                        type: 'aggregation',
                        query: condition ? toEs(condition) : null,
                        tableID,
                        appID,
                        sourceFieldId,
                        aggType,
                        fieldName,
                    };
                    break;
                }
            }
        });
    }

    return ref;
}

export function findOneFormDataRequest(
    appID: string,
    tableID: string,
    rowID: string,
    schema: ISchema,
): Promise<Record<string, any>> {
    if (!rowID) {
        return Promise.resolve({});
    }

    return httpClient<any>(
        `/api/v1/form/${appID}/home/form/${tableID}/get`,
        {
            ref: buildQueryRef(schema),
            query: {
                term: { _id: rowID },
            },
        },
    ).then(({ entity }) => {
        if (!entity) {
        // 只查 schema 的时候不要 reject
            return {};
        }

        return entity;
    });
}

export async function fetchOneFormDataWithSchema(
    appID: string,
    tableID: string,
    rowID: string,
): Promise<{ schemaRes?: GetTableSchemaResponse, record?: Record<string, any> }> {
    const schemaRes = await getTableSchema(appID, tableID);
    if (!schemaRes?.schema) {
        return {};
    }

    const record = await findOneFormDataRequest(appID, tableID, rowID, schemaRes.schema);
    return { schemaRes, record };
}
