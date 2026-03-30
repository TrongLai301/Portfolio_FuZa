import React, { useState } from "react";
import { Row, Col, Space, Breadcrumb, Typography, Button } from "antd";
import { 
  CodeOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { useSkills } from "../../../hooks/useSkills";
import SkillList from "./SkillList";
import SkillForm from "./SkillForm";
import type { Skill, CreateSkillInput } from "../../../services/skillService";

const { Title } = Typography;

const SkillsManagerIndex: React.FC = () => {
  const { 
    skills, 
    loading, 
    submitting, 
    nextOrder, 
    addSkill, 
    editSkill, 
    removeSkill 
  } = useSkills();

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleFormSubmit = async (input: CreateSkillInput) => {
    if (editingSkill) {
      const success = await editSkill(editingSkill.id, input);
      if (success) setEditingSkill(null);
      return success;
    } else {
      return await addSkill(input);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* Breadcrumbs Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Space direction="vertical" size={0}>
            <Breadcrumb
              items={[
                { title: <><HomeOutlined /> Dashboard</>, href: '/admin' },
                { title: <><CodeOutlined /> Skills Manager</> },
              ]}
            />
            <Title level={4} style={{ color: '#fff', margin: '8px 0 0', fontWeight: 900, textTransform: 'uppercase' }}>
                Skill Manager
            </Title>
          </Space>
          
          {editingSkill && (
            <Button 
                size="small"
                onClick={() => setEditingSkill(null)}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
            >
                Back to Create
            </Button>
          )}
        </div>

        {/* Layout Grid */}
        <Row gutter={[40, 40]}>
          <Col xs={24} lg={15}>
            <SkillList 
                skills={skills} 
                loading={loading}
                onEdit={(skill) => setEditingSkill(skill)}
                onDelete={removeSkill}
            />
          </Col>

          <Col xs={24} lg={9}>
            <SkillForm 
                initialData={editingSkill} 
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingSkill(null)}
                submitting={submitting}
                defaultOrder={nextOrder}
            />
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default SkillsManagerIndex;
