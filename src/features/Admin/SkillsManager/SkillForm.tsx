import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Space, Typography, Card, Divider, ColorPicker } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  BlockOutlined,
  FormatPainterOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import type { Skill, CreateSkillInput } from "../../../services/skillService";

const { Text, Title } = Typography;

interface SkillFormProps {
  initialData?: Skill | null;
  onSubmit: (data: CreateSkillInput) => Promise<boolean>;
  onCancel: () => void;
  submitting: boolean;
  defaultOrder: number;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialData, onSubmit, onCancel, submitting, defaultOrder }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        icon_name: initialData.icon_name,
        color_code: initialData.color_code,
        display_order: initialData.display_order,
      });
    } else {
      form.setFieldsValue({
        name: "",
        icon_name: "",
        color_code: "#fffff", // Default indigo from project
        display_order: defaultOrder,
      });
    }
  }, [initialData, defaultOrder, form]);

  const onFinish = async (values: any) => {
    // Handle ColorPicker output which might be an object
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
      style={{ background: 'rgba(21, 21, 21, 0.9)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          {initialData ? <EditOutlined style={{ color: '#faad14' }} /> : <PlusOutlined style={{ color: '#6366f1' }} />}
          {initialData ? 'Edit Skill' : 'New Skill'}
        </Title>
        
        {initialData && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined style={{ color: '#fff' }} />} 
            onClick={onCancel}
          />
        )}
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
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Name</Text>}
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input prefix={<BlockOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} placeholder="e.g. React" />
        </Form.Item>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Icon (FA)</Text>}
          name="icon_name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input prefix={<FormatPainterOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} placeholder="faReact" />
        </Form.Item>

        <div className="flex gap-6">
            <Form.Item
                label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Color</Text>}
                name="color_code"
            >
                <ColorPicker showText />
            </Form.Item>

            <Form.Item
                label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>Order</Text>}
                name="display_order"
                className="flex-1"
            >
                <InputNumber min={0} style={{ width: '100%' }} />
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
                style={{ height: '48px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
            >
                {submitting ? "Saving..." : "Save"}
            </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default SkillForm;
