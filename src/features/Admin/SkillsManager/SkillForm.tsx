import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Space, Typography, Card, Divider, ColorPicker, Tooltip } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  BlockOutlined,
  FormatPainterOutlined,
  ArrowLeftOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import type { Skill, CreateSkillInput } from "../../../services/skillService";

const { Text, Title } = Typography;

const getFaIcon = (iconName: string) => {
  if (!iconName) return null;
  return (BrandIcons as any)[iconName] || (SolidIcons as any)[iconName] || null;
};

interface SkillFormProps {
  initialData?: Skill | null;
  onSubmit: (data: CreateSkillInput) => Promise<boolean>;
  onCancel: () => void;
  submitting: boolean;
  defaultOrder: number;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialData, onSubmit, onCancel, submitting, defaultOrder }) => {
  const [form] = Form.useForm();
  const watchedIcon = Form.useWatch("icon_name", form);
  const previewFa = getFaIcon(watchedIcon);

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
          label={
            <div className="flex items-center justify-between w-full">
              <Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '10px' }}>
                Icon (FontAwesome Name)
              </Text>
              <a
                href="https://fontawesome.com/search?o=r&m=free"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors ml-3"
              >
                <CompassOutlined />
                Browse Icons
              </a>
            </div>
          }
          name="icon_name"
          rules={[{ required: true, message: 'Required' }]}
          extra={
            <Text style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
              e.g. <code className="text-indigo-300">faReact</code>, <code className="text-indigo-300">faNodeJs</code>, <code className="text-indigo-300">faPython</code>, <code className="text-indigo-300">faDocker</code>
            </Text>
          }
        >
          <Input 
            prefix={<FormatPainterOutlined style={{ color: 'rgba(255, 255, 255, 0.2)' }} />} 
            suffix={
              previewFa ? (
                <Tooltip title="Valid icon!">
                  <span className="flex items-center justify-center w-6 h-6 text-indigo-400 text-base">
                    <FontAwesomeIcon icon={previewFa} />
                  </span>
                </Tooltip>
              ) : watchedIcon ? (
                <Tooltip title="Icon not recognized, please verify camelCase name on FontAwesome">
                  <span className="text-[10px] text-yellow-500/90 font-mono">Unmatched</span>
                </Tooltip>
              ) : null
            }
            placeholder="e.g. faReact" 
          />
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

        <Space orientation="vertical" style={{ width: '100%', marginTop: 24 }} size="middle">
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
