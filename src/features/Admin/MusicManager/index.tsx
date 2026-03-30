import React, { useState } from "react";
import { Row, Col, Space, Typography, Breadcrumb, Divider, Modal, Button } from "antd";
import { 
  CustomerServiceOutlined, 
  HomeOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useMusic } from "../../../hooks/useMusic";
import MusicList from "./MusicList";
import MusicForm from "./MusicForm";
import type { Song, CreateSongInput } from "../../../services/musicService";

const { Title, Text } = Typography;

const MusicManagerIndex: React.FC = () => {
  const { 
    songs, 
    loading, 
    uploading, 
    nextOrder, 
    saveSong, 
    editSong,
    removeSong
  } = useMusic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handleOpenModal = (song: Song | null = null) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSong(null);
  };

  const handleFormSubmit = async (values: Partial<CreateSongInput>) => {
    let success = false;
    if (editingSong) {
      success = await editSong(editingSong.id, values);
    } else {
      success = await saveSong(values as CreateSongInput);
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
                    { title: <><CustomerServiceOutlined /> Music Manager</> },
                ]}
            />
            <Title level={4} style={{ color: '#fff', margin: '8px 0 0', fontWeight: 900, textTransform: 'uppercase' }}>
                Music Manager
            </Title>
          </Space>

          <Button 
              type="primary" 
              shape="round" 
              icon={<PlusOutlined />} 
              onClick={() => handleOpenModal(null)}
              style={{ fontWeight: 'bold', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
          >
              New Music
          </Button>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '16px 0' }} />

        {/* Layout: Single Column for better Modal UX */}
        <Row>
          <Col span={24}>
            <MusicList 
                songs={songs} 
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={removeSong}
            />
          </Col>
        </Row>
      </Space>

      {/* FORM MODAL */}
      <Modal
        title={<Text strong style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>{editingSong ? 'Edit Music' : 'Add Music'}</Text>}
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
        <MusicForm 
            initialData={editingSong}
            onSubmit={handleFormSubmit}
            submitting={uploading}
            defaultOrder={nextOrder}
        />
      </Modal>
    </div>
  );
};

export default MusicManagerIndex;
