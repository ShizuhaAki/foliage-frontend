import React, { useState, useContext } from 'react';
import { Form, Input, Button, Space, Alert } from 'antd';
import { PreferencesContext } from './PreferencesContext';
import BackendRequester from './BackendRequester';

const PreferencesTab: React.FC = () => {
  const [form] = Form.useForm();
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onValuesChange = (_: any, allValues: any) => {
    setPreferences(allValues);
    console.log('Preferences updated:', allValues);
  };

  const testServer = async () => {
    try {
      const backendUrl = form.getFieldValue('backendUrl');
      const response = await new BackendRequester(backendUrl).getWithoutPolling('/test');
      if (response.status === 200) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    }
  };

  const loadChosenXML = async () => {
    try {
      setLoadStatus('loading');
      const filename = form.getFieldValue('osmPath');
      const requester = new BackendRequester(preferences.backendUrl);
      const responseTaskID = await requester.post('/load', JSON.stringify({ file: filename }));
      const taskID = responseTaskID.data["task_id"];
      const response = await requester.getWithPolling(taskID);
      if (response.status === 200) {
        setLoadStatus('success');
      } else {
        setLoadStatus('error');
      }
    } catch {
      setLoadStatus('error');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      initialValues={preferences}
    >
      <Form.Item
        label="后端服务地址"
        name="backendUrl"
        rules={[{ required: true, message: '需要指定后端计算服务的地址' }]}
      >
        <Space>
          <Input defaultValue={preferences.backendUrl}/>
          <Button type="default" onClick={testServer}>
            测试服务器状态
          </Button>
        </Space>
      </Form.Item>
      {testResult && (
        <Form.Item>
          <Alert
            message={testResult === 'success' ? '服务器连接正常' : '服务器测试失败'}
            type={testResult}
            showIcon
          />
        </Form.Item>
      )}
      
      <Form.Item
        label="OSM路径"
        name="osmPath"
        rules={[{ required: true, message: '此项必填' }]}
      >
        <Space>
          <Input />
          <Button type="default" onClick={loadChosenXML}>
            加载XML文件
          </Button>
        </Space>
      </Form.Item>
      {loadStatus !== 'idle' && (
        <Form.Item>
          <Alert
            message={
              loadStatus === 'loading'
                ? '正在加载'
                : loadStatus === 'success'
                ? '成功'
                : '失败'
            }
            type={
              loadStatus === 'success'
                ? 'success'
                : loadStatus === 'error'
                ? 'error'
                : 'info'
            }
            showIcon
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default PreferencesTab;