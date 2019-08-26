import React, {ReactNode} from "react";
import { Input, InputNumber, Form, Select } from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {EditableContext} from "./context";


// table column data type
export interface keyValueMap {
  text: string;
  value: string;
}

// table column data type
export interface EditableColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
  fieldType?: "text" | "number" | "select";
  selectData?: Array<keyValueMap>;
}

export interface EditableCellProps<T> {
  dataIndex: number;
  title: string;
  editing: boolean;
  fieldType: "text" | "number" | "select";
  record: T;
  index: number;
  selectData?: Array<keyValueMap>;
}

export interface EditableCellState {}

class EditableCell<T> extends React.Component<EditableCellProps<T>, EditableCellState> {

  constructor(props: EditableCellProps<T>) {
    super(props);
  }

  getFieldComponent = () => {
    let cpt: ReactNode;
    switch (this.props.fieldType) {
      case 'number':
        cpt = <InputNumber />;
        break;
      case 'select':
        cpt = (
          <Select style={{width: '100%'}}>
            {this.getSelectFieldOptions()}
          </Select>
        );
        break;
      case 'text':
        cpt = <Input/>;
        break;
      default:
        cpt = <Input/>;
    }


    return cpt;
  };

  getSelectFieldOptions = () => {
    debugger;
    const { Option } = Select;
    let options: Array<ReactNode> = [];
    if (this.props.selectData) {
      const data = this.props.selectData;
      // iterate
      for (let item of data) {
        options.push(
          <Option key={item.value} value={item.value}>{item.text}</Option>
        );
      }
    }

    return options;
  };

  renderCell = ({ getFieldDecorator }: {getFieldDecorator: any}) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      children,
      fieldType, // 防止解析到 restProps中 直接赋值到 DOM节点上
      selectData,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
      {editing ? (
          <Form.Item style={{ margin: 0 }}>
      {getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ],
          initialValue: record[dataIndex].toString(),
        })(this.getFieldComponent())}
    </Form.Item>
  ) : (
      children
    )}
    </td>
  );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

export default EditableCell;
