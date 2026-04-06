import React from "react";
import { Table, Button, Space, Tag, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined, GlobalOutlined, MenuOutlined } from "@ant-design/icons";
import type { SocialLink } from "../../../services/socialLinkService";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text } = Typography;

interface Props {
  links: SocialLink[];
  loading: boolean;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
  onReorder: (newLinks: SocialLink[]) => void;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const DraggableRow = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999, background: 'rgba(99, 102, 241, 0.1)' } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ cursor: 'grab', color: 'rgba(255,255,255,0.25)' }}
                {...listeners}
              />
            ),
          } as any);
        }
        return child;
      })}
    </tr>
  );
};

const SocialLinkList: React.FC<Props> = ({ links, loading, onEdit, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((i) => i.id === active.id);
      const newIndex = links.findIndex((i) => i.id === over?.id);
      onReorder(arrayMove(links, oldIndex, newIndex));
    }
  };

  const columns = [
    {
      key: 'sort',
      width: 50,
      align: 'center' as const,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SocialLink) => (
        <Space>
          <GlobalOutlined style={{ color: record.color_code || "#fff" }} />
          <Text strong style={{ color: '#fff' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Order",
      dataIndex: "display_order",
      key: "display_order",
      width: 80,
      render: (order: number) => (
        <Tag color="blue" bordered={false} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '4px' }}>
          # {order}
        </Tag>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", fontSize: '12px' }}>
          {url}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"} bordered={false} style={{ borderRadius: '4px' }}>
          {active ? "Active" : "Hidden"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: 'right' as const,
      render: (_: any, record: SocialLink) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "rgba(255,255,255,0.45)" }} />}
            onClick={() => onEdit(record)}
            className="hover:bg-white/5"
          />
          <Popconfirm
            title="Are you sure you want to delete this link?"
            onConfirm={() => onDelete(record.id!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger className="hover:bg-red-500/10" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={links.map((i) => i.id!)} strategy={verticalListSortingStrategy}>
        <Table
          columns={columns}
          dataSource={links}
          loading={loading}
          rowKey="id"
          pagination={false}
          className="admin-antd-table"
          components={{
            body: {
              row: DraggableRow,
            },
          }}
          style={{ 
            background: 'rgba(21, 21, 21, 0.8)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SocialLinkList;
