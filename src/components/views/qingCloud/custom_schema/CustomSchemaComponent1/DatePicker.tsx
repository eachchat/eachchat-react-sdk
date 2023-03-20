import React, { useState } from 'react';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { DatePicker, DatePickerProps } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';

enum IDateType {
    date = 'date',
    use12Hours = 'use12Hours',
}

interface IProps {
    dateType?: IDateType;
    defaultValue?: string;
    onChange?: (data) => void;
}

const AM = '上午';
const PM = '下午';

enum meridiem{
    AM=1,
    PM=2,
}

const mapMeridiem = {
    1: AM,
    2: PM,
};

const CustomDatePicker = (props: IProps) => {
    // const [initFlag, setInitFlag]=useState(true);
    const { dateType, onChange, defaultValue, format, isNow, placeholder, showTime  }=props;
    // let showTime: boolean|object = false;

    // if (dateType===IDateType.use12Hours) {
    //     moment.locale('zh-cn', {
    //         meridiem: function(hour, minute) {
    //             const hm = hour * 100 + minute;
    //             if (hm < 1200) {
    //                 return AM;
    //             } else {
    //                 return PM;
    //             }
    //         },
    //     });
    //     showTime ={
    //         showNow: false,
    //         format: 'a',
    //         use12Hours: true,
    //     };
    // }

    // const customFormat: DatePickerProps['format'] = value => {
    //     const m = moment(value);
    //     const h =m.get('h');
    //     const dateFormat = 'YYYY-MM-DD';
    //     const meridiem = h<12 ? AM : PM;
    //     if (initFlag && defaultValue) {
    //         const dateArr = defaultValue.split(' ');
    //         return `${dateArr[0]} ${mapMeridiem[dateArr[1]]}`;
    //     }
    //     return `${value.format(dateFormat)} ${meridiem}`;
    // };

    const handleChange = (date, dateString) => {
        // initFlag && setInitFlag(false);
        // onChange && onChange(dateString.replace(AM, meridiem.AM).replace(PM, meridiem.PM));
        onChange && onChange(dateString);
    };

    return <div className='custom-schema-component'>
        <DatePicker
            className='custom-schema-component'
            popupClassName='custom-schema-component'
            locale={locale}
            showNow={isNow}
            showTime={showTime}
            format={format || "YYYY-MM-DD"}
            placeholder={placeholder}
            onChange={handleChange}
            defaultValue={moment(defaultValue)}
        />
    </div>;
};

export default CustomDatePicker;
