import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, List, Typography, Space, Tag, Spin } from "antd";
import { supabase } from "../../lib/supabaseClient"
import { 
  ThunderboltOutlined, 
  CustomerServiceOutlined, 
  CheckCircleOutlined, 
  PictureOutlined,
  AlertOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState({
    skills: 0,
    songs: 0,
    medias: 0,
    celebrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [skills, songs, medias, celebrations] = await Promise.all([
          supabase.from("skills").select("*", { count: "exact", head: true }),
          supabase.from("songs").select("*", { count: "exact", head: true }),
          supabase.from("medias").select("*", { count: "exact", head: true }),
          supabase.from("celebrations").select("*", { count: "exact", head: true }),
        ]);

        setCounts({
          skills: skills.count || 0,
          songs: songs.count || 0,
          medias: medias.count || 0,
          celebrations: celebrations.count || 0,
        });
      } catch (error) {
        console.error("Dashboard count fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { label: "Active Skills", icon: <ThunderboltOutlined />, value: counts.skills, color: "#faad14" },
    { label: "Uploaded Songs", icon: <CustomerServiceOutlined />, value: counts.songs, color: "#6366f1" },
    { label: "Completed Media", icon: <CheckCircleOutlined />, value: counts.medias, color: "#52c41a" },
    { label: "Memory Photos", icon: <PictureOutlined />, value: counts.celebrations, color: "#f5222d" },
  ];

  const logs = [
    { type: 'SYSTEM', message: 'Connecting to remote database shard 01...', color: 'rgba(255, 255, 255, 0.45)' },
    { type: 'SUCCESS', message: 'Established persistent handshake with Supabase Engine.', color: '#52c41a' },
    { type: 'IO', message: 'Loading media assets cache (warm-up sequence)...', color: 'rgba(255, 255, 255, 0.45)' },
    { type: 'NOTICE', message: '3 assets pending cloud deployment.', color: '#faad14' },
    { type: 'IDLE', message: 'Awaiting root master input...', color: '#6366f1', animate: true },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900 }}>Profile Status</Title>
          <Text type="secondary">Monitoring the digital universe of FuZa. All systems are green.</Text>
        </div>

        <Spin spinning={loading} tip="Syncing with master database...">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={[24, 24]}>
              {stats.map((stat, i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <Card
                    className="admin-card"
                    style={{
                      background: "rgba(21, 21, 21, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                    hoverable
                  >
                    <Statistic
                      title={
                        <Text
                          strong
                          style={{
                            color: "rgba(255, 255, 255, 0.45)",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {stat.label}
                        </Text>
                      }
                      value={stat.value}
                      prefix={
                        <span
                          style={{
                            color: stat.color,
                            marginRight: 8,
                            fontSize: "24px",
                          }}
                        >
                          {stat.icon}
                        </span>
                      }
                      valueStyle={{ color: "#fff", fontWeight: 900, fontSize: "32px" }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card
                  title={
                    <Space>
                      <AlertOutlined style={{ color: "#6366f1" }} />
                      <Text
                        strong
                        style={{
                          color: "#fff",
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "2px",
                        }}
                      >
                        Core Engine Logs
                      </Text>
                    </Space>
                  }
                  style={{
                    background: "rgba(21, 21, 21, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <List
                    dataSource={logs}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                          padding: "8px 0",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      >
                        <Text type="secondary" style={{ marginRight: 16 }}>
                          [{item.type}]
                        </Text>
                        <Text
                          style={{ color: item.color }}
                          className={item.animate ? "animate-pulse" : ""}
                        >
                          {item.message}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  title={
                    <Space>
                      <EnvironmentOutlined style={{ color: "#6366f1" }} />
                      <Text
                        strong
                        style={{
                          color: "#fff",
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "2px",
                        }}
                      >
                        Environment
                      </Text>
                    </Space>
                  }
                  style={{
                    background: "rgba(21, 21, 21, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        Engine
                      </Text>
                      <Tag
                        color="default"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Vite + React
                      </Tag>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        Database
                      </Text>
                      <Tag
                        color="success"
                        style={{
                          background: "rgba(82, 196, 26, 0.1)",
                          border: "none",
                          fontWeight: "bold",
                          color: "#52c41a",
                        }}
                      >
                        PostgreSQL
                      </Tag>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        Region
                      </Text>
                      <Tag
                        color="default"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Local Machine
                      </Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Spin>
      </Space>
    </div>
  );
};

export default Dashboard;
