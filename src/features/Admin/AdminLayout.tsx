import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../commons/AuthContext";
import { Layout, Menu, Button, Avatar, Space, Typography, Drawer } from "antd";
import {
  DashboardOutlined,
  BgColorsOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CameraOutlined,
  LogoutOutlined,
  RocketOutlined,
  GlobalOutlined,
  HomeOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "../../assets/css/admin.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
      key: "/admin/theme",
      icon: <BgColorsOutlined />,
      label: <NavLink to="/admin/theme">Theme & Header</NavLink>,
    },
    {
      key: "/admin/hero",
      icon: <HomeOutlined />,
      label: <NavLink to="/admin/hero">Hero Section</NavLink>,
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

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="p-5 md:p-6 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              shape="square"
              size={40}
              src="/nilouAvt.jpg"
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

          {/* Close button on mobile drawer */}
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: "#fff" }} />}
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex items-center justify-center text-gray-400 hover:text-white"
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ background: "transparent", border: "none" }}
          onClick={() => setMobileOpen(false)}
        />
      </div>

      <div className="p-4 md:p-5 pb-6">
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
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      {/* Permanent Desktop Sider (Hidden on Mobile) */}
      <Sider
        width={260}
        theme="dark"
        className="admin-glass-panel !hidden md:!block"
        style={{
          background: "rgba(13, 13, 13, 0.9)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {renderSidebarContent()}
      </Sider>

      {/* Slide-out Mobile Drawer */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closable={false}
        width={280}
        styles={{
          body: {
            padding: 0,
            background: "rgba(13, 13, 13, 0.98)",
            backdropFilter: "blur(20px)",
            height: "100%",
          },
          content: {
            background: "rgba(13, 13, 13, 0.98)",
          },
        }}
        className="md:hidden"
      >
        {renderSidebarContent()}
      </Drawer>

      <Layout
        style={{
          background: "transparent",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Responsive Header */}
        <Header
          style={{
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
          className="px-4 sm:px-6 md:px-10 h-16 md:h-20"
        >
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: "18px", color: "#fff" }} />}
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              title="Open Navigation Menu"
            />
            <Title
              level={4}
              style={{ margin: 0, color: "#fff" }}
              className="text-base sm:text-lg font-bold truncate"
            >
              Central Intelligence
            </Title>
          </div>

          <Space size="middle">
            <a 
              href={import.meta.env.BASE_URL} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-sm group"
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

        {/* Responsive Content */}
        <Content
          className="px-3 sm:px-6 md:px-10 pb-8 md:pb-10 custom-scrollbar overflow-y-auto overflow-x-hidden flex-1"
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
