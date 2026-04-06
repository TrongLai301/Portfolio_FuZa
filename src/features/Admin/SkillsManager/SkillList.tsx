import React from "react";
import { Table, Button, Space, Tag, Popconfirm, Typography, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import type { Skill } from "../../../services/skillService";
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

interface SkillListProps {
  skills: Skill[];
  loading: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  onReorder: (newSkills: Skill[]) => void;
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

const SkillList: React.FC<SkillListProps> = ({ skills, loading, onEdit, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = skills.findIndex((i) => i.id === active.id);
      const newIndex = skills.findIndex((i) => i.id === over?.id);
      onReorder(arrayMove(skills, oldIndex, newIndex));
    }
  };

  const columns = [
    {
      key: 'sort',
      width: 50,
      align: 'center' as const,
    },
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
      render: (order: number) => <Tag color="blue" bordered={false} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '4px' }}># {order}</Tag>,
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
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={skills.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Table
          columns={columns}
          dataSource={skills}
          loading={loading}
          rowKey="id"
          pagination={false}
          style={{ 
            background: 'rgba(21, 21, 21, 0.8)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
          components={{
            body: {
              row: DraggableRow,
            },
          }}
          className="admin-antd-table"
        />
      </SortableContext>
    </DndContext>
  );
};

export default SkillList;
