/* eslint-disable max-len */
import { ISchema } from '@formily/antd';
import { flattenDeep, get, isArray, isEmpty, isObject, isString, omit } from 'lodash';
import fp from 'lodash/fp';
import moment from 'moment';

import { READONLY_NO_WRITE, READONLY_WITH_WRITE, INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE, NORMAL, INVALID_READONLY_LEGACY, INVALID_NORMAL } from './constants';
import { CurrentUser, Department, LabelValue, Linkage, PERMISSION, QXPUploadFileBaseProps } from './interface';

export function getNoLabelValues(value: LabelValue[]): string[] {
    return ((value || []) as LabelValue[]).reduce<string[]>((acc, val) => {
        // Es object conversion label is missing
        if (val.value && !val.label) {
            return [...acc, val.value];
        }

        return acc;
    }, []);
}

export function buildGraphQLQuery(params: any): number | string {
    if (typeof params === 'number') {
        return params;
    }

    if (typeof params !== 'object' || Array.isArray(params)) {
        return JSON.stringify(params);
    }

    const props = Object.entries(params).map(([key, value]) => `${key}:${buildGraphQLQuery(value)}`).join(',');

    return `query(${props})`;
}

export function labelValueRenderer(value: any): string {
    if (Array.isArray(value)) {
        const labels = value.map(({ label }) => label).join(', ');
        return labels;
    }

    if (isString(value)) {
        return value;
    }
    return (value)?.label;
}

export function getUserDepartment(user: CurrentUser): Department {
    const dep = getTwoDimenArrayHead(user.deps) as Department;
    return dep;
}

export function getTwoDimenArrayHead<T>(dep?: T[][]): T | undefined {
    return dep?.[0]?.[0];
}

export function isMeanless(value: any): boolean {
    if (value === undefined || value === null || value === '' || value.toString() === '') {
        return true;
    }

    return false;
}

export function numberTransform(schema: any): number {
    const { pipe, get, toNumber, isFinite } = fp;
    const _numberTransform = pipe(get('x-index'), toNumber, (value) => {
        return (isNaN(value) || !isFinite(value)) ? 0 : value;
    });
    return _numberTransform(schema);
}

export function isPermissionReadable(permission: PERMISSION): boolean {
    return [
        READONLY_NO_WRITE, READONLY_WITH_WRITE, INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE, NORMAL,
        INVALID_READONLY_LEGACY,
    ].includes(permission);
}

export function isPermissionHiddenAble(permission: PERMISSION): boolean {
    return [INVISIBLE_NO_WRITE, INVISIBLE_WITH_WRITE].includes(permission);
}

export function isPermissionWriteable(permission: PERMISSION): boolean {
    return [READONLY_WITH_WRITE, INVISIBLE_WITH_WRITE, NORMAL].includes(permission);
}

export function isPermissionEditable(permission?: PERMISSION): boolean {
    return NORMAL === permission || permission === INVALID_NORMAL;
}

export function schemaRulesTransform(schema: ISchema): any {
    const { pipe, get } = fp;
    function toArray<T>(value: T): T[] {
        return isArray(value) ? value : [value].filter(Boolean);
    }
    const getRules = pipe(
        get('x-rules'),
        toArray,
    );
    const getFormats = pipe(
        get('format'),
        toArray,
    );
    return [...getRules(schema), ...getFormats(schema)];
}

export function getDefaultValue(sc: ISchema): any {
    const componentProps = sc['x-component-props'] || {};
    const componentType = sc.type;
    const isArrayType = componentType === 'array';

    let defaultValue = sc.default || componentProps?.defaultValue;
    if (!defaultValue) {
        if (
            componentProps.defaultValues?.length || (isObject(componentProps.defaultValues) &&
          !isEmpty(componentProps.defaultValues))
        ) {
            defaultValue = componentProps.defaultValues;
        }
    }

    if (isArrayType) {
        return isArray(defaultValue) ? defaultValue : [defaultValue].filter(Boolean);
    }

    return defaultValue;
}

export function findAllFormula(schema: ISchema, subTableFieldName?: string): Array<Linkage> {
    const linkages = Object.keys(schema.properties || {}).map<Linkage | Linkage[]>((fieldName) => {
        const field = get(schema, `properties.${fieldName}`);
        const defaultValueFrom = get(field, 'x-internal.defaultValueFrom');
        const calculationFormula = get(field, 'x-internal.calculationFormula');
        if (field.items && field['x-component']?.toLowerCase() === 'subtable') {
            return findAllFormula(field.items as ISchema, fieldName);
        }

        if (!calculationFormula || defaultValueFrom !== 'formula') {
            return [];
        }

        return {
            rawFormula: calculationFormula,
            targetField: subTableFieldName ? `${subTableFieldName}.*.${fieldName}` : fieldName,
        };
    });
    return flattenDeep(linkages).filter((linkage): linkage is Linkage => !!linkage);
}

export function omitParentFromSchema(schema: ISchema): ISchema {
    return JSON.parse(JSON.stringify(omit(['parent'], schema as any)));
}

