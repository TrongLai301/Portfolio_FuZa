import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Typography, Upload, Space } from "antd";
import { 
  PictureOutlined,
  CalendarOutlined,
  FontSizeOutlined,
  CheckCircleFilled,
  BulbOutlined
} from "@ant-design/icons";
import type { Celebration } from "../../../services/celebrationService";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

interface CelebrationFormProps {
  initialData?: Celebration | null;
  onSubmit: (data: any) => Promise<boolean>;
  submitting: boolean;
}

const CelebrationForm: React.FC<CelebrationFormProps> = ({ initialData, onSubmit, submitting }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        date: dayjs(initialData.date),
        caption: initialData.caption,
        description: initialData.description,
      });
      setImagePreview(initialData.image_url);
    } else {
      form.resetFields();
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    const success = await onSubmit({
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      image_file: imageFile,
      image_url: initialData?.image_url // Current image URL if no new file
    });
    
    if (success && !initialData) {
      form.resetFields();
      setImageFile(null);
      setImagePreview("");
    }
  };

  const beforeUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    return false;
  };

  const isFormValid = initialData ? true : imageFile;

  return (
    <div className="p-4 bg-transparent max-h-[70vh] overflow-y-auto pr-8 custom-scrollbar">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={submitting}
      >
        <div className="grid grid-cols-12 gap-8 items-start mb-6">
            {/* Left Column: Image Area */}
            <div className="col-span-12 lg:col-span-7">
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Memory Archive</Text>}
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        className="w-full"
                        accept="image/*"
                        disabled={submitting}
                    >
                        <div 
                            className={`w-full h-[260px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative ${
                                imagePreview 
                                ? 'border-indigo-500 bg-indigo-500/5' 
                                : 'border-white/10 hover:border-indigo-500/30 bg-white/2'
                            } ${submitting ? 'opacity-50' : ''}`}
                        >
                            {imagePreview ? (
                                <>
                                <img 
                                    src={imagePreview} 
                                    alt="preview" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                                />
                                <div className="relative z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                    <CheckCircleFilled className="text-indigo-400" />
                                    <Text strong style={{ color: '#fff', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Switch Signal
                                    </Text>
                                </div>
                                </>
                            ) : (
                                <>
                                <PictureOutlined className="text-4xl opacity-10" />
                                <Text strong style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    Target Memory Fragment
                                </Text>
                                </>
                            )}
                        </div>
                    </Upload>
                </Form.Item>
            </div>

            {/* Right Column: Metadata */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-1">
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Timeline Date</Text>}
                    name="date"
                    rules={[{ required: true, message: 'Timestamp required' }]}
                >
                    <DatePicker 
                        style={{ width: '100%', height: '48px', borderRadius: '16px' }} 
                        placeholder="Select Archive Date"
                        suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.1)' }} />}
                    />
                </Form.Item>

                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Memory Label</Text>}
                    name="caption"
                    rules={[{ required: true, message: 'Identity missing' }]}
                >
                    <Input 
                        prefix={<FontSizeOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} 
                        placeholder="e.g. Reunion with Friends" 
                        style={{ height: '48px', borderRadius: '16px' }}
                    />
                </Form.Item>

                <div className="mt-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-md">
                    <Space align="start">
                        <BulbOutlined style={{ color: '#6366f1', marginTop: 4 }} />
                        <Text style={{ fontSize: '11px', lineHeight: '1.5', color: 'rgba(255,255,255,0.45)' }}>
                            Memories are sorted by timeline date automatically in the public universe.
                        </Text>
                    </Space>
                </div>
            </div>
        </div>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Context Description</Text>}
          name="description"
        >
          <TextArea 
            rows={4} 
            placeholder="Describe the context of this memory node..." 
            style={{ borderRadius: '20px' }}
          />
        </Form.Item>

        <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting} 
            disabled={!isFormValid}
            block 
            size="large"
            style={{ height: '54px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', borderRadius: '16px', marginTop: 12 }}
        >
            Deploy Memory
        </Button>
      </Form>
    </div>
  );
};

export default CelebrationForm;
