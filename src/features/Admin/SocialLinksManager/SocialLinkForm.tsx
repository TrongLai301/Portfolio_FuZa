import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Space, Typography, Card, Divider, ColorPicker, Switch, Tooltip } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  GlobalOutlined,
  FormatPainterOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import type { SocialLink } from "../../../services/socialLinkService";

const { Text, Title } = Typography;

const getFaIcon = (iconName: string) => {
  if (!iconName) return null;
  return (BrandIcons as any)[iconName] || (SolidIcons as any)[iconName] || null;
};

interface SocialLinkFormProps {
  initialData?: SocialLink | null;
  onSubmit: (data: SocialLink) => Promise<boolean>;
  onCancel: () => void;
  submitting: boolean;
  defaultOrder: number;
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({ initialData, onSubmit, onCancel, submitting, defaultOrder }) => {
  const [form] = Form.useForm();
  const watchedIcon = Form.useWatch("icon_name", form);
  const previewFa = getFaIcon(watchedIcon);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        // Convert color string to ColorPicker value if needed
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
              e.g. <code className="text-indigo-300">faGithub</code>, <code className="text-indigo-300">faFacebook</code>, <code className="text-indigo-300">faDiscord</code>, <code className="text-indigo-300">faEnvelope</code>
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
                <Tooltip title="Icon not recognized, please check camelCase name on FontAwesome">
                  <span className="text-[10px] text-yellow-500/90 font-mono">Unmatched</span>
                </Tooltip>
              ) : null
            }
            placeholder="e.g. faGithub, faFacebook" 
            className="admin-input-dark" 
          />
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

        <Space orientation="vertical" style={{ width: '100%', marginTop: 24 }} size="middle">
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
