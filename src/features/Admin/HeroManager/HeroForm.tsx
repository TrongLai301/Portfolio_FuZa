import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Upload,
  Row,
  Col,
  ColorPicker,
  Breadcrumb,
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
  HomeOutlined,
  EyeOutlined,
  LockOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact, faJs, faGithub } from "@fortawesome/free-brands-svg-icons";
import { usePasteImage } from "../../../hooks/usePasteImage";
import ImageCropperModal from "../components/ImageCropperModal";
import CosmicPlanetarySystem from "../../../components/CosmicPlanetarySystem";
import nilou from "../../../assets/image/commons/nilouPr4.png";
import { resolveStorageUrl } from "../../../lib/supabaseClient";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const parseColorToPickerValue = (str?: any) => {
  if (!str) return "#ffffff";
  if (typeof str !== "string") return str;
  if (!str.includes("gradient")) return str;

  // 1. Try with percentages: e.g. '#6366f1 0%'
  const withPercentRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s*(\d+)%/g;
  const stops: { color: string; percent: number }[] = [];
  let match;
  while ((match = withPercentRegex.exec(str)) !== null) {
    stops.push({
      color: match[1],
      percent: parseInt(match[2], 10),
    });
  }
  if (stops.length >= 2) return stops;

  // 2. Try without percentages: e.g. 'linear-gradient(90deg, #6366f1, #a855f7)'
  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g;
  const colors: string[] = [];
  while ((match = colorRegex.exec(str)) !== null) {
    colors.push(match[1]);
  }
  if (colors.length >= 2) {
    return colors.map((c, i) => ({
      color: c,
      percent: Math.round((i / (colors.length - 1)) * 100),
    }));
  }

  return str;
};

const COLOR_PRESETS = [
  {
    label: "Featured Gradients",
    colors: [
      parseColorToPickerValue("linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"),
      parseColorToPickerValue("linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)"),
      parseColorToPickerValue("linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)"),
      parseColorToPickerValue("linear-gradient(180deg, #333333 0%, #ffffff 100%)"),
      parseColorToPickerValue("linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)"),
    ],
  },
  {
    label: "Solid Colors",
    colors: [
      "#ffffff",
      "#bdc3c7",
      "#6366f1",
      "#ec4899",
      "#38bdf8",
      "#10b981",
      "#f59e0b",
      "#e2e8f0",
    ],
  },
];

interface HeroFormProps {
  initialValues?: any;
  typewriterTexts: any[];
  onSaveAll: (values: any) => Promise<void>;
  saving: boolean;
}

const extractColor = (val: any, fallback: string): string => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val.toCssString === "function") {
    try {
      const res = val.toCssString();
      if (typeof res === "string" && res) return res;
    } catch {
      // fallback
    }
  }
  if (Array.isArray(val) && val.length > 0) {
    try {
      return `linear-gradient(90deg, ${val
        .map((s: any) => `${extractColor(s.color, "#ffffff")} ${s.percent ?? 0}%`)
        .join(", ")})`;
    } catch {
      // fallback
    }
  }
  if (typeof val.toHexString === "function") {
    try {
      const res = val.toHexString();
      if (typeof res === "string" && res) return res;
    } catch {
      // fallback
    }
  }
  if (typeof val.toRgbString === "function") {
    try {
      const res = val.toRgbString();
      if (typeof res === "string" && res) return res;
    } catch {
      // fallback
    }
  }
  if (val.colors && Array.isArray(val.colors)) {
    return extractColor(val.colors, fallback);
  }
  if (val.metaColor) {
    return extractColor(val.metaColor, fallback);
  }
  return fallback;
};

