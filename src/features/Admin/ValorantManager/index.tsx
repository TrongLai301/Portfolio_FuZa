import React from "react";
import { Row, Col, Space, Typography, Breadcrumb, Divider } from "antd";
import { HomeOutlined, RocketOutlined } from "@ant-design/icons";
import { useValorant } from "../../../hooks/useValorant";
import ValorantForm from "./ValorantForm";

const { Title, Text } = Typography;

const ValorantIndex: React.FC = () => {
    const { data, submitting, saveValorant } = useValorant();

    const handleFormSubmit = async (values: any) => {
        return await saveValorant(values);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                
                {/* Breadcrumbs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Space direction="vertical" size={0}>
                        <Breadcrumb
                            items={[
                                { title: <><HomeOutlined /> Dashboard</>, href: '/admin' },
                                { title: <><RocketOutlined /> Valorant Profile</> },
                            ]}
                        />
                        <Title level={4} style={{ color: '#fff', margin: '8px 0 0', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Valorant config
                        </Title>
                    </Space>
                </div>

                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '16px 0' }} />

                {/* Main Form */}
                <Row justify="center">
                    <Col span={24} lg={20}>
                        <ValorantForm 
                            initialData={data}
                            onSubmit={handleFormSubmit}
                            submitting={submitting}
                        />
                    </Col>
                </Row>

                <div className="mt-12 text-center">
                    <Text type="secondary" style={{ fontStyle: 'italic', opacity: 0.5 }}>
                        All changes will be reflected immediately on the public Portfolio profile section.
                    </Text>
                </div>
            </Space>
        </div>
    );
};

export default ValorantIndex;
