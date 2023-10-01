import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import SearchPerson from './pages/SearchPerson';
import Documentation from './pages/Documentation';
import RegisterPerson from './pages/RegisterPerson';

const { Header, Sider, Content } = Layout;

function App() {

  const [collapsed, setCollapsed] = useState(false);
  const [menuKey, setMenuKey] = useState('1');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const chossePage = () => {
    if (menuKey === '1') {
      return <SearchPerson />;
    }
    else if (menuKey === '2') {
      return <Documentation />;
    } else {
      return <RegisterPerson />;
    }
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={(e) => { setMenuKey(e.key) }}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Search Wanted',
            },
            {
              key: '2',
              icon: <FileProtectOutlined />,
              label: 'Documentation',
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: 'Register new wanted',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: "flex" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{
              paddingLeft: "700px",
              fontFamily: 'Source Sans 3',
              fontWeight: '600'
            }}>IDWALL</div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {chossePage()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
