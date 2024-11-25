import React, { useState, useRef } from 'react';
import { Layout, Button } from 'antd';
import Map from './Map';
import JobDrawer from './JobDrawer';
import { FormInstance } from 'antd/lib/form';
import { PreferencesProvider } from './PreferencesContext';
import PreferencesTab from './PreferencesTab';

const { Content, Sider } = Layout;

const App = () => {
  const [drawerVisible, setDrawerVisible] = useState(true);
  const [activeField, setActiveField] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const formRef = useRef<FormInstance>(null);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (activeField && formRef.current) {
      formRef.current.setFieldsValue({
        [activeField]: `${coords.lat}, ${coords.lng}`,
      });
      setActiveField('');
    }
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <PreferencesProvider>
      <Layout style={{ minHeight: '100vh' }}>
        {isMapLoaded && (
          <JobDrawer
            visible={drawerVisible}
            onClose={toggleDrawer}
            setActiveField={setActiveField}
            formRef={formRef}
          />
        )}
        <Layout>
          <Content>
            <Map onMapClick={handleMapClick} onMapLoad={handleMapLoad} />
            {!drawerVisible && (
              <Button
                type="primary"
                onClick={toggleDrawer}
                style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
              >
                Open Sidebar
              </Button>
            )}
          </Content>
        </Layout>
      </Layout>
    </PreferencesProvider>
  );
};

export default App;
