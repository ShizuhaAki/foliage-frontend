import React from 'react';
import { Drawer, Tabs } from 'antd';
import { FormInstance } from 'antd/lib/form';
import JobForm from './JobForm'; // Adjust the import path
import TabPane from 'antd/es/tabs/TabPane';
import PreferencesTab from './PreferencesTab';

interface JobDrawerProps {
  visible: boolean;
  onClose: () => void;
  setActiveField: (field: string) => void;
  formRef: React.RefObject<FormInstance>;
}

const JobDrawer: React.FC<JobDrawerProps> = ({ visible, onClose, setActiveField, formRef }) => {
  return (
    <Drawer
      open={visible}
      onClose={onClose}
      mask={false}
      width={400}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="新建寻路任务" key="1">
          <JobForm formRef={formRef} setActiveField={setActiveField} />
        </TabPane>
        <TabPane tab="全局设置" key="2">
          <PreferencesTab/>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default JobDrawer;