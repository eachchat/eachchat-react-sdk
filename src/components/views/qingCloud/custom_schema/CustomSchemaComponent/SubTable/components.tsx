import { Radio, Select } from '@formily/antd-components';
import { Input } from 'antd';

import CheckboxGroup from '../CheckboxGroup';
import DatePicker from '../DatePicker';
import FileUpload from '../FileUpload';
import ImageUpload from '../ImageUpload';
import MultipleSelect from '../MultipleSelect';
import NumberPicker from '../NumberPicker';
import OrganizationPicker from '../OrganizationPicker';
import Serial from '../Serial';
import UserPicker from '../UserPicker';
import AggregationRecords from '../AggregationRecords';
import AssociatedData from '../AssociatedData';
import CascadeSelector from '../CascadeSelector';

export const components: any = {
    input: Input,
    radiogroup: Radio.Group,
    checkboxgroup: CheckboxGroup,
    textarea: Input.TextArea,
    datepicker: DatePicker,
    numberpicker: NumberPicker,
    select: Select,
    multipleselect: MultipleSelect,
    userpicker: UserPicker,
    organizationpicker: OrganizationPicker,
    fileupload: FileUpload,
    imageupload: ImageUpload,
    cascadeselector: CascadeSelector,
    associateddata: AssociatedData,
    serial: Serial,
    aggregationrecords: AggregationRecords,
};
