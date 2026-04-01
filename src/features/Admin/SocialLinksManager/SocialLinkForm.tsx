import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Space, Typography, Card, Divider, ColorPicker, Switch } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  GlobalOutlined,
  FormatPainterOutlined,
  ArrowLeftOutlined,
  LinkOutlined
} from "@ant-design/icons";
import type { SocialLink } from "../../../services/socialLinkService";

const { Text, Title } = Typography;

interface SocialLinkFormProps {
  initialData?: SocialLink | null;
  onSubmit: (data: SocialLink) => Promise<boolean>;
  onCancel: () => void;
  submitting: boolean;
  defaultOrder: number;
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({ initialData, onSubmit, onCancel, submitting, defaultOrder }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        // Chuyển string màu sang object cho ColorPicker nếu cần
        color_code: initialData.color_code || "#6366f1"
      });
    } else {
      form.setFieldsValue({
        name: "",
        url: "",
        icon_name: "",
        color_code: "#f6eaea",
        display_order: defaultOrder,
        is_active: true
      });
    }
  }, [initialData, defaultOrder, form]);

  const onFinish = async (values: any) => {
    const color = typeof values.color_code === 'string' 
      ? values.color_code 
      : values.color_code?.toHexString?.() || '#6366f1';

    const success = await onSubmit({
      ...values,
      color_code: color
    });
    
    if (success && !initialData) {
      form.resetFields();
    }
  };

  return (
    <Card 
      className="admin-card" 
      style={{ background: 'rgba(13, 13, 13, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          {initialData ? <EditOutlined style={{ color: '#faad14' }} /> : <PlusOutlined style={{ color: '#6366f1' }} />}
          {initialData ? 'Edit Social Link' : 'New Social Link'}
        </Title>
        
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined style={{ color: '#fff' }} />} 
          onClick={onCancel}
        />
      </div>

      <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '24px 0' }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={submitting}
      >
        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Platform Name</Text>}
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input prefix={<GlobalOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} placeholder="e.g. GitHub" className="admin-input-dark" />
        </Form.Item>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>URL</Text>}
          name="url"
          rules={[{ required: true, message: 'Required' }, { type: 'url', message: 'Invalid URL' }]}
        >
          <Input prefix={<LinkOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} placeholder="https://github.com/..." className="admin-input-dark" />
        </Form.Item>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Icon (FontAwesome Name)</Text>}
          name="icon_name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input prefix={<FormatPainterOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} placeholder="e.g. faGithub, faFacebook" className="admin-input-dark" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '24px' }}>
          <Form.Item
            label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Icon Color</Text>}
            name="color_code"
          >
            <ColorPicker showText />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Display Order</Text>}
            name="display_order"
            className="flex-1"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Active</Text>}
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <Space direction="vertical" style={{ width: '100%', marginTop: 24 }} size="middle">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting} 
            block 
            size="large"
            className="admin-btn-primary"
            style={{ 
              height: '48px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              marginTop: 12
            }}
          >
            {submitting ? "Processing..." : (initialData ? "Update Link" : "Add Link")}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default SocialLinkForm;
