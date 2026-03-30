import React from "react";
import { Table, Button, Space, Image, Typography, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Celebration } from "../../../services/celebrationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

interface CelebrationListProps {
  celebrations: Celebration[];
  loading: boolean;
  onEdit: (celebration: Celebration) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

const CelebrationList: React.FC<CelebrationListProps> = ({ celebrations, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Memory",
      dataIndex: "image_url",
      key: "image_url",
      width: 120,
      render: (url: string) => (
        <Image 
          src={url} 
          width={100} 
          height={60} 
          className="rounded-xl object-cover border border-white/5 shadow-lg"
          fallback="https://via.placeholder.com/100x60?text=MEMORY"
        />
      ),
    },
    {
      title: "Timeline",
      key: "timeline",
      width: 150,
      render: (_: any, record: Celebration) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#fff', fontSize: '14px' }}>
            {dayjs(record.date).format('MMM D, YYYY')}
          </Text>
          <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            {dayjs(record.date).fromNow()}
          </Text>
        </Space>
      ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      render: (text: string) => <Text strong style={{ color: '#6366f1' }}>{text}</Text>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{text || '...'}</Text>
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: 'right' as const,
      render: (_: any, record: Celebration) => (
        <Space size="middle">
          <Tooltip title="Modify Memory">
            <Button 
                type="text" 
                icon={<EditOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
                onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Terminate Memory Node?"
            description="Are you sure you want to delete this archive?"
            onConfirm={() => onDelete(record.id, record.image_url)}
            okText="Purge"
            cancelText="Abort"
            okButtonProps={{ danger: true }}
          >
            <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
        dataSource={celebrations} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
        className="admin-table"
        style={{ 
            background: 'rgba(21, 21, 21, 0.8)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
    />
  );
};

export default CelebrationList;
