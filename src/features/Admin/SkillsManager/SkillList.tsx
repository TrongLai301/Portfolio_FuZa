import React from "react";
import { Table, Button, Space, Tag, Popconfirm, Typography, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Skill } from "../../../services/skillService";

const { Text } = Typography;

interface SkillListProps {
  skills: Skill[];
  loading: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

const SkillList: React.FC<SkillListProps> = ({ skills, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Node",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Skill) => (
        <Space size="middle">
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: 'rgba(255, 255, 255, 0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: record.color_code,
              fontSize: '10px',
              fontWeight: 900,
              textTransform: 'uppercase' as const
            }}
          >
            {record.icon_name.substring(2, 4)}
          </div>
          <Text strong style={{ color: '#fff' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Order",
      dataIndex: "display_order",
      key: "display_order",
      render: (order: number) => <Tag color="blue" bordered={false} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '4px' }}>Order #{order}</Tag>,
    },
    {
        title: "Color",
        dataIndex: "color_code",
        key: "color_code",
        render: (color: string) => (
            <Space size="small">
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                <Text type="secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>{color}</Text>
            </Space>
        )
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Skill) => (
        <Space size="small">
          <Tooltip title="Modify Entity">
            <Button 
                type="text" 
                icon={<EditOutlined style={{ color: '#818cf8' }} />} 
                onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Purge Skill Node?"
            description="Are you sure you want to delete this entity?"
            onConfirm={() => onDelete(record.id)}
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
      columns={columns}
      dataSource={skills}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 8 }}
      style={{ 
        background: 'rgba(21, 21, 21, 0.8)', 
        borderRadius: '24px', 
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      className="admin-antd-table"
    />
  );
};

export default SkillList;
