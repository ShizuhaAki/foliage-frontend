import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, InputNumber, Button, Collapse } from 'antd';
import { FormInstance } from 'antd/lib/form';
import BackendRequester from './BackendRequester';
import { PreferencesContext } from './PreferencesContext';

interface SchemaField {
  type: string;
  description: string;
  default_value: string | number;
  required: boolean;
}

interface JobFormProps {
  formRef: React.RefObject<FormInstance>;
  setActiveField: (field: string) => void;
}

const { Panel } = Collapse;

const JobForm: React.FC<JobFormProps> = ({ formRef, setActiveField }) => {
  const { preferences } = useContext(PreferencesContext);
  const [form] = Form.useForm();
  const [schema, setSchema] = useState<Record<string, SchemaField>>({});
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [isCollapsedPaneOpen, setIsCollapsedPaneOpen] = useState(false);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await new BackendRequester().getWithoutPolling('/schema');
        const schemaData = response.data;
        setSchema(schemaData);

        // Prepare initial values from the schema
        const initValues: Record<string, any> = {};
        Object.entries(schemaData).forEach(([key, value]) => {
          // check that value is of type SchemaField
          const schemaField = value as SchemaField;
          if (schemaField.default_value)
            initValues[key] = schemaField.default_value;
        });
        setInitialValues(initValues);
      } catch (error) {
        console.error('Failed to fetch schema:', error);
      }
    };
    fetchSchema();
  }, []);

  const handleFormSubmit = (values: any) => {
    // Values will include default values from initialValues
    console.log('Form values:', values);
    // Generate the data to submit
    const data: any = {
      start: {
        lat: parseFloat(values.startLocation.split(',')[0]),
        lon: parseFloat(values.startLocation.split(',')[1]),
      },
      end: {
        lat: parseFloat(values.endLocation.split(',')[0]),
        lon: parseFloat(values.endLocation.split(',')[1]),
      },
      preferences: {},
    };
    for (const [key, value] of Object.entries(schema)) {
      if (values[key]) {
        data.preferences[key] = values[key];
      } else {
        data.preferences[key] = value.default_value;
      }
    }
    console.log(data);
    new BackendRequester(preferences.backendUrl).submitTask('/query', data, 100);
  };

  const renderFields = () => {
    return Object.entries(schema).map(([key, value]) => {
      let inputComponent = null;
      switch (value.type) {
        case 'number':
          inputComponent = (
            <InputNumber
              placeholder={value.description}
              style={{ width: '100%' }}
            />
          );
          break;
        case 'string':
          inputComponent = (
            <Input
              placeholder={value.description}
            />
          );
          break;
        default:
          inputComponent = (
            <Input
              placeholder={value.description}
            />
          );
      }

      return (
        <Form.Item
          key={key}
          name={key}
          label={value.description}
          hidden={!isCollapsedPaneOpen} // Hide when collapsed pane is not open
          rules={[
            { required: value.required, message: `必须提供 ${value.description}` },
          ]}
        >
          {inputComponent}
        </Form.Item>
      );
    });
  };

  return (
    <Form
      ref={formRef}
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="startLocation"
        label="开始位置"
        rules={[{ required: true, message: '请输入开始位置' }]}
      >
        <Input
          placeholder="经度, 纬度"
          onFocus={() => setActiveField('startLocation')}
        />
      </Form.Item>
      <Form.Item
        name="endLocation"
        label="结束位置"
        rules={[{ required: true, message: '请输入结束位置' }]}
      >
        <Input
          placeholder="经度, 纬度"
          onFocus={() => setActiveField('endLocation')}
        />
      </Form.Item>
      <Form.Item>
        <Collapse onChange={() => setIsCollapsedPaneOpen(!isCollapsedPaneOpen)}>
          <Panel header="高级选项" key="1">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {renderFields()}
            </div>
          </Panel>
        </Collapse>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          提交寻路任务
        </Button>
      </Form.Item>
    </Form>
  );
};

export default JobForm;