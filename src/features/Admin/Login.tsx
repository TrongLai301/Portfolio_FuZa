import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Form, Input, Button, Card, Typography, Space, Alert } from "antd";
import { 
  LockOutlined, 
  UserOutlined, 
  ArrowRightOutlined,
  BugOutlined
} from "@ant-design/icons";
import { toast } from "sonner";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast.success("Welcome back, Master FuZa!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent backdrop-blur-[2px] p-4">
      <Card
        className="admin-card"
        style={{
          width: 420,
          background: "rgba(26, 26, 26, 0.8)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 32,
        }}
      >
        <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: '#6366f1', borderRadius: 20, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>
             <LockOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <Title level={2} style={{ color: '#fff', margin: '16px 0 0', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Portal</Title>
          <Text type="secondary">Universe maintenance synchronization interface.</Text>
        </Space>

        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
          requiredMark={false}
          disabled={loading}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Identity required' }]}
          >
            <Input 
                prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} 
                placeholder="Admin Email" 
                style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Verification key required' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />}
              placeholder="Access Key"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                icon={<ArrowRightOutlined />}
                style={{ height: 54, borderRadius: 12, fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '2px' }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Alert
          message="Unauthorized attempts are logged."
          type="warning"
          showIcon
          icon={<BugOutlined />}
          style={{ background: 'rgba(250, 173, 20, 0.05)', border: '1px solid rgba(250, 173, 20, 0.1)', borderRadius: 12 }}
        />
      </Card>
    </div>
  );
};

export default Login;
