export const schemaQxp = {
    "properties": {
        "_id": {
            "display": false,
            "readOnly": false,
            "title": "id",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {

            },
            "x-index": 5,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "created_at": {
            "display": false,
            "readOnly": false,
            "title": "创建时间",
            "type": "datetime",
            "x-component": "DatePicker",
            "x-component-props": {
                "isNow": false,
                "showTime": false,
                "style": {
                    "width": "100%",
                },
            },
            "x-index": 6,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "creator_id": {
            "display": false,
            "readOnly": false,
            "title": "创建者 ID",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {

            },
            "x-index": 9,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "creator_name": {
            "display": false,
            "readOnly": false,
            "title": "创建者",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {

            },
            "x-index": 8,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "field_2hCpvMbE": {
            "appID": "b7bsh",
            "defaultRange": "customize",
            "defaultValue": "",
            "description": "",
            "display": true,
            "displayModifier": "normal",
            "enum": [

            ],
            "loading": false,
            "multiple": "single",
            "optionalRange": "all",
            "placeholder": "",
            "rangeList": [

            ],
            "readOnly": false,
            "required": false,
            "title": "人员选择器",
            "type": "array",
            "x-component": "UserPicker",
            "x-component-props": {
                "allowClear": true,
                "appID": "b7bsh",
                "defaultRange": "customize",
                "defaultValue": "",
                "loading": false,
                "mode": "single",
                "multiple": "single",
                "optionalRange": "all",
                "placeholder": "",
                "rangeList": [

                ],
                "showSearch": true,
            },
            "x-index": 2,
            "x-internal": {
                "fieldId": "field_2hCpvMbE",
                "isSystem": false,
                "permission": 11,
            },
            "x-mega-props": {

            },
        },
        "field_HOjHmjJD": {
            "default": "",
            "description": "",
            "display": true,
            "format": "",
            "readOnly": false,
            "required": false,
            "title": "多行文本",
            "type": "string",
            "x-component": "Textarea",
            "x-component-props": {
                "autoSize": {
                    "minRows": 4,
                },
                "defaultValue": "",
                "placeholder": "",
                "rows": 4,
            },
            "x-index": 1,
            "x-internal": {
                "defaultValueFrom": "customized",
                "fieldId": "field_HOjHmjJD",
                "isSystem": false,
                "permission": 11,
                "sortable": false,
            },
            "x-mega-props": {

            },
        },
        "field_Qiaji7Xb": {
            "description": "",
            "display": true,
            "readOnly": true,
            "required": false,
            "title": "流水号",
            "type": "string",
            "x-component": "Serial",
            "x-component-props": {
                "appID": "b7bsh",
                "initialPosition": 5,
                "numberPreview": "",
                "prefix": {
                    "backward": "yyyyMMdd",
                    "frontward": "ER",
                },
                "startingValue": 1,
                "suffix": "",
                "template": "ER.date{yyyyMMdd}.incr[name]{5,1}.step[name]{1}.",
            },
            "x-index": 3,
            "x-internal": {
                "fieldId": "field_Qiaji7Xb",
                "isSystem": false,
                "permission": 3,
            },
            "x-mega-props": {

            },
        },
        "field_p1zps1LY": {
            "default": "",
            "description": "",
            "display": true,
            "format": "",
            "readOnly": false,
            "required": false,
            "title": "单行文本",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {
                "defaultValue": "",
                "placeholder": "",
            },
            "x-index": 0,
            "x-internal": {
                "defaultValueFrom": "customized",
                "fieldId": "field_p1zps1LY",
                "isSystem": false,
                "permission": 11,
                "sortable": false,
            },
            "x-mega-props": {

            },
        },
        "field_vOQZzYbD": {
            "description": "",
            "display": true,
            "items": {
                "properties": {
                    "_id": {
                        "display": false,
                        "readOnly": false,
                        "title": "id",
                        "type": "string",
                        "x-component": "Input",
                        "x-component-props": {

                        },
                        "x-index": -1,
                        "x-internal": {
                            "isSystem": true,
                            "permission": 3,
                        },
                        "x-mega-props": {
                            "labelCol": 4,
                        },
                    },
                },
                "type": "object",
            },
            "readOnly": false,
            "required": false,
            "title": "子表单",
            "type": "array",
            "x-component": "SubTable",
            "x-component-props": {
                "appID": "b7bsh",
                "rowLimit": "multiple",
                "subordination": "sub_table",
                "tableID": "d5pkx",
            },
            "x-index": 4,
            "x-internal": {
                "fieldId": "field_vOQZzYbD",
                "isSystem": false,
                "permission": 11,
                "sortable": false,
            },
            "x-mega-props": {

            },
            "x-rules": [

            ],
        },
        "modifier_id": {
            "display": false,
            "readOnly": false,
            "title": "修改者 ID",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {

            },
            "x-index": 11,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "modifier_name": {
            "display": false,
            "readOnly": false,
            "title": "修改者",
            "type": "string",
            "x-component": "Input",
            "x-component-props": {

            },
            "x-index": 10,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
        "updated_at": {
            "display": false,
            "readOnly": false,
            "title": "修改时间",
            "type": "datetime",
            "x-component": "DatePicker",
            "x-component-props": {
                "isNow": false,
                "showTime": false,
                "style": {
                    "width": "100%",
                },
            },
            "x-index": 7,
            "x-internal": {
                "isSystem": true,
                "permission": 4,
            },
        },
    },
    "title": "7777",
    "type": "object",
    "x-internal": {
        "columns": 1,
        "defaultValueFrom": "customized",
        "labelAlign": "top",
        "validations": [

        ],
        "version": "1.3.13",
        "visibleHiddenLinkages": [

        ],
    },
};

export const schemaCreateForm = {
    "version": "1.0",
    "type": "object",
    "properties": {
        "string": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "String",
            "name": "string",
            "x-component": "input",
        },
        "radio": {
            "version": "1.0",
            "key": "radio",
            "type": "string",
            "enum": [
                "1",
                "2",
                "3",
                "4",
            ],
            "title": "Radio",
            "name": "radio",
            "x-component": "radio",
        },
        "select": {
            "version": "1.0",
            "key": "select",
            "type": "string",
            "enum": [
                "1",
                "2",
                "3",
                "4",
            ],
            "title": "Select",
            "name": "select",
            "x-component": "select",
        },
        "checkbox": {
            "version": "1.0",
            "key": "checkbox",
            "type": "string",
            "enum": [
                "1",
                "2",
                "3",
                "4",
            ],
            "title": "Checkbox",
            "name": "checkbox",
            "x-component": "checkbox",
        },
        "textarea": {
            "version": "1.0",
            "key": "textarea",
            "type": "string",
            "title": "TextArea",
            "name": "textarea",
            "x-component": "textarea",
        },
        "number": {
            "version": "1.0",
            "key": "number",
            "type": "number",
            "title": "数字选择",
            "name": "number",
            "x-component": "numberpicker",
        },
        "boolean": {
            "version": "1.0",
            "key": "boolean",
            "type": "boolean",
            "title": "开关选择",
            "name": "boolean",
            "x-component": "switch",
        },
        "date": {
            "version": "1.0",
            "key": "date",
            "type": "string",
            "title": "日期选择",
            "name": "date",
            "x-component": "datepicker",
        },
        "daterange": {
            "version": "1.0",
            "key": "daterange",
            "type": "array<date>",
            "title": "日期范围",
            "default": [
                "2018-12-19",
                "2018-12-19",
            ],
            "name": "daterange",
            "x-component": "daterangepicker",
        },
        "year": {
            "version": "1.0",
            "key": "year",
            "type": "string",
            "title": "年份",
            "name": "year",
            "x-component": "yearpicker",
        },
        "month": {
            "version": "1.0",
            "key": "month",
            "type": "string",
            "title": "月份",
            "name": "month",
            "x-component": "monthpicker",
        },
        "time": {
            "version": "1.0",
            "key": "time",
            "type": "string",
            "title": "时间",
            "name": "time",
            "x-component": "timepicker",
        },
        "timerange": {
            "version": "1.0",
            "key": "timerange",
            "type": "string",
            "title": "时间范围",
            "name": "timerange",
            "x-component": "timerangepicker",
        },
        "week": {
            "version": "1.0",
            "key": "week",
            "type": "string",
            "title": "周",
            "name": "week",
            "x-component": "weekpicker",
        },
        "upload": {
            "version": "1.0",
            "key": "upload",
            "type": "array",
            "title": "卡片上传文件",
            "name": "upload",
            "x-component-props": {
                "listType": "card",
            },
            "x-component": "upload",
        },
        "upload2": {
            "version": "1.0",
            "key": "upload2",
            "type": "array",
            "title": "拖拽上传文件",
            "name": "upload2",
            "x-component-props": {
                "listType": "dragger",
            },
            "x-component": "upload",
        },
        "upload3": {
            "version": "1.0",
            "key": "upload3",
            "type": "array",
            "title": "普通上传文件",
            "name": "upload3",
            "x-component-props": {
                "listType": "text",
            },
            "x-component": "upload",
        },
        "range": {
            "version": "1.0",
            "key": "range",
            "type": "number",
            "title": "范围选择",
            "name": "range",
            "x-component-props": {
                "min": 0,
                "max": 1024,
                "marks": [
                    0,
                    1024,
                ],
            },
            "x-component": "range",
        },
        "transfer": {
            "version": "1.0",
            "key": "transfer",
            "type": "number",
            "enum": [
                {
                    "key": 1,
                    "title": "选项1",
                },
                {
                    "key": 2,
                    "title": "选项2",
                },
            ],
            "x-component-props": {},
            "title": "穿梭框",
            "name": "transfer",
            "x-component": "transfer",
        },
        "rating": {
            "version": "1.0",
            "key": "rating",
            "type": "number",
            "title": "等级",
            "name": "rating",
            "x-component": "rating",
        },
    },
};

export const schemaEditForm = {
    "version": "1.0",
    "type": "object",
    "properties": {
        "textarea": {
            "version": "1.0",
            "key": "textarea",
            "type": "string",
            "title": "处理意见",
            "name": "textarea",
            "x-component": "textarea",
        },
    },
};

export const schemaViewForm = {
    "version": "1.0",
    "type": "object",
    "properties": {
        "string1": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "申请日期",
            "name": "string1",
            "x-component": "input",
        },
        "string2": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "申请人",
            "name": "string2",
            "x-component": "input",
        },
        "string3": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "事由",
            "name": "string3",
            "x-component": "input",
        },
        "string4": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "开始日期",
            "name": "string4",
            "x-component": "input",
        },
        "string5": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "结束日期",
            "name": "string5",
            "x-component": "input",
        },
        "string6": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "出发地",
            "name": "string6",
            "x-component": "input",
        },
        "string7": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "目的地",
            "name": "string7",
            "x-component": "input",
        },
        "string8": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "交通工",
            "name": "string8",
            "x-component": "input",
        },
        "string9": {
            "version": "1.0",
            "key": "string",
            "type": "string",
            "title": "费用承担部门",
            "name": "string9",
            "x-component": "input",
        },
    },
};

export const initialValues= {
    string1: '2022/9/13',
    string2: '郑家锋',
    string3: '测试',
    string4: '2022/9/13',
    string5: '2022/9/13',
    string6: '成都',
    string7: '成都',
    string8: '飞机',
    string9: '数字化技术部',
    // daterange: ['2018-12-19', '2018-12-19'],
    // string: 'this is string',
    // radio: '2',
    // checkbox: ['2', '3', '4'],
    // textarea:
    //   'this is long text.this is long text.this is long text.this is long text.this is long text.',
    // rating: 3,
    // transfer: [1, 2],
    // range: 384,
    // date: '2020-02-20',
    // month: '2020-08',
    // year: '2023',
    // time: '22:29:53',
    // timerange: ['9:00:00', '18:00:00'],
    // week: '2020-9th',
    // number: 123,
    // boolean: true,
    // select: '2',
};
