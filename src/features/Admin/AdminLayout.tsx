import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../commons/AuthContext";
import { Layout, Menu, Button, Avatar, Space, Typography } from "antd";
import {
  DashboardOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CameraOutlined,
  LogoutOutlined,
  BulbOutlined,
  RocketOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "../../assets/css/admin.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin">Dashboard</NavLink>,
    },
    {
      key: "/admin/social",
      icon: <GlobalOutlined />,
      label: <NavLink to="/admin/social">Social Links</NavLink>,
    },
    {
      key: "/admin/skills",
      icon: <CodeOutlined />,
      label: <NavLink to="/admin/skills">Skills</NavLink>,
    },
    {
      key: "/admin/celebrations",
      icon: <CameraOutlined />,
      label: <NavLink to="/admin/celebrations">Celebrations</NavLink>,
    },
    {
      key: "/admin/media",
      icon: <PlayCircleOutlined />,
      label: <NavLink to="/admin/media">Media</NavLink>,
    },
    {
      key: "/admin/music",
      icon: <CustomerServiceOutlined />,
      label: <NavLink to="/admin/music">Music</NavLink>,
    },
    {
      key: "/admin/valorant",
      icon: <RocketOutlined />,
      label: <NavLink to="/admin/valorant">Valorant Profile</NavLink>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sider
        width={260}
        theme="dark"
        className="admin-glass-panel"
        style={{
          background: "rgba(13, 13, 13, 0.9)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="p-6 mb-4 flex items-center gap-3">
          <Avatar
            shape="square"
            size={40}
            icon={<BulbOutlined />}
            style={{
              backgroundColor: "#6366f1",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
            }}
          />
          <div>
            <Title
              level={5}
              style={{ margin: 0, color: "#fff", fontSize: "16px" }}
            >
              FuZa Admin
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Universe 1.0
            </Text>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ background: "transparent", border: "none" }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 20px",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=fff`}
              />
              <div className="overflow-hidden">
                <Text style={{ color: "#fff", fontSize: "12px" }} ellipsis>
                  {user?.email}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "10px" }}>
                  Root Master
                </Text>
              </div>
            </div>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleSignOut}
              block
              style={{ height: "45px", borderRadius: "12px" }}
            >
              Sign Out
            </Button>
          </Space>
        </div>
      </Sider>

      <Layout
        style={{
          background: "transparent",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            background: "transparent",
            padding: "0 40px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            Central Intelligence
          </Title>
          <Space size="middle">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-sm group"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Profile
              </Text>
            </a>
          </Space>
        </Header>

        <Content
          style={{ padding: "0 40px 40px", overflowY: "auto", flex: 1 }}
          className="custom-scrollbar"
        >
          <div style={{ minHeight: "360px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
