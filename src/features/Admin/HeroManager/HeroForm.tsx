import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Upload,
  Row,
  Col,
  ColorPicker,
} from "antd";
import {
  SaveOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  PlusOutlined,
  DeleteOutlined,
  LineHeightOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface HeroFormProps {
  initialValues?: any;
  typewriterTexts: any[];
  onSaveAll: (values: any) => Promise<void>;
  saving: boolean;
}

const HeroForm: React.FC<HeroFormProps> = ({
  initialValues,
  typewriterTexts,
  onSaveAll,
  saving,
}) => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [orbitFile, setOrbitFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [orbitPreview, setOrbitPreview] = useState<string>("");

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        phrases: typewriterTexts.map((t) => ({ 
          id: t.id, 
          content: t.content, 
          content_color: t.content_color || '#6366f1' 
        })),
      });
      setVideoPreview(initialValues.video_bg_url || "");
      setOrbitPreview(initialValues.orbit_image_url || "");
    }
  }, [initialValues, typewriterTexts, form]);

  const onFinish = (values: any) => {
    // Format colors from phrases (typewriter)
    const formattedPhrases = values.phrases?.map((p: any) => ({
      ...p,
      content_color: typeof p.content_color === 'string' 
        ? p.content_color 
        : p.content_color?.toHexString?.() || '#6366f1'
    }));

    // Format orbit color
    const orbitColor = typeof values.orbit_animation_color === 'string'
      ? values.orbit_animation_color
      : values.orbit_animation_color?.toHexString?.() || '#6366f1';

    onSaveAll({
      ...values,
      phrases: formattedPhrases,
      orbit_animation_color: orbitColor,
      video_file: videoFile,
      orbit_file: orbitFile,
    });
  };

  const beforeUploadVideo = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    return false;
  };

  const beforeUploadOrbit = (file: File) => {
    setOrbitFile(file);
    setOrbitPreview(URL.createObjectURL(file));
    return false;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: 900 }}>
              Hero Section Editor
            </Title>
            <Text type="secondary">
              Synchronize your landing page visual and content.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={saving}
            className="admin-btn-primary"
            style={{
              height: "48px",
              padding: "0 40px",
              borderRadius: "16px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Save Changes
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column: General Settings */}
          <Col xs={24} lg={14}>
            <Card
              className="admin-card"
              style={{
                height: '100%',
                background: "rgba(21, 21, 21, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: '24px'
              }}
              title={<Space><RocketOutlined style={{ color: '#6366f1' }}/> <Text strong style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>Visual & Bio</Text></Space>}
            >
              <Title
                level={5}
                style={{
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "1px",
                  marginBottom: 16
                }}
              >
                Media Assets
              </Title>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Upload beforeUpload={beforeUploadVideo} showUploadList={false} accept="video/*">
                  <div className="w-full min-w-[230px] h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center overflow-hidden relative cursor-pointer">
                    {videoPreview ? (
                      <>
                        <video src={videoPreview} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                        <PlayCircleOutlined className="relative z-10 text-xl text-indigo-400" />
                      </>
                    ) : <VideoCameraOutlined className="text-2xl text-white/10" />}
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: 4 }}>BG Video</Text>
                  </div>
                </Upload>

                <Upload beforeUpload={beforeUploadOrbit} showUploadList={false} accept="image/*">
                  <div className="w-full min-w-[230px] h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center overflow-hidden relative cursor-pointer">
                    {orbitPreview ? (
                      <>
                        <img src={orbitPreview} alt="Orbit" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <PictureOutlined className="relative z-10 text-xl text-indigo-400" />
                      </>
                    ) : <UploadOutlined className="text-2xl text-white/10" />}
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: 4 }}>Orbit Image</Text>
                  </div>
                </Upload>
              </div>

              <Form.Item 
                name="orbit_animation_color" 
                label={<Text style={{ color: "rgba(255,255,255,0.45)", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Orbit Animation Color</Text>}
              >
                <Input 
                  className="admin-input-dark" 
                  placeholder="#6366f1 or linear-gradient(...)" 
                  style={{ borderRadius: '12px' }}
                  suffix={
                    <ColorPicker 
                      size="small" 
                      onChange={(c) => form.setFieldValue('orbit_animation_color', c.toHexString())} 
                    />
                  }
                />
              </Form.Item>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '32px 0' }} />

              <Title
                level={5}
                style={{
                  color: "#6366f1",
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  marginBottom: 24,
                  fontWeight: 900
                }}
              >
                Main Text Configuration
              </Title>
              
              <div className="flex flex-col gap-6">
                {/* Part 1 Configuration */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                   <Text strong style={{ color: "rgba(255,255,255,0.8)", fontSize: '11px' }}>PART 1 (PREFIX)</Text>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="main_text_prefix" label="Text content" noStyle>
                        <Input className="admin-input-dark" placeholder="Hello," />
                      </Form.Item>
                      <Form.Item name="main_text_prefix_color" label="Color/Gradient" noStyle>
                        <Input 
                          className="admin-input-dark" 
                          placeholder="#fff" 
                          suffix={
                            <ColorPicker 
                              size="small" 
                              onChange={(c) => form.setFieldValue('main_text_prefix_color', c.toHexString())} 
                            />
                          }
                        />
                      </Form.Item>
                   </div>
                </div>

                {/* Part 2 Configuration */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                   <Text strong style={{ color: "rgba(255,255,255,0.8)", fontSize: '11px' }}>PART 2 (SUFFIX)</Text>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="main_text_suffix" label="Text content" noStyle>
                        <Input className="admin-input-dark" placeholder="I'm FuZa" />
                      </Form.Item>
                      <Form.Item name="main_text_suffix_color" label="Color/Gradient" noStyle>
                        <Input 
                          className="admin-input-dark" 
                          placeholder="linear-gradient(...)" 
                          suffix={
                            <ColorPicker 
                              size="small" 
                              onChange={(c) => form.setFieldValue('main_text_suffix_color', c.toHexString())} 
                            />
                          }
                        />
                      </Form.Item>
                   </div>
                </div>
              </div>

              <Form.Item name="description" label={<Text style={{ color: "rgba(255,255,255,0.45)", fontSize: '10px' }}>Description</Text>}>
                <TextArea rows={5} className="admin-input-dark" placeholder="Write your intro..." />
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column: Typewriter List */}
          <Col xs={24} lg={10}>
            <Card
              className="admin-card"
              style={{
                height: '100%',
                background: "rgba(21, 21, 21, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: '24px'
              }}
              title={<Space><LineHeightOutlined style={{ color: '#6366f1' }}/> <Text strong style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>Typewriter Phrases</Text></Space>}
              extra={
                <Form.List name="phrases">
                  {(_, { add }) => (
                    <Button type="text" icon={<PlusOutlined />} onClick={() => add({ content: '' })} style={{ color: '#6366f1' }}>
                      Add
                    </Button>
                  )}
                </Form.List>
              }
            >
              <Form.List name="phrases">
                {(fields, { remove }) => (
                  <div className="flex flex-col gap-3">
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex items-center gap-3 bg-white/5 p-2 px-3 rounded-xl border border-white/5 group transition-all hover:bg-white/10">
                        <Form.Item
                          {...restField}
                          name={[name, 'content']}
                          rules={[{ required: true, message: 'Value required' }]}
                          noStyle
                        >
                          <Input 
                            placeholder="I'm a Developer..." 
                            className="admin-input-dark flex-1"
                            style={{ border: 'none', background: 'transparent' }}
                            suffix={
                              <Form.Item {...restField} name={[name, 'content_color']} noStyle>
                                <ColorPicker 
                                  size="small" 
                                  onChange={(c) => {
                                    // Update the specific field value in the list
                                    const phrases = form.getFieldValue('phrases');
                                    phrases[name].content_color = c.toHexString();
                                    form.setFieldsValue({ phrases });
                                  }}
                                />
                              </Form.Item>
                            }
                          />
                        </Form.Item>

                        {/* Store ID hidden to know whether to update or create if needed */}
                        <Form.Item {...restField} name={[name, 'id']} hidden>
                          <Input />
                        </Form.Item>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <div className="text-center py-10 opacity-20">
                        <LineHeightOutlined style={{ fontSize: '30px' }} />
                        <p style={{ marginTop: 10 }}>No phrases added yet</p>
                      </div>
                    )}
                  </div>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default HeroForm;
