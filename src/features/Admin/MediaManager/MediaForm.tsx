import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Button, InputNumber, Typography, Upload, Select, Radio, Space } from "antd";
import { 
  PictureOutlined,
  BlockOutlined,
  CalendarOutlined,
  TagOutlined,
  CheckCircleFilled,
  PlaySquareOutlined,
  RocketOutlined
} from "@ant-design/icons";
import type { Media, Category } from "../../../services/mediaService";
import { resolveStorageUrl } from "../../../lib/supabaseClient";
import ImageCropperModal from "../components/ImageCropperModal";
import { optimizeImage } from "../../../utils/mediaOptimizer";
import { usePasteImage } from "../../../hooks/usePasteImage";

const { Text } = Typography;
const { TextArea } = Input;

interface MediaFormProps {
  initialData?: Media | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<boolean>;
  submitting: boolean;
}

const MediaForm: React.FC<MediaFormProps> = ({ initialData, categories, onSubmit, submitting }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropRawFile, setCropRawFile] = useState<File | null>(null);
  
  // Watch media type change
  const currentType = Form.useWatch('type', form);

  // Filter categories based on selected type
  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === currentType);
  }, [categories, currentType]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        type: initialData.type,
        title: initialData.title,
        year: initialData.year,
        description: initialData.description,
        category_ids: initialData.categories?.map(c => c.id) || [],
      });
      setImagePreview(resolveStorageUrl(initialData.image_url));
    } else {
      form.resetFields();
      form.setFieldsValue({ type: 'anime' }); // Default
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialData, form]);

  // Support pasting banner image directly from clipboard (Ctrl+V / Cmd+V)
  usePasteImage({
    onPaste: (pastedFile) => {
      beforeUpload(pastedFile);
    },
    enabled: !submitting,
    allowedTypes: ["image/"],
    successMessage: "Đã dán ảnh banner từ clipboard!",
  });

  // If type changes, clear selected categories to prevent mismatch
  const handleTypeChange = () => {
    form.setFieldsValue({ category_ids: [] });
  };

  const onFinish = async (values: any) => {
    const success = await onSubmit({
      ...values,
      image_file: imageFile,
      existing_image_url: initialData?.image_url
    });
    
    if (success && !initialData) {
      form.resetFields();
      setImageFile(null);
      setImagePreview("");
    }
  };

  const beforeUpload = (file: File) => {
    setCropRawFile(file);
    setCropperOpen(true);
    return false;
  };

  const handleCropped = async (croppedFile: File) => {
    const optimized = await optimizeImage(croppedFile);
    setImageFile(optimized);
    setImagePreview(URL.createObjectURL(optimized));
    setCropperOpen(false);
  };

  const isFormValid = initialData ? true : (imageFile);

  return (
    <div className="p-4 bg-transparent max-h-[70vh] overflow-y-auto pr-8 custom-scrollbar">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={submitting}
      >
        {/* Row 1: Title */}
        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Media Title</Text>}
          name="title"
          rules={[{ required: true, message: 'Visual identity required' }]}
        >
          <Input prefix={<BlockOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} placeholder="e.g. Your Name / REPO" />
        </Form.Item>

        {/* Row 2: Main Content Area */}
        <div className="grid grid-cols-12 gap-8 items-start mb-6">
            {/* Left Column: Banner */}
            <div className="col-span-12 lg:col-span-7">
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Banner</Text>}
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        className="w-full"
                        accept="image/*"
                    >
                        <div 
                            className={`w-full h-[240px] md:h-[280px] rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative ${
                                imagePreview 
                                ? 'border-indigo-500 bg-indigo-500/5' 
                                : 'border-white/10 hover:border-indigo-500/30 bg-white/2'
                            }`}
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
                                        Change Banner
                                    </Text>
                                </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-center px-4">
                                  <PictureOutlined className="text-3xl text-indigo-400/50" />
                                  <Text strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Target Banner Signal
                                  </Text>
                                  <span className="text-[10px] text-indigo-300/90 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-sm">
                                    <span>📋</span>
                                    <span>Chọn file hoặc dán ảnh (Ctrl+V / ⌘V)</span>
                                  </span>
                                </div>
                            )}
                        </div>
                    </Upload>
                </Form.Item>
            </div>

            {/* Right Column: Metadata Stack */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-1">
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Type</Text>}
                    name="type"
                    rules={[{ required: true }]}
                >
                    <Radio.Group 
                        onChange={handleTypeChange} 
                        buttonStyle="solid" 
                        className="admin-radio-group w-full flex"
                        style={{ height: '42px' }}
                    >
                        <Radio.Button value="anime" className="flex-1 text-center" style={{ height: '42px', lineHeight: '40px', borderRadius: '12px 0 0 12px' }}>
                            <Space><PlaySquareOutlined /> ANIME</Space>
                        </Radio.Button>
                        <Radio.Button value="game" className="flex-1 text-center" style={{ height: '42px', lineHeight: '40px', borderRadius: '0 12px 12px 0' }}>
                            <Space><RocketOutlined /> GAME</Space>
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Genres ({currentType?.toUpperCase()})</Text>}
                    name="category_ids"
                >
                    <Select 
                        mode="multiple" 
                        placeholder={`Select ${currentType} genres...`}
                        allowClear
                        suffixIcon={<TagOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />}
                        style={{ width: '100%' }}
                        options={filteredCategories.map(c => ({ label: c.name, value: c.id }))}
                    />
                </Form.Item>

                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Release Year</Text>}
                    name="year"
                >
                    <InputNumber 
                        prefix={<CalendarOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} 
                        placeholder="2024" 
                        min={1900} 
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </div>
        </div>

        {/* Row 3: Description */}
        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Description</Text>}
          name="description"
        >
          <TextArea 
            rows={4} 
            placeholder="Share your experience/thoughts about this..." 
            style={{ borderRadius: '16px' }}
          />
        </Form.Item>

        <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting} 
            disabled={!isFormValid}
            block 
            size="large"
            className="admin-btn-primary"
            style={{ height: '48px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '16px', marginTop: 16 }}
        >
            {initialData ? "Update Media" : "Save New Media"}
        </Button>
      </Form>

      <ImageCropperModal
        open={cropperOpen}
        file={cropRawFile}
        defaultAspect={3 / 4}
        title="Crop Media Cover (Recommended 3:4)"
        onCropComplete={handleCropped}
        onCancel={() => setCropperOpen(false)}
        onSkipCrop={(original) => handleCropped(original)}
      />
    </div>
  );
};

export default MediaForm;