export function getFieldPath(linkageRulePath: string, fieldRealPath: string): string {
    const [match] = /\.\d+\./.exec(fieldRealPath) || [];
    return match ? linkageRulePath.replace('.*.', match) : linkageRulePath;
}

function numberPickerValueRender({ schema, value }: any): string {
    return Number(value).toFixed(schema?.['x-component-props']?.precision || 0);
}

function stringListValue({ value }: any): string {
    if (!Array.isArray(value)) {
        return '';
    }

    return value.join(', ');
}

function datetimeValueRenderer({ value, schema }: any): string {
    const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

    return value ? moment(value as string).format(format) : '';
}

function statisticValueRender({ schema, value }: any): string {
    const { decimalPlaces, roundDecimal, displayFieldNull } = schema['x-component-props'] as {
    decimalPlaces: number; roundDecimal: any; displayFieldNull: string;
  };
    let method = Math.round;
    if (roundDecimal === 'round-up') {
        method = Math.ceil;
    } else if (roundDecimal === 'round-down') {
        method = Math.floor;
    }
    return method(parseFloat(value as string)).toFixed(decimalPlaces) + '' || displayFieldNull;
}

export function getBasicValue(schema: ISchema, value: any): string {
    switch (schema['x-component']?.toLowerCase()) {
        case 'input':
        case 'textarea':
        case 'radiogroup':
        case 'select':
        case 'serial':
            return value as string;
        case 'numberpicker':
            return numberPickerValueRender({ schema, value });
        case 'checkboxgroup':
        case 'multipleselect':
            return stringListValue({ schema, value });
        case 'datepicker':
            return datetimeValueRenderer({ schema, value });
        case 'associateddata':
        case 'cascadeselector':
        case 'userpicker':
        case 'organizationpicker':
            return labelValueRenderer(value);
        case 'aggregationrecords':
            return statisticValueRender({ schema, value });
        default:
            return value?.toString();
    }
}

export function operatorESParameter(key: string, op: string, value: any): any {
    let _value = value;
    let _key = key;
    if (typeof value === 'object' && op !== 'range') {
        if (Array.isArray(_value) && typeof _value[0] === 'object') {
            _value = _value.map((_value) => (_value as LabelValue).value);
            _key = `${key}.value`;
        } else if (!Array.isArray(_value)) {
            _value = (_value as LabelValue).value;
            if (!_value) {
                return;
            }
            _key = `${key}.value`;
        }
    }

    switch (op) {
        case 'range': {
            const [start, end] = _value as any[];
            return {
                range: {
                    [_key]: {
                        gte: start,
                        lt: end,
                    },
                },
            };
        }
        case 'eq':
            return {
                term: {
                    [_key]: _value,
                },
            };
        case 'gt':
        case 'lt':
        case 'gte':
        case 'lte':
            return {
                range: {
                    [_key]: { [op]: _value },
                },
            };
        case 'fullSubset':
            return {
                bool: {
                    must: (_value as any[]).map((valueItem) => {
                        return {
                            term: {
                                [_key]: valueItem,
                            },
                        };
                    }),
                },
            };
        case 'intersection':
            return {
                terms: {
                    [_key]: _value,
                },
            };
        case 'ne':
            return {
                bool: {
                    must_not: [
                        {
                            term: {
                                [_key]: _value,
                            },
                        },
                    ],
                },
            };
        case 'exclude':
            return {
                bool: {
                    must_not: [
                        {
                            terms: {
                                [_key]: _value,
                            },
                        },
                    ],
                },
            };
        case 'like':
            return {
                match: {
                    [_key]: _value,
                },
            };
        default:
            return {
                match: {
                    [_key]: _value,
                },
            };
    }
}

// TODO 暂时兼容方法
export function toEs(filterConfig) {
    const rule= [];
    filterConfig.condition.forEach(({ key = '', value, op = '' }) => {
        if (!value) {
            return;
        }

        const searchItem = operatorESParameter(key, op, value);
        if (searchItem) {
            rule.push(operatorESParameter(key, op, value));
        }
    });

    return rule.length ? { bool: { [filterConfig.tag]: rule } } : {};
}

export const isMacosX = /macintosh|mac os x/i.test(navigator.userAgent);

export function isAcceptedFileType(file: File | QXPUploadFileBaseProps, accept: string[]): boolean {
    const suffix = file.name.split('.').pop();
    if (!accept || !suffix) return false;
    const { type: fileType } = file;
    return accept.some((acceptType) => acceptType === fileType || acceptType.split('/')[1]?.includes(suffix) ||
    acceptType.split('.')[1]?.includes(suffix));
}

export function createQueue(
    tasks: (() => Promise<void>)[],
    maxNumOfWorkers = 1,
): Promise<void> {
    let numOfWorkers = 0;
    let taskIndex = 0;

    return new Promise((done, failed) => {
        const getNextTask = (): void => {
            if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
                tasks[taskIndex]()
                    .then(() => {
                        numOfWorkers -= 1;
                        getNextTask();
                    })
                    .catch((error: Error) => {
                        failed(error);
                    });
                taskIndex += 1;
                numOfWorkers += 1;
                getNextTask();
            } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
                done();
            }
        };
        getNextTask();
    });
}