const renderGradientText = (
  text: string,
  colorOrGradientInput: any,
  extraStyle?: React.CSSProperties
) => {
  const colorStr = extractColor(colorOrGradientInput, "#ffffff");
  const isGrad = typeof colorStr === "string" && colorStr.includes("gradient");
  if (!isGrad) {
    return (
      <span
        style={{
          color: colorStr || "#ffffff",
          display: "inline-block",
          ...extraStyle,
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      style={{
        backgroundImage: colorStr,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        display: "inline-block",
        ...extraStyle,
      }}
    >
      {text}
    </span>
  );
};

export const HeroForm: React.FC<HeroFormProps> = ({
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
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropRawFile, setCropRawFile] = useState<File | null>(null);

  // Watch all values for live preview
  const watchedValues = Form.useWatch([], form) || {};

  // Typewriter cycling animation for Live Preview
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const rawPhrases = watchedValues.phrases || typewriterTexts || [];
  const phrases = Array.isArray(rawPhrases)
    ? rawPhrases.filter((p: any) => p && p.content)
    : [];

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [phrases.length]);

  const currentPhrase =
    phrases[activePhraseIndex] ||
    phrases[0] || { content: "Web-Developer", content_color: "#6366f1" };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        main_text_prefix_color: parseColorToPickerValue(initialValues.main_text_prefix_color),
        main_text_suffix_color: parseColorToPickerValue(initialValues.main_text_suffix_color),
        orbit_animation_color: parseColorToPickerValue(initialValues.orbit_animation_color),
        phrases: typewriterTexts.map((t) => ({
          id: t.id,
          content: t.content,
          content_color: parseColorToPickerValue(t.content_color || "#6366f1"),
        })),
      });
      setVideoPreview(resolveStorageUrl(initialValues.video_bg_url) || "");
      setOrbitPreview(resolveStorageUrl(initialValues.orbit_image_url) || "");
    }
  }, [initialValues, typewriterTexts, form]);

  const onFinish = (values: any) => {
    const formattedPhrases = values.phrases?.map((p: any) => ({
      ...p,
      content_color: extractColor(p.content_color, "#6366f1"),
    }));

    const orbitColor = extractColor(values.orbit_animation_color, "#6366f1");
    const prefixColor = extractColor(values.main_text_prefix_color, "#ffffff");
    const suffixColor = extractColor(values.main_text_suffix_color, "#6366f1");

    onSaveAll({
      ...values,
      main_text_prefix_color: prefixColor,
      main_text_suffix_color: suffixColor,
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
    setCropRawFile(file);
    setCropperOpen(true);
    return false;
  };

  // Support pasting image (avatar) or video directly from clipboard (Ctrl+V / Cmd+V)
  usePasteImage({
    onPaste: (pastedFile) => {
      if (pastedFile.type.startsWith("video/")) {
        beforeUploadVideo(pastedFile);
      } else {
        beforeUploadOrbit(pastedFile);
      }
    },
    enabled: true,
    allowedTypes: ["image/", "video/"],
    successMessage: "Đã dán tệp từ clipboard!",
  });

  const handleOrbitCropped = (croppedFile: File) => {
    setOrbitFile(croppedFile);
    setOrbitPreview(URL.createObjectURL(croppedFile));
    setCropperOpen(false);
  };

  // Preview computed values
  const previewPrefix = watchedValues.main_text_prefix ?? initialValues?.main_text_prefix ?? "Hello,";
  const previewPrefixColor = extractColor(
    watchedValues.main_text_prefix_color,
    initialValues?.main_text_prefix_color || "#ffffff"
  );
  const previewSuffix = watchedValues.main_text_suffix ?? initialValues?.main_text_suffix ?? "I'm FuZa";
  const previewSuffixColor = extractColor(
    watchedValues.main_text_suffix_color,
    initialValues?.main_text_suffix_color || "#6366f1"
  );
  const previewDesc =
    watchedValues.description ??
    initialValues?.description ??
    "A passionate developer who loves building modern and responsive web applications using React, Java, and JavaScript.";
  const previewOrbitColor = extractColor(
    watchedValues.orbit_animation_color,
    initialValues?.orbit_animation_color || "#6366f1"
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-28 pt-2">
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        {/* Breadcrumb & Top Page Header */}
        <div className="mb-10 pb-6 border-b border-white/10">
          <Breadcrumb
            className="mb-3"
            items={[
              {
                title: (
                  <span className="flex items-center gap-1.5 text-gray-400 hover:text-white">
                    <HomeOutlined /> Dashboard
                  </span>
                ),
                href: "/admin",
              },
              {
                title: (
                  <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                    <RocketOutlined /> Hero Section
                  </span>
                ),
              },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <RocketOutlined style={{ fontSize: "22px", color: "#818cf8" }} />
                </div>
                <Title
                  level={2}
                  style={{
                    color: "#fff",
                    margin: 0,
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    fontSize: "28px",
                  }}
                >
                  Hero Section Editor
                </Title>
              </div>
              <Text className="text-gray-400 text-sm mt-1.5 block">
                Customize Hero landing page: background video, orbiting avatar, typewriter effects, and introduction copy.
              </Text>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              className="admin-btn-primary self-end md:self-auto shrink-0"
              style={{
                height: "48px",
                padding: "0 36px",
                borderRadius: "16px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content Layout with Generous Gutter */}
        <Row gutter={[32, 32]}>
          {/* Left Column: Form Controls */}
          <Col xs={24} lg={13}>
            <div className="space-y-8">
              {/* Card 1: Media Assets (Video & Orbit Avatar) */}
              <div
                className="bg-[#141416] border border-white/10 rounded-3xl p-7 md:p-8 hover:border-white/20 transition-all duration-300 shadow-xl relative overflow-hidden"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/30 font-mono">
                      01
                    </span>
                    <Title level={4} style={{ color: "#fff", margin: 0, fontWeight: 800 }}>
                      Media Assets (Background Video & Avatar)
                    </Title>
                  </div>
                  <VideoCameraOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Upload looping MP4 background video and orbit avatar profile picture (supports 1:1 square crop).
                </Paragraph>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  {/* Video Upload Box */}
                  <Upload beforeUpload={beforeUploadVideo} showUploadList={false} accept="video/*">
                    <div className="w-full h-36 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/8 transition-all flex flex-col items-center justify-center overflow-hidden relative cursor-pointer group">
                      {videoPreview ? (
                        <>
                          <video
                            src={videoPreview}
                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                            muted
                            loop
                            autoPlay
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <PlayCircleOutlined className="text-2xl text-indigo-400 mb-1" />
                            <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-0.5 rounded-full">
                              Change Video
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <VideoCameraOutlined className="text-3xl text-gray-500 mb-1.5" />
                          <span className="text-xs text-gray-400 font-medium">Upload Background Video (MP4)</span>
                        </>
                      )}
                    </div>
                  </Upload>

                  {/* Orbit Image Upload Box */}
                  <Upload beforeUpload={beforeUploadOrbit} showUploadList={false} accept="image/*">
                    <div className="w-full h-36 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/8 transition-all flex flex-col items-center justify-center overflow-hidden relative cursor-pointer group">
                      {orbitPreview ? (
                        <>
                          <img
                            src={orbitPreview}
                            alt="Orbit Preview"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== nilou) {
                                target.src = nilou;
                              }
                            }}
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <PictureOutlined className="text-2xl text-indigo-400 mb-1" />
                            <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-0.5 rounded-full">
                              Crop / Change Orbit Photo
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadOutlined className="text-3xl text-gray-500 mb-1" />
                          <span className="text-xs text-gray-300 font-medium">Upload Orbit Avatar</span>
                          <span className="text-[10px] text-indigo-400 font-mono mt-0.5">Dán ảnh (Ctrl+V / ⌘V)</span>
                        </>
                      )}
                    </div>
                  </Upload>
                </div>

                {/* Orbit Glow Color Picker */}
                <Form.Item
                  name="orbit_animation_color"
                  label={
                    <Text strong className="text-gray-300 text-[11px] uppercase tracking-wider">
                      Orbit Glow Illumination Color
                    </Text>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <ColorPicker
                    mode={["single", "gradient"]}
                    presets={COLOR_PRESETS}
                    showText
                    size="large"
                    className="admin-color-picker w-full"
                  />
                </Form.Item>
              </div>

              {/* Card 2: Main Text & Description */}
              <div
                className="bg-[#141416] border border-white/10 rounded-3xl p-7 md:p-8 hover:border-white/20 transition-all duration-300 shadow-xl relative overflow-hidden"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/30 font-mono">
                      02
                    </span>
                    <Title level={4} style={{ color: "#fff", margin: 0, fontWeight: 800 }}>
                      Greeting & Hero Copy
                    </Title>
                  </div>
                  <RocketOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Configure primary headline text (Part 1 + Part 2) with gradient support and short biography.
                </Paragraph>

                {/* Part 1 (Prefix) */}
                <div className="p-4 rounded-2xl bg-white/4 border border-white/5 mb-5">
                  <Text strong className="text-[11px] text-indigo-300 uppercase tracking-wider block mb-3">
                    Part 1: Salutation Greeting (e.g. Hello,)
                  </Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={15}>
                      <Form.Item name="main_text_prefix" style={{ marginBottom: 0 }}>
                        <Input
                          placeholder="Hello,"
                          className="admin-input-lg"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            color: "#fff",
                            height: "46px",
                            borderRadius: "14px",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={9}>
                      <Form.Item name="main_text_prefix_color" style={{ marginBottom: 0 }}>
                        <ColorPicker
                          mode={["single", "gradient"]}
                          presets={COLOR_PRESETS}
                          showText
                          size="large"
                          className="admin-color-picker w-full"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                {/* Part 2 (Suffix) */}
                <div className="p-4 rounded-2xl bg-white/4 border border-white/5 mb-6">
                  <Text strong className="text-[11px] text-purple-300 uppercase tracking-wider block mb-3">
                    Part 2: Name / Identity (e.g. I'm FuZa)
                  </Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={15}>
                      <Form.Item name="main_text_suffix" style={{ marginBottom: 0 }}>
                        <Input
                          placeholder="I'm FuZa"
                          className="admin-input-lg"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            color: "#fff",
                            height: "46px",
                            borderRadius: "14px",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={9}>
                      <Form.Item name="main_text_suffix_color" style={{ marginBottom: 0 }}>
                        <ColorPicker
                          mode={["single", "gradient"]}
                          presets={COLOR_PRESETS}
                          showText
                          size="large"
                          className="admin-color-picker w-full"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                {/* Description */}
                <Form.Item
                  name="description"
                  label={
                    <Text strong className="text-gray-300 text-[11px] uppercase tracking-wider">
                      Short Biography / Summary
                    </Text>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <TextArea
                    rows={4}
                    placeholder="Write a concise biography or welcome message..."
                    className="admin-input-dark"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#fff",
                      borderRadius: "14px",
                      padding: "12px",
                      fontSize: "13px",
                    }}
                  />
                </Form.Item>
              </div>

              {/* Card 3: Typewriter Phrases */}
              <div
                className="bg-[#141416] border border-white/10 rounded-3xl p-7 md:p-8 hover:border-white/20 transition-all duration-300 shadow-xl relative overflow-hidden"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/30 font-mono">
                      03
                    </span>
                    <Title level={4} style={{ color: "#fff", margin: 0, fontWeight: 800 }}>
                      Typewriter Phrases (Animated Cycler)
                    </Title>
                  </div>
                  <LineHeightOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Dynamic rotating phrases and occupational titles displayed with typewriter effect.
                </Paragraph>

                <Form.List name="phrases">
                  {(fields, { add, remove }) => (
                    <div className="space-y-3">
                      {fields.map(({ key, name, ...restField }) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 bg-white/4 p-2 px-3 rounded-2xl border border-white/8 hover:border-white/15 transition-all"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "content"]}
                            rules={[{ required: true, message: "Please enter phrase content" }]}
                            style={{ flex: 1, minWidth: 0, marginBottom: 0 }}
                          >
                            <Input
                              placeholder="e.g. Web Developer..."
                              className="admin-input-dark"
                              style={{
                                height: "42px",
                                borderRadius: "12px",
                                background: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                fontSize: "14px",
                                width: "100%",
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "content_color"]}
                            style={{ marginBottom: 0, flexShrink: 0 }}
                          >
                            <ColorPicker
                              mode={["single", "gradient"]}
                              presets={COLOR_PRESETS}
                              showText
                              className="admin-color-picker-compact"
                            />
                          </Form.Item>

                          {/* Hidden ID */}
                          <Form.Item {...restField} name={[name, "id"]} hidden>
                            <Input />
                          </Form.Item>

                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="hover:bg-red-500/10 rounded-xl shrink-0 flex items-center justify-center"
                            style={{ height: "42px", width: "42px" }}
                          />
                        </div>
                      ))}

                      {fields.length === 0 && (
                        <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                          <LineHeightOutlined style={{ fontSize: "28px" }} />
                          <p className="mt-2 text-xs">No typewriter phrases yet. Click the button below to add one!</p>
                        </div>
                      )}

                      <Button
                        type="dashed"
                        onClick={() => add({ content: "", content_color: "#6366f1" })}
                        block
                        icon={<PlusOutlined />}
                        className="border-indigo-500/30 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400 h-11 rounded-2xl font-bold"
                      >
                        Add New Phrase
                      </Button>
                    </div>
                  )}
                </Form.List>
              </div>

              {/* Bottom Large Submit Button */}
              <div className="pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                  block
                  className="admin-btn-primary"
                  style={{
                    height: "52px",
                    borderRadius: "16px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontSize: "14px",
                  }}
                >
                  Save Hero Settings
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Column: Interactive Live Preview with Desktop Frame */}
          <Col xs={24} lg={11}>
            <div className="sticky top-6">
              <div
                className="bg-[#0e0e11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                style={{
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                }}
              >
                {/* Browser Window Mockup Bar */}
                <div className="bg-[#18181c] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/40 border border-white/5 text-[11px] text-gray-400 font-mono">
                    <LockOutlined className="text-green-400 text-[10px]" />
                    <span>hero-preview.local</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                    <EyeOutlined />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Simulated Hero Section Stage */}
                <div className="relative p-6 md:p-8 min-h-[460px] flex flex-col justify-between overflow-hidden bg-black/80">
                  {/* Background Video Simulation */}
                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-radial from-indigo-900/20 via-[#0a0a0f] to-black opacity-60 pointer-events-none" />
                  )}

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-bold">
                      Hero Section Preview:
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                      Desktop Scale 100%
                    </span>
                  </div>

                  {/* Center Hero Layout: 2 Columns Simulation */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 my-auto">
                    {/* Left: Text & Typewriter */}
                    <div className="flex-1 text-left space-y-3 min-w-0">
                      {/* Main Heading */}
                      <div className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                        {renderGradientText(previewPrefix, previewPrefixColor)}
                        {" "}
                        {renderGradientText(previewSuffix, previewSuffixColor)}
                      </div>

                      {/* Typewriter Simulation */}
                      <div className="flex items-center gap-1 text-sm font-semibold h-6">
                        {renderGradientText(
                          currentPhrase.content || "Developer",
                          currentPhrase.content_color || "#6366f1"
                        )}
                        <span className="w-0.5 h-4 bg-indigo-400 animate-pulse inline-block" />
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {previewDesc}
                      </p>

                      {/* Social Icons Mockup */}
                      <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
                        <span className="text-[11px]">Follow:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-gray-300 text-[10px]">
                            <FontAwesomeIcon icon={faGithub} />
                          </span>
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-blue-400 text-[10px]">
                            <FontAwesomeIcon icon={faReact} />
                          </span>
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-yellow-400 text-[10px]">
                            <FontAwesomeIcon icon={faJs} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Cosmic Planetary Solar System Preview */}
                    <div className="relative shrink-0 flex items-center justify-center scale-75 md:scale-90 origin-center -my-6">
                      <CosmicPlanetarySystem
                        avatarUrl={orbitPreview || nilou}
                        glowColor={typeof previewOrbitColor === "string" && !previewOrbitColor.includes("gradient") ? previewOrbitColor : "#38bdf8"}
                        isPlayingMusic={true}
                        isVideoPlaying={true}
                      />
                    </div>
                  </div>

                  {/* Bottom Notice */}
                  <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-xs text-indigo-300">
                    <CheckCircleFilled className="text-indigo-400 text-sm shrink-0" />
                    <span>All text, gradient styling, avatar, and background video update in real time here.</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Image Cropper Modal for Orbit Avatar */}
      <ImageCropperModal
        open={cropperOpen}
        file={cropRawFile}
        defaultAspect={1}
        title="Crop Orbit Avatar (Recommended 1:1 Square)"
        onCropComplete={handleOrbitCropped}
        onCancel={() => setCropperOpen(false)}
        onSkipCrop={(original) => handleOrbitCropped(original)}
      />
    </div>
  );
};

export default HeroForm;
