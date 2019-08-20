import React from "react";
import { Input, InputNumber, Form } from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {EditableContext} from "./context";


// table column data type
export interface EditableColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
}

export interface EditableCellProps<T> {
  dataIndex: number;
  title: string;
  editing: boolean;
  inputType: string;
  record: T;
  index: number;
}

export interface EditableCellState {}

class EditableCell<T> extends React.Component<EditableCellProps<T>, EditableCellState> {

  constructor(props: EditableCellProps<T>) {
    super(props);
  }

  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }: {getFieldDecorator: any}) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
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
          initialValue: record[dataIndex],
        })(this.getInput())}
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
