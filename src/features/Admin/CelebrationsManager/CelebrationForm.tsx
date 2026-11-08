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
import { resolveStorageUrl } from "../../../lib/supabaseClient";
import dayjs from "dayjs";
import { toast } from "sonner";
import ImageCropperModal from "../components/ImageCropperModal";
import VideoTrimmerModal from "../components/VideoTrimmerModal";
import AutoplayVideo from "../../../components/AutoplayVideo";
import {
  isVideoFile,
  isGifFile,
  isAnimatedMedia,
  optimizeImage,
  formatFileSize,
} from "../../../utils/mediaOptimizer";
import { usePasteImage } from "../../../hooks/usePasteImage";

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
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropRawFile, setCropRawFile] = useState<File | null>(null);
  const [trimmerOpen, setTrimmerOpen] = useState(false);
  const [trimRawFile, setTrimRawFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        date: dayjs(initialData.date),
        caption: initialData.caption,
        description: initialData.description,
      });
      setImagePreview(resolveStorageUrl(initialData.image_url));
    } else {
      form.resetFields();
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialData, form]);

  // Support pasting image/video directly from clipboard (Ctrl+V / Cmd+V) without opening folder
  usePasteImage({
    onPaste: (pastedFile) => {
      beforeUpload(pastedFile);
    },
    enabled: !submitting,
    allowedTypes: ["image/", "video/"],
    successMessage: "Đã dán media từ clipboard!",
  });

  const onFinish = async (values: any) => {
    let fileToUpload = imageFile;
    if (fileToUpload && !isVideoFile(fileToUpload) && !(await isAnimatedMedia(fileToUpload))) {
      fileToUpload = await optimizeImage(fileToUpload);
    }

    const success = await onSubmit({
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      image_file: fileToUpload,
      image_url: initialData?.image_url // Current image URL if no new file
    });
    
    if (success && !initialData) {
      form.resetFields();
      setImageFile(null);
      setImagePreview("");
    }
  };

  const beforeUpload = (file: File) => {
    (async () => {
      const isVideo = isVideoFile(file);

      if (isVideo) {
        // Validate video duration: if > 2s, open VideoTrimmerModal automatically
        const videoElem = document.createElement("video");
        videoElem.preload = "metadata";
        videoElem.src = URL.createObjectURL(file);
        videoElem.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElem.src);
          if (videoElem.duration > 2.05) {
            toast.info(`Video dài ${videoElem.duration.toFixed(1)}s. Đang mở bộ cắt để lấy đoạn < 2s...`);
            setTrimRawFile(file);
            setTrimmerOpen(true);
          } else if (file.size > 2 * 1024 * 1024) {
            toast.info(`Video < 2s (${formatFileSize(file.size)}). Mở bộ cắt/nén để tối ưu dung lượng siêu nhẹ...`);
            setTrimRawFile(file);
            setTrimmerOpen(true);
          } else {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
          }
        };
        videoElem.onerror = () => {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
        };
        return;
      }

      // Check if file is animated (GIF or animated WebP) -> Preserve all frames!
      const isAnimated = await isAnimatedMedia(file);
      if (isAnimated) {
        const typeLabel = isGifFile(file) ? "GIF" : "WebP";
        toast.success(`Đã chọn ảnh động (${typeLabel}). Đã tự động giữ trọn vẹn toàn bộ chuyển động!`);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        return;
      }

      // Static image: open cropper modal for framing
      setCropRawFile(file);
      setCropperOpen(true);
    })();

    return false;
  };

  const handleCropped = async (croppedFile: File) => {
    // Automatically optimize cropped static image to lightweight WebP
    const optimized = await optimizeImage(croppedFile);
    setImageFile(optimized);
    setImagePreview(URL.createObjectURL(optimized));
    setCropperOpen(false);
  };

  const handleTrimComplete = (trimmedFile: File) => {
    setImageFile(trimmedFile);
    setImagePreview(URL.createObjectURL(trimmedFile));
    setTrimmerOpen(false);
  };

  const isFormValid = initialData ? true : imageFile;
  const isVideoPreview = isVideoFile(imageFile) || isVideoFile(imagePreview);

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
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Memory (Photo / GIF / &lt;2s Video)</Text>}
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        className="w-full"
                        accept="image/*,video/mp4,video/webm,image/gif"
                        disabled={submitting}
                    >
                        <div 
                            className={`w-full min-w-[300px] h-[260px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative ${
                                imagePreview 
                                ? 'border-indigo-500 bg-indigo-500/5' 
                                : 'border-white/10 hover:border-indigo-500/30 bg-white/2'
                            } ${submitting ? 'opacity-50' : ''}`}
                        >
                            {imagePreview ? (
                                <>
                                {isVideoPreview ? (
                                  <AutoplayVideo 
                                      src={imagePreview} 
                                      className="absolute inset-0 w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity" 
                                  />
                                ) : (
                                  <img 
                                      src={imagePreview} 
                                      alt="preview" 
                                      className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                                  />
                                )}
                                <div className="relative z-10 flex items-center gap-2 flex-wrap justify-center">
                                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                                      <CheckCircleFilled className="text-indigo-400 text-xs" />
                                      <Text strong style={{ color: '#fff', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                          Switch Media
                                      </Text>
                                  </div>

                                  {isVideoPreview && imageFile && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTrimRawFile(imageFile);
                                        setTrimmerOpen(true);
                                      }}
                                      className="bg-pink-600/80 hover:bg-pink-500 text-white text-xs px-3 py-1.5 rounded-full border border-pink-400/30 flex items-center gap-1.5 transition-all shadow-lg"
                                    >
                                      <span>✂️ Re-trim</span>
                                    </button>
                                  )}
                                </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-center px-4">
                                  <PictureOutlined className="text-3xl text-indigo-400/50" />
                                  <Text strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Photo, GIF or &lt;2s Video
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

            {/* Right Column: Metadata */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-1">
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Caption</Text>}
                    name="caption"
                    rules={[{ required: true, message: 'Identity missing' }]}
                >
                    <Input 
                        prefix={<FontSizeOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} 
                        placeholder="e.g. Reunion with Friends" 
                        style={{ height: '48px', borderRadius: '16px' }}
                    />
                </Form.Item>
                <Form.Item
                    label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Date</Text>}
                    name="date"
                    rules={[{ required: true, message: 'Timestamp required' }]}
                >
                    <DatePicker 
                        style={{ width: '100%', height: '48px', borderRadius: '16px' }} 
                        placeholder="Select Archive Date"
                        suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.1)' }} />}
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
            className="admin-btn-primary"
            style={{ height: '48px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '16px', marginTop: 16 }}
        >
            {initialData ? "Update Celebration" : "Save Celebration"}
        </Button>
      </Form>

      <ImageCropperModal
        open={cropperOpen}
        file={cropRawFile}
        defaultAspect={16 / 9}
        title="Crop Celebration Image (Recommended 16:9)"
        onCropComplete={handleCropped}
        onCancel={() => setCropperOpen(false)}
        onSkipCrop={(original) => handleCropped(original)}
      />

      <VideoTrimmerModal
        open={trimmerOpen}
        file={trimRawFile}
        maxDuration={2.0}
        onTrimComplete={handleTrimComplete}
        onCancel={() => setTrimmerOpen(false)}
        onUseOriginal={(original) => handleTrimComplete(original)}
      />
    </div>
  );
};

export default CelebrationForm;
