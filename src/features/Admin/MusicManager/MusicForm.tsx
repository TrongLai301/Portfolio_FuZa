import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Typography, Upload } from "antd";
import { 
  SoundOutlined,
  PictureOutlined,
  BlockOutlined,
  UserOutlined,
  CheckCircleFilled
} from "@ant-design/icons";
import type { Song } from "../../../services/musicService";

const { Text } = Typography;

interface MusicFormProps {
  initialData?: Song | null;
  onSubmit: (data: any) => Promise<boolean>;
  submitting: boolean;
  defaultOrder: number;
}

const MusicForm: React.FC<MusicFormProps> = ({ initialData, onSubmit, submitting, defaultOrder }) => {
  const [form] = Form.useForm();
  
  // Local File state for new uploads
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  // URLs for preview or existing data
  const [audioPreview, setAudioPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        artist: initialData.artist,
        display_order: initialData.display_order,
      });
      setAudioPreview(initialData.audio_url);
      setCoverPreview(initialData.cover_url);
    } else {
      form.resetFields();
      form.setFieldsValue({ display_order: defaultOrder });
      setAudioPreview("");
      setCoverPreview("");
      setAudioFile(null);
      setCoverFile(null);
    }
  }, [initialData, defaultOrder, form]);

  const onFinish = async (values: any) => {
    const success = await onSubmit({
      ...values,
      audio_file: audioFile,
      cover_file: coverFile,
      // Pass existing URLs in case files aren't changed during edit
      existing_audio_url: initialData?.audio_url,
      existing_cover_url: initialData?.cover_url
    });
    
    if (success && !initialData) {
      form.resetFields();
      setAudioFile(null);
      setCoverFile(null);
      setAudioPreview("");
      setCoverPreview("");
    }
  };

  const beforeAudioUpload = (file: File) => {
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
    return false; // Prevent automatic upload
  };

  const beforeCoverUpload = (file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    return false; // Prevent automatic upload
  };

  // Valid if: (isEdit AND has some data) OR (isCreate AND has files)
  const isFormValid = initialData 
    ? true // Can edit text only, or replace files
    : (audioFile && coverFile);

  return (
    <div className="p-4 bg-transparent">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={submitting}
      >
        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Title music</Text>}
          name="title"
          rules={[{ required: true, message: 'Node title required' }]}
        >
          <Input prefix={<BlockOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} placeholder="e.g. Moonlight Sonata" />
        </Form.Item>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Artist</Text>}
          name="artist"
          rules={[{ required: true, message: 'Source entity required' }]}
        >
          <Input prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.1)' }} />} placeholder="e.g. Beethoven" />
        </Form.Item>

        {/* UPLOAD SECTION */}
        <div className="flex justify-start gap-10 mb-10 mt-6">
             <Upload
                beforeUpload={beforeAudioUpload}
                maxCount={1}
                showUploadList={false}
                accept=".mp3,audio/*"
                className="w-[200px]"
                disabled={submitting}
             >
                <div 
                    className={`aspect-square w-[200px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative ${
                        audioPreview 
                        ? 'border-indigo-500 bg-indigo-500/5' 
                        : 'border-white/10 hover:border-indigo-500/40 bg-white/2'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                     {audioPreview ? (
                        <>
                        <CheckCircleFilled className="text-3xl text-indigo-500" />
                        <div className="px-4 text-center">
                            <Text strong style={{ color: '#fff', fontSize: '11px', textTransform: 'uppercase', display: 'block', letterSpacing: '1px', fontWeight: 900 }}>
                                Staged
                            </Text>
                            <Text ellipsis style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '9px', display: 'block', maxWidth: '160px' }}>
                                {audioFile?.name || "Original Signal"}
                            </Text>
                        </div>
                        </>
                     ) : (
                        <>
                        <SoundOutlined className="text-3xl opacity-10" />
                        <Text strong style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
                            Audio
                        </Text>
                        </>
                     )}
                </div>
             </Upload>

             <Upload
                beforeUpload={beforeCoverUpload}
                showUploadList={false}
                maxCount={1}
                accept="image/*"
                className="w-[200px]"
                disabled={submitting}
             >
                <div 
                    className={`aspect-square w-[200px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative ${
                        coverPreview 
                        ? 'border-indigo-500 bg-indigo-500/5' 
                        : 'border-white/10 hover:border-indigo-500/40 bg-white/2'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                     {coverPreview ? (
                        <>
                        <img 
                            src={coverPreview} 
                            alt="preview" 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                        />
                        <div className="relative z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <Text strong style={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Change Banner
                            </Text>
                        </div>
                        </>
                     ) : (
                        <>
                        <PictureOutlined className="text-3xl opacity-10" />
                        <Text strong style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
                            Banner
                        </Text>
                        </>
                     )}
                </div>
             </Upload>
        </div>

        <Form.Item
          label={<Text strong style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontSize: '9px' }}>Sequence Index</Text>}
          name="display_order"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting} 
            disabled={!isFormValid}
            block 
            size="large"
            className="admin-btn-primary"
            style={{ height: '54px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', marginTop: 12 }}
        >
            Save
        </Button>
      </Form>
    </div>
  );
};

export default MusicForm;
