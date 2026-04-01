import React, { useState } from "react";
import { Layout, Typography, Button, Space, Breadcrumb, Divider } from "antd";
import { 
  PlusOutlined, 
  HomeOutlined, 
  GlobalOutlined
} from "@ant-design/icons";
import SocialLinkList from "./SocialLinkList";
import SocialLinkForm from "./SocialLinkForm";
import { useSocialLinks } from "../../../hooks/useSocialLinks";
import type { SocialLink } from "../../../services/socialLinkService";

const { Content } = Layout;
const { Title, Text } = Typography;

const SocialLinksManager: React.FC = () => {
  const { links, loading, submitting, nextOrder, addLink, editLink, removeLink } = useSocialLinks();
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAdd = () => {
    setEditingLink(null);
    setIsFormVisible(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingLink(null);
  };

  const handleSubmit = async (data: SocialLink) => {
    const success = editingLink 
      ? await editLink(editingLink.id!, data)
      : await addLink(data);
    
    if (success) {
      setIsFormVisible(false);
      setEditingLink(null);
    }
    return success;
  };

  return (
    <Content className="admin-content-layout">
      <div className="admin-header-context">
        <Breadcrumb
          className="admin-breadcrumb"
          items={[
            { title: <><HomeOutlined /> Dashboard</>, href: "/admin" },
            { title: <><GlobalOutlined /> Social Links</> },
          ]}
        />
        <div className="flex justify-between items-center mt-4">
          <div>
            <Title level={2} className="admin-page-title">Social Links</Title>
            <Text className="admin-page-subtitle">Manage your social media presence and "Follow me" links</Text>
          </div>
          <Space>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
              className="admin-btn-primary"
              style={{ fontWeight: 'bold' }}
            >
              New Link
            </Button>
          </Space>
        </div>
      </div>

      <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '0 0 24px 0' }} />

      {!isFormVisible ? (
        <SocialLinkList 
          links={links} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={removeLink} 
        />
      ) : (
        <SocialLinkForm 
          initialData={editingLink} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          submitting={submitting}
          defaultOrder={nextOrder}
        />
      )}
    </Content>
  );
};

export default SocialLinksManager;
