# antd-editable-component

this is a component for ant-design-pro.

## usage

1. create an application using umi

example: application named `demo`

```bash
mkdir demo && cd demo

yarn create umi

Select
❯ ant-design-pro

Select
> TypeScript

npm i

npm i -S antd-editable-component

npm start
```

2. modify the file `demo/src/pages/Welcome.tsx`

```typescript
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Popconfirm, Form, Button } from 'antd';
import {FormComponentProps} from 'antd/es/form';
import {Dispatch} from "redux";
import {EditableContext} from "antd-editable-component/context";
import EditableCell, {EditableColumnProps} from "antd-editable-component/cell";

// record data type, in other word, table columns
export interface ColumnDataType {
  key: string;
  name: string;
  age: number;
  address: string;
}


export interface ProductTableProps {
  form: FormComponentProps['form'];
  dispatch: Dispatch<any>;
}

export interface ProductTableState {
  data: Array<ColumnDataType>;
  editingKey: string;
  submitting: boolean;
}

// todo 将可编辑表格的通用操作提升为组件类 继承自 React.Component
class ProductTable extends React.Component<ProductTableProps, ProductTableState> {

  private columns: Array<EditableColumnProps<ColumnDataType>>;

  constructor(props: ProductTableProps) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      submitting: true
    };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text: any, record: ColumnDataType, index: number) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form: FormComponentProps['form']) => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.key, index)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel()}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Button type='link' disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </Button>
          );
        },
      },
    ];
  }

  isEditing = (record: ColumnDataType) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form: FormComponentProps['form'], key: string, index: number) => {
    form.validateFields((error, row) => {
      debugger;
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      // const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  };

  edit = (key: string) => {
    this.setState({ editingKey: key });
  };

  // fetch the data from server.
  componentWillMount(): void {
    // faker data
    const data: Array<ColumnDataType> = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }

    setTimeout(() => {
      this.setState({
        data: data,
        submitting: false,
      })
    }, 3000)
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: ColumnDataType) => ({
          record,
          fieldType: col.fieldType,
          selectData: col.selectData,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        <PageHeaderWrapper>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              loading={this.state.submitting}
              dataSource={this.state.data}
              columns={columns}
              rowClassName={() => "editable-row"}
              pagination={{
                onChange: this.cancel,
              }}
            />
          </EditableContext.Provider>
        </PageHeaderWrapper>
      </div>
    );
  }
}

const Product = Form.create<ProductTableProps>()(ProductTable);

export default Product;

```
