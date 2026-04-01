import React from "react";
import { Table, Button, Space, Image, Typography, Tag, Empty, Input } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  SearchOutlined
} from "@ant-design/icons";
import type { Media } from "../../../services/mediaService";

const { Text } = Typography;

interface MediaListProps {
  medias: Media[];
  loading: boolean;
  onEdit: (media: Media) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

const MediaList: React.FC<MediaListProps> = ({ medias, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Banner",
      dataIndex: "image_url",
      key: "image_url",
      width: 100,
      render: (url: string) => (
        <Image 
          src={url} 
          width={64} 
          height={80} 
          className="rounded-lg object-cover border border-white/5 shadow-md"
          fallback="https://via.placeholder.com/64x80?text=MEDIA"
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      filters: [
        { text: 'Anime', value: 'anime' },
        { text: 'Game', value: 'game' },
      ],
      onFilter: (value: any, record: Media) => record.type === value,
      render: (type: string) => (
        <Tag 
          color={type === 'anime' ? 'processing' : 'warning'} 
          style={{ textTransform: 'uppercase', fontSize: '10px', borderRadius: '4px', fontWeight: 'bold' }}
        >
          {type}
        </Tag>
      )
    },
    {
      title: "Details",
      key: "details",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search identity`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: any, record: Media) =>
        record.title.toLowerCase().includes(value.toLowerCase()),
      render: (_: any, record: Media) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: '#fff', fontSize: '14px' }}>{record.title}</Text>
          <Space size={4}>
            <CalendarOutlined style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>{record.year || 'Unknown'}</Text>
          </Space>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            {record.categories?.map(cat => (
                <Tag 
                    key={cat.id} 
                    bordered={false} 
                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '9px', textTransform: 'uppercase', borderRadius: '4px' }}
                >
                    {cat.name}
                </Tag>
            ))}
          </div>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{text || 'No description provided'}</Text>
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: 'right' as const,
      render: (_: any, record: Media) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
            onClick={() => onEdit(record)}
            className="hover:bg-white/5"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record.id, record.image_url)}
            className="hover:bg-red-500/10"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-table-container">
      <Table 
        dataSource={medias} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8, hideOnSinglePage: true }}
        className="admin-table"
        locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text style={{ color: 'rgba(255,255,255,0.2)' }}>No media records found. Initialize database to visualize.</Text>} />
        }}
      />
    </div>
  );
};

export default MediaList;
