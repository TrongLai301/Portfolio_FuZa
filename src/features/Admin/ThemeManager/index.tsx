import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  ColorPicker,
  Divider,
  Space,
  Breadcrumb,
} from "antd";
import {
  SaveOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  AppstoreOutlined,
  EyeOutlined,
  UndoOutlined,
  HomeOutlined,
  LockOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { usePortfolio } from "../../../commons/PortfolioContext";
import { DEFAULT_SITE_SETTINGS } from "../../../services/siteSettingsService";

const { Title, Text, Paragraph } = Typography;

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
      parseColorToPickerValue("linear-gradient(135deg, #10b981 0%, #059669 100%)"),
      parseColorToPickerValue("linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #f43f5e 100%)"),
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
      "#94a3b8",
      "#64748b",
    ],
  },
];

export const ThemeManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, loading } = usePortfolio();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Live preview watch states
  const watchedValues = Form.useWatch([], form) || {};

  const previewLogoText =
    watchedValues.header_logo_text ||
    siteSettings?.header_logo_text ||
    DEFAULT_SITE_SETTINGS.header_logo_text;

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

  const extractFirstSolid = (val?: any): string => {
    const colorStr = extractColor(val, "#ffffff");
    if (typeof colorStr === "string" && colorStr.includes("gradient")) {
      const match = colorStr.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/);
      return match ? match[0] : "#ffffff";
    }
    return colorStr || "#ffffff";
  };

  const previewLogoColor = extractColor(
    watchedValues.header_logo_color,
    siteSettings?.header_logo_color || DEFAULT_SITE_SETTINGS.header_logo_color
  );
  const previewMenuTextColor = extractColor(
    watchedValues.menu_text_color,
    siteSettings?.menu_text_color || DEFAULT_SITE_SETTINGS.menu_text_color
  );
  const previewMenuActiveColor = extractColor(
    watchedValues.menu_active_color,
    siteSettings?.menu_active_color || DEFAULT_SITE_SETTINGS.menu_active_color
  );
  const previewTitle1 = extractColor(
    watchedValues.title_primary_color,
    siteSettings?.title_primary_color || DEFAULT_SITE_SETTINGS.title_primary_color
  );
  const previewTitle2 = extractColor(
    watchedValues.title_secondary_color,
    siteSettings?.title_secondary_color || DEFAULT_SITE_SETTINGS.title_secondary_color
  );

  useEffect(() => {
    if (siteSettings) {
      form.setFieldsValue({
        header_logo_text: siteSettings.header_logo_text,
        header_logo_color: parseColorToPickerValue(siteSettings.header_logo_color),
        menu_text_color: parseColorToPickerValue(siteSettings.menu_text_color),
        menu_active_color: parseColorToPickerValue(siteSettings.menu_active_color),
        title_primary_color: parseColorToPickerValue(siteSettings.title_primary_color),
        title_secondary_color: parseColorToPickerValue(siteSettings.title_secondary_color),
      });
    }
  }, [siteSettings, form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        header_logo_text:
          values.header_logo_text?.trim() || DEFAULT_SITE_SETTINGS.header_logo_text,
        header_logo_color: extractColor(values.header_logo_color, "#ffffff"),
        menu_text_color: extractColor(values.menu_text_color, "#bdc3c7"),
        menu_active_color: extractColor(values.menu_active_color, DEFAULT_SITE_SETTINGS.menu_active_color),
        title_primary_color: extractColor(values.title_primary_color, "#ffffff"),
        title_secondary_color: extractColor(values.title_secondary_color, DEFAULT_SITE_SETTINGS.title_secondary_color),
      };

      await updateSiteSettings(payload);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    form.setFieldsValue({
      header_logo_text: DEFAULT_SITE_SETTINGS.header_logo_text,
      header_logo_color: parseColorToPickerValue(DEFAULT_SITE_SETTINGS.header_logo_color),
      menu_text_color: parseColorToPickerValue(DEFAULT_SITE_SETTINGS.menu_text_color),
      menu_active_color: parseColorToPickerValue(DEFAULT_SITE_SETTINGS.menu_active_color),
      title_primary_color: parseColorToPickerValue(DEFAULT_SITE_SETTINGS.title_primary_color),
      title_secondary_color: parseColorToPickerValue(DEFAULT_SITE_SETTINGS.title_secondary_color),
    });
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-28 pt-2">
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        {/* Breadcrumb Navigation & Top Action Header */}
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
                    <BgColorsOutlined /> Theme & Header
                  </span>
                ),
              },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <BgColorsOutlined style={{ fontSize: "22px", color: "#818cf8" }} />
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
                  Theme & Header Styling
                </Title>
              </div>
              <Text className="text-gray-400 text-sm mt-1.5 block">
                Customize top-left header logo text & colors, navbar menu colors, and section titles (supports solid & gradient colors).
              </Text>
            </div>

            <Space size="middle" className="self-end md:self-auto shrink-0">
              <Button
                icon={<UndoOutlined />}
                onClick={handleResetDefaults}
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "#e2e8f0",
                }}
              >
                Reset Defaults
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving || loading}
                className="admin-btn-primary"
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
            </Space>
          </div>
        </div>

        {/* Main Content Grid with Generous Gutter */}
        <Row gutter={[32, 32]}>
          {/* Left Column: Form Controls */}
          <Col xs={24} lg={14}>
            <div className="space-y-8">
              {/* Card 1: Header Logo Setting */}
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
                      Header Brand Logo
                    </Title>
                  </div>
                  <FontSizeOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Configure brand text and coloring for the top-left corner of the header (supports solid colors or linear gradients).
                </Paragraph>

                <Row gutter={[20, 20]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Logo Brand Text
                        </span>
                      }
                      name="header_logo_text"
                      rules={[{ required: true, message: "Please enter logo text" }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        placeholder="e.g. FuZa's profile"
                        className="admin-input-lg w-full"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Logo Color / Gradient
                        </span>
                      }
                      name="header_logo_color"
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
                  </Col>
                </Row>
              </div>

              {/* Card 2: Menu Navigation Colors */}
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
                      Navbar Menu Colors
                    </Title>
                  </div>
                  <AppstoreOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Set text color styling for navigation links: Home, About, Skills, Contact (choose solid colors or smooth gradients).
                </Paragraph>

                <Row gutter={[20, 20]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Default Menu Color
                        </span>
                      }
                      name="menu_text_color"
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
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Active / Hover Menu Color
                        </span>
                      }
                      name="menu_active_color"
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
                  </Col>
                </Row>
              </div>

              {/* Card 3: Section Titles Colors */}
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
                      Section Title Colors
                    </Title>
                  </div>
                  <BgColorsOutlined className="text-gray-500 text-lg" />
                </div>

                <Paragraph className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Applied to major section headings such as <strong>About Me</strong>, <strong>My Skills</strong>, <strong>Contact Me</strong> (supports metallic gradients, neon glows, rainbow presets, etc.).
                </Paragraph>

                <Row gutter={[20, 20]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Primary Word (About / My / Contact)
                        </span>
                      }
                      name="title_primary_color"
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
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span className="admin-theme-label">
                          Secondary Word (Me / Skills)
                        </span>
                      }
                      name="title_secondary_color"
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
                  </Col>
                </Row>
              </div>

              {/* Bottom Large Submit Button for Easy Access */}
              <div className="pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving || loading}
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
                  Save All Changes
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Column: Interactive Live Preview with Desktop Frame */}
          <Col xs={24} lg={10}>
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
                    <span>portfolio-preview.local</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                    <EyeOutlined />
                    <span>LIVE</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Simulated Header */}
                  <div>
                    <div className="text-[10px] text-gray-400 mb-2 uppercase font-mono tracking-wider font-bold">
                      Header Preview:
                    </div>
                    <div
                      className="p-4 rounded-2xl border border-white/10 relative overflow-hidden"
                      style={{
                        background: "rgba(15, 20, 40, 0.95)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        {/* Logo */}
                        <div
                          className="flex items-center gap-2 select-none"
                          style={{
                            fontFamily: "'Brush Script MT', cursive",
                            fontSize: "1.75rem",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {renderGradientText(previewLogoText, previewLogoColor)}
                          <FontAwesomeIcon
                            icon={faCode}
                            style={{
                              fontSize: "1.2rem",
                              color: extractFirstSolid(previewLogoColor),
                            }}
                          />
                        </div>

                        {/* Menu Items */}
                        <div className="flex items-center gap-3 text-xs font-medium">
                          <span className="transition-colors px-1">
                            {renderGradientText("Home", previewMenuTextColor)}
                          </span>
                          <span className="relative pb-0.5 font-bold px-1">
                            {renderGradientText("About", previewMenuActiveColor)}
                            <span
                              className="absolute left-0 bottom-0 w-full h-[2px]"
                              style={{ background: previewMenuActiveColor }}
                            />
                          </span>
                          <span className="transition-colors px-1">
                            {renderGradientText("Skills", previewMenuTextColor)}
                          </span>
                          <span className="transition-colors px-1">
                            {renderGradientText("Contact", previewMenuTextColor)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider style={{ borderColor: "rgba(255,255,255,0.08)", margin: "12px 0" }} />

                  {/* Simulated Section Titles */}
                  <div>
                    <div className="text-[10px] text-gray-400 mb-3 uppercase font-mono tracking-wider font-bold">
                      Section Titles Preview:
                    </div>

                    <div className="space-y-4">
                      {/* About Me */}
                      <div className="bg-white/3 p-4 rounded-2xl border border-white/5 text-center">
                        <div className="text-2xl font-bold tracking-tight">
                          {renderGradientText("About", previewTitle1)}
                          {renderGradientText(" Me", previewTitle2)}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          Here's some information & personal interests about me.
                        </div>
                      </div>

                      {/* My Skills */}
                      <div className="bg-white/3 p-4 rounded-2xl border border-white/5 text-center">
                        <div className="text-2xl font-bold tracking-tight">
                          {renderGradientText("My", previewTitle1)}
                          {renderGradientText(" Skills", previewTitle2)}
                        </div>
                      </div>

                      {/* Contact Me */}
                      <div className="bg-white/3 p-4 rounded-2xl border border-white/5 text-center">
                        <div className="text-2xl font-bold tracking-tight">
                          {renderGradientText("Contact", previewTitle1)}
                          {renderGradientText(" Me", previewTitle2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-300">
                    <CheckCircleFilled className="text-indigo-400 text-sm shrink-0" />
                    <span>Supports both Hex/RGB solid colors and linear gradients across typography.</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ThemeManager;
