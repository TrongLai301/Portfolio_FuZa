import React, { useState } from "react";
import {
  Row,
  Col,
  Space,
  Typography,
  Breadcrumb,
  Divider,
  Modal,
  Button,
  Tag,
  Input,
  Form,
  Radio,
} from "antd";
import {
  PlaySquareOutlined,
  HomeOutlined,
  PlusOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useMedia } from "../../../hooks/useMedia";
import {
  mediaService,
  type Media,
  type MediaType,
} from "../../../services/mediaService";
import MediaList from "./MediaList";
import MediaForm from "./MediaForm";
import { toast } from "sonner";

const { Title, Text } = Typography;

const MediaManagerIndex: React.FC = () => {
  const {
    medias,
    categories,
    loading,
    submitting,
    saveMedia,
    editMedia,
    removeMedia,
    fetchData,
  } = useMedia();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Category Form
  const [catForm] = Form.useForm();
  const [catLoading, setCatLoading] = useState(false);

  const handleOpenModal = (media: Media | null = null) => {
    setEditingMedia(media);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedia(null);
  };

  const handleFormSubmit = async (values: any) => {
    let success = false;
    if (editingMedia) {
      success = await editMedia(editingMedia.id, values);
    } else {
      success = await saveMedia(values);
    }

    if (success) {
      handleCloseModal();
    }
    return success;
  };

  const handleAddCategory = async (values: {
    name: string;
    type: MediaType;
  }) => {
    setCatLoading(true);
    try {
      const slug = `${values.type}-${values.name.toLowerCase().replace(/ /g, "-")}`;
      await mediaService.createCategory({
        name: values.name,
        type: values.type,
        slug,
      });
      toast.success(
        `Category '${values.name}' assigned to ${values.type.toUpperCase()}`,
      );
      catForm.resetFields();
      catForm.setFieldsValue({ type: values.type });
      await fetchData();
    } catch (e: any) {
      toast.error("Category creation failed: " + e.message);
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await mediaService.deleteCategory(id);
      toast.success("Category signal terminated.");
      await fetchData();
    } catch (e: any) {
      toast.error("Retraction failed: " + e.message);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Breadcrumbs & Header Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Space direction="vertical" size={0}>
            <Breadcrumb
              items={[
                {
                  title: (
                    <>
                      <HomeOutlined /> Dashboard
                    </>
                  ),
                  href: "/admin",
                },
                {
                  title: (
                    <>
                      <PlaySquareOutlined /> Media Manager
                    </>
                  ),
                },
              ]}
            />
            <Title
              level={4}
              style={{
                color: "#fff",
                margin: "8px 0 0",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Media Manager
            </Title>
          </Space>

          <Space>
            <Button
              type="primary"
              shape="round"
              icon={<TagsOutlined />}
              onClick={() => setIsCategoryModalOpen(true)}
              style={{ 
                fontWeight: "bold", 
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)" 
              }}
            >
              Categories
            </Button>
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal(null)}
              style={{
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              New Media
            </Button>
          </Space>
        </div>

        <Divider
          style={{ borderColor: "rgba(255, 255, 255, 0.05)", margin: "16px 0" }}
        />

        {/* Layout */}
        <Row>
          <Col span={24}>
            <MediaList
              medias={medias}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={removeMedia}
            />
          </Col>
        </Row>
      </Space>

      {/* MEDIA FORM MODAL */}
      <Modal
        title={
          <Text
            strong
            style={{
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {editingMedia ? "Edit Media" : "Add Media"}
          </Text>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        centered
        styles={{
          body: { background: "transparent" },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            paddingBottom: "16px",
          },
        }}
      >
        <MediaForm
          initialData={editingMedia}
          categories={categories}
          onSubmit={handleFormSubmit}
          submitting={submitting}
        />
      </Modal>

      {/* CATEGORY MANAGER MODAL */}
      <Modal
        title={
          <Text
            strong
            style={{
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Universe Category Manager
          </Text>
        }
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
        width={550}
        centered
        styles={{
          body: { background: "transparent" },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            paddingBottom: "16px",
          },
        }}
      >
        <div className="p-4">
          <Form
            form={catForm}
            onFinish={handleAddCategory}
            layout="vertical"
            initialValues={{ type: "anime" }}
            disabled={catLoading}
            style={{
              marginBottom: 32,
              background: "rgba(255,255,255,0.02)",
              padding: 20,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex gap-4 items-end">
              <Form.Item
                name="type"
                label={
                  <Text
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    Target System
                  </Text>
                }
                style={{ margin: 0 }}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="anime">Anime</Radio.Button>
                  <Radio.Button value="game">Game</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="name"
                label={
                  <Text
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    Genre Title
                  </Text>
                }
                rules={[{ required: true }]}
                style={{ flex: 1, margin: 0 }}
              >
                <Input placeholder="e.g. Adventure / RPG" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={catLoading}
                icon={<PlusOutlined />}
                style={{ height: 32 }}
              />
            </div>
          </Form>

          <div className="flex flex-col gap-6">
            <div>
              <Text
                strong
                style={{
                  color: "#6366f1",
                  fontSize: 11,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Anime Channels
              </Text>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.type === "anime")
                  .map((cat) => (
                    <Tag
                      key={cat.id}
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        handleDeleteCategory(cat.id);
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: "rgba(99, 102, 241, 0.05)",
                        border: "1px solid rgba(99, 102, 241, 0.1)",
                        color: "#6366f1",
                      }}
                    >
                      {cat.name}
                    </Tag>
                  ))}
              </div>
            </div>

            <div>
              <Text
                strong
                style={{
                  color: "#f59e0b",
                  fontSize: 11,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Game Frequencies
              </Text>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.type === "game")
                  .map((cat) => (
                    <Tag
                      key={cat.id}
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        handleDeleteCategory(cat.id);
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: "rgba(245, 158, 11, 0.05)",
                        border: "1px solid rgba(245, 158, 11, 0.1)",
                        color: "#f59e0b",
                      }}
                    >
                      {cat.name}
                    </Tag>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MediaManagerIndex;
