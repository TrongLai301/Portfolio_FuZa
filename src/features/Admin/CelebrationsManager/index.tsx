import React, { useState } from "react";
import { Row, Col, Space, Typography, Breadcrumb, Divider, Modal, Button } from "antd";
import { HomeOutlined, CameraOutlined, PlusOutlined } from "@ant-design/icons";
import { useCelebrations } from "../../../hooks/useCelebrations";
import type { Celebration } from "../../../services/celebrationService";
import CelebrationList from "./CelebrationList";
import CelebrationForm from "./CelebrationForm";

const { Title, Text } = Typography;

const CelebrationsIndex: React.FC = () => {
  const { 
    celebrations, 
    loading, 
    submitting, 
    saveCelebration, 
    editCelebration, 
    removeCelebration 
  } = useCelebrations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCelebration, setEditingCelebration] = useState<Celebration | null>(null);

  const handleOpenModal = (celebration: Celebration | null = null) => {
    setEditingCelebration(celebration);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCelebration(null);
  };

  const handleFormSubmit = async (values: any) => {
    let success = false;
    if (editingCelebration) {
      success = await editCelebration(editingCelebration.id, values);
    } else {
      success = await saveCelebration(values);
    }

    if (success) {
      handleCloseModal();
    }
    return success;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* Breadcrumbs & Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Space direction="vertical" size={0}>
            <Breadcrumb
                items={[
                    { title: <><HomeOutlined /> Dashboard</>, href: '/admin' },
                    { title: <><CameraOutlined /> Celebrations</> },
                ]}
            />
            <Title level={4} style={{ color: '#fff', margin: '8px 0 0', fontWeight: 900, textTransform: 'uppercase' }}>
                Memory Manager
            </Title>
          </Space>

          <Button 
            type="primary" 
            shape="round" 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenModal(null)}
            style={{ fontWeight: 'bold', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
          >
            Archive New Memory
          </Button>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '16px 0' }} />

        {/* Layout */}
        <Row>
          <Col span={24}>
            <CelebrationList 
                celebrations={celebrations} 
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={removeCelebration}
            />
          </Col>
        </Row>
      </Space>

      {/* FORM MODAL */}
      <Modal
        title={<Text strong style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>{editingCelebration ? 'Modify Memory' : 'Archive Memory'}</Text>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        centered
        styles={{ 
            body: { background: 'transparent' },
            header: { background: 'transparent', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }
        }}
      >
        <CelebrationForm 
            initialData={editingCelebration}
            onSubmit={handleFormSubmit}
            submitting={submitting}
        />
      </Modal>
    </div>
  );
};

export default CelebrationsIndex;
