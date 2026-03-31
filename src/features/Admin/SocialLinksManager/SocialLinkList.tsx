import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, GlobalOutlined } from "@ant-design/icons";
import type { SocialLink } from "../../../services/socialLinkService";

interface Props {
  links: SocialLink[];
  loading: boolean;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
}

const SocialLinkList: React.FC<Props> = ({ links, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Order",
      dataIndex: "display_order",
      key: "display_order",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SocialLink) => (
        <Space>
          <GlobalOutlined style={{ color: record.color_code || "#fff" }} />
          <span style={{ fontWeight: 600 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#ff4655" }}>
          {url}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Active" : "Hidden"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: any, record: SocialLink) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ color: "#1890ff" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this link?"
            onConfirm={() => onDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={links}
      loading={loading}
      rowKey="id"
      pagination={false}
      className="valorant-admin-table"
    />
  );
};

export default SocialLinkList;
