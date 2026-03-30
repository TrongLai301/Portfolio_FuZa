import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Tabs, Space, Typography, Card, Divider, Radio, Select } from "antd";
import { 
  UserOutlined, 
  SettingOutlined, 
  ToolOutlined, 
  RocketOutlined, 
  SaveOutlined,
  TeamOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import type { ValorantData } from "../../../services/valorantService";

const { Title } = Typography;

interface ValorantFormProps {
  initialData?: ValorantData | null;
  onSubmit: (data: ValorantData) => Promise<boolean>;
  submitting: boolean;
}

const ValorantForm: React.FC<ValorantFormProps> = ({ initialData, onSubmit, submitting }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialData) {
      const [resW, resH] = initialData.graphics?.resolution?.split('x') || ['', ''];
      form.setFieldsValue({
        profile: initialData.profile,
        settings: initialData.settings,
        graphics: {
          ...initialData.graphics,
          resolution_w: resW,
          resolution_h: resH,
        },
        gears: initialData.gears,
        agents: initialData.agents
      });
    }
  }, [initialData, form]);

  const onFinish = (values: any) => {
    const resolution = `${values.graphics.resolution_w || ''}x${values.graphics.resolution_h || ''}`;
    const { resolution_w, resolution_h, ...cleanGraphics } = values.graphics;

    onSubmit({
      ...values,
      profile: {
        ...values.profile,
        id: initialData?.profile?.id
      },
      graphics: {
        ...cleanGraphics,
        resolution
      }
    });
  };

  const sections = [
    {
      key: '1',
      label: <Space><UserOutlined /> Profile</Space>,
      children: (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['profile', 'name']} label="In-Game Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. FuZa" />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['profile', 'tag']} label="#Tag" rules={[{ required: true }]}>
              <Input placeholder="e.g. Kyu" />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['profile', 'region']} label="Region">
              <Input placeholder="e.g. ap" />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['profile', 'main_role']} label="Main Role">
              <Input placeholder="e.g. Controller" />
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: <Space><SettingOutlined /> Settings</Space>,
      children: (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <Form.Item name={['settings', 'dpi']} label="DPI">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Form.Item name={['settings', 'sensitivity']} label="Sensitivity">
              <InputNumber step={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Form.Item name={['settings', 'polling_rate']} label="Polling Rate">
              <Input placeholder="e.g. 1000 Hz" />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['settings', 'crosshair_code']} label="Crosshair Code">
              <Input placeholder="e.g. 0;p;0;c;1;f;0;0t;1;0l;4;0o;2;0a;1" />
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: <Space><ToolOutlined /> Gears</Space>,
      children: (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['gears', 'mouse']} label="Mouse">
              <Input />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['gears', 'keyboard']} label="Keyboard">
              <Input />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['gears', 'headset']} label="Headset">
              <Input />
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Form.Item name={['gears', 'mousepad']} label="Mousepad">
              <Input />
            </Form.Item>
          </div>
          <div className="col-span-12">
            <Form.Item name={['gears', 'monitor']} label="Monitor">
              <Input />
            </Form.Item>
          </div>
        </div>
      )
    },
    {
        key: '4',
        label: <Space><TeamOutlined /> Agents</Space>,
        children: (
          <Form.List name="agents">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 16 }} align="baseline" size="large">
                    <Form.Item
                      {...restField}
                      name={[name, 'agent_name']}
                      rules={[{ required: true, message: 'Missing name' }]}
                    >
                      <Input placeholder="Agent Name" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'agent_image']}
                      rules={[{ required: true, message: 'Missing image' }]}
                    >
                      <Input placeholder="Image URL (valorant-api.com...)" style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'play_count']}
                    >
                      <InputNumber placeholder="Play Count" min={0} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                    Add Most Played Agent
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )
      },
    {
      key: '5',
      label: <Space><VideoCameraOutlined /> Graphics</Space>,
      children: (
        <div className="flex flex-col gap-10 p-2">
          {/* DISPLAY */}
          <section>
            <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                <VideoCameraOutlined style={{ color: '#818cf8' }} />
                <Title level={5} style={{ color: '#fff', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Display</Title>
            </div>
            <div className="flex flex-col gap-4 pl-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Resolution</span>
                <div className="flex items-center gap-2">
                  <Form.Item name={['graphics', 'resolution_w']} noStyle>
                    <Input placeholder="1920" style={{ width: 80 }} className="admin-input-dark text-center" />
                  </Form.Item>
                  <span className="text-white/40 font-bold">x</span>
                  <Form.Item name={['graphics', 'resolution_h']} noStyle>
                    <Input placeholder="1080" style={{ width: 80 }} className="admin-input-dark text-center" />
                  </Form.Item>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Display Mode</span>
                <Form.Item name={['graphics', 'display_mode']} noStyle>
                  <Radio.Group optionType="button" className="admin-radio-group">
                    <Radio.Button value="Fullscreen">Fullscreen</Radio.Button>
                    <Radio.Button value="Windowed">Windowed</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Aspect Ratio</span>
                <Form.Item name={['graphics', 'aspect_ratio']} noStyle>
                  <Radio.Group optionType="button" className="admin-radio-group">
                    <Radio.Button value="4:3">4:3</Radio.Button>
                    <Radio.Button value="16:9">16:9</Radio.Button>
                    <Radio.Button value="16:10">16:10</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Aspect Ratio Method</span>
                <Form.Item name={['graphics', 'aspect_ratio_method']} noStyle>
                  <Radio.Group optionType="button" className="admin-radio-group">
                    <Radio.Button value="Letterbox">Letterbox</Radio.Button>
                    <Radio.Button value="Fill">Fill</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Enemy Highlight Color</span>
                <Form.Item name={['graphics', 'enemy_highlight_color']} noStyle>
                  <Select style={{ width: 240 }} className="admin-select-dark">
                    <Select.Option value="Red">Red (Default)</Select.Option>
                    <Select.Option value="Purple">Purple (Tritanopia)</Select.Option>
                    <Select.Option value="Yellow (Deuteranopia)">Yellow (Deuteranopia)</Select.Option>
                    <Select.Option value="Yellow (Protanopia)">Yellow (Protanopia)</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </section>

          {/* PERFORMANCE */}
          <section>
            <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                <RocketOutlined style={{ color: '#818cf8' }} />
                <Title level={5} style={{ color: '#fff', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Performance</Title>
            </div>
            <div className="flex flex-col gap-4 pl-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Multithreaded Rendering</span>
                <Form.Item name={['graphics', 'multithreaded_rendering']} noStyle>
                  <Radio.Group optionType="button" className="admin-radio-group">
                    <Radio.Button value="On">On</Radio.Button>
                    <Radio.Button value="Off">Off</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              {['Material Quality', 'Texture Quality', 'Detail Quality', 'UI Quality'].map(label => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs uppercase font-bold tracking-wider">{label}</span>
                  <Form.Item name={['graphics', label.toLowerCase().replace(/ /g, '_')]} noStyle>
                    <Radio.Group optionType="button" className="admin-radio-group">
                      <Radio.Button value="High">High</Radio.Button>
                      <Radio.Button value="Medium">Medium</Radio.Button>
                      <Radio.Button value="Low">Low</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
              {['Vignette', 'VSync'].map(label => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs uppercase font-bold tracking-wider">{label}</span>
                  <Form.Item name={['graphics', label.toLowerCase().replace(/ /g, '_')]} noStyle>
                    <Radio.Group optionType="button" className="admin-radio-group">
                      <Radio.Button value="On">On</Radio.Button>
                      <Radio.Button value="Off">Off</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">NVIDIA Reflex Low Latency</span>
                <Form.Item name={['graphics', 'nvidia_reflex_low_latency']} noStyle>
                  <Select style={{ width: 240 }} className="admin-select-dark">
                    <Select.Option value="Off">Off</Select.Option>
                    <Select.Option value="On">On</Select.Option>
                    <Select.Option value="On + Boost">On + Boost</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </section>

          {/* QUALITY */}
          <section>
            <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                <SettingOutlined style={{ color: '#818cf8' }} />
                <Title level={5} style={{ color: '#fff', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Quality</Title>
            </div>
            <div className="flex flex-col gap-4 pl-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Anti-Aliasing</span>
                <Form.Item name={['graphics', 'anti_aliasing']} noStyle>
                  <Select style={{ width: 240 }} className="admin-select-dark">
                    <Select.Option value="None">None</Select.Option>
                    <Select.Option value="FXAA">FXAA</Select.Option>
                    <Select.Option value="MSAA 2x">MSAA 2x</Select.Option>
                    <Select.Option value="MSAA 4x">MSAA 4x</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs uppercase font-bold tracking-wider">Anisotropic Filtering</span>
                <Form.Item name={['graphics', 'anisotropic_filtering']} noStyle>
                  <Select style={{ width: 240 }} className="admin-select-dark">
                    <Select.Option value="1x">1x</Select.Option>
                    <Select.Option value="2x">2x</Select.Option>
                    <Select.Option value="4x">4x</Select.Option>
                    <Select.Option value="8x">8x</Select.Option>
                    <Select.Option value="16x">16x</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              {['Improve Clarity', 'Experimental Sharpening', 'Bloom', 'Distortion', 'Cast Shadows'].map(label => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs uppercase font-bold tracking-wider">{label}</span>
                  <Form.Item name={['graphics', label.toLowerCase().replace(/ /g, '_')]} noStyle>
                    <Radio.Group optionType="button" className="admin-radio-group">
                      <Radio.Button value="On">On</Radio.Button>
                      <Radio.Button value="Off">Off</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
            </div>
          </section>
        </div>
      )
    }
  ];

  return (
    <Card 
        className="admin-card" 
        style={{ background: 'rgba(15, 20, 40, 0.9)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={submitting}
      >
        <div className="flex justify-between items-center mb-6">
            <Title level={4} style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                <RocketOutlined style={{ color: '#818cf8' }} />
                VALORANT PROFILE
            </Title>
            <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting} 
                icon={<SaveOutlined />}
                className="admin-btn-primary"
                style={{ height: '44px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
            >
                Save
            </Button>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '24px 0' }} />

        <Tabs 
            defaultActiveKey="1" 
            items={sections} 
            className="admin-tabs"
            style={{ minHeight: '300px' }}
        />
      </Form>
    </Card>
  );
};

export default ValorantForm;
