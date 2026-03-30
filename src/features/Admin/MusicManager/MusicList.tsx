import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Space, Image, Typography, Slider } from "antd";
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  EditOutlined, 
  DeleteOutlined,
  CustomerServiceOutlined
} from "@ant-design/icons";
import type { Song } from "../../../services/musicService";

const { Text } = Typography;

interface MusicListProps {
  songs: Song[];
  loading: boolean;
  onEdit: (song: Song) => void;
  onDelete: (id: string, audioUrl: string, coverUrl: string) => void;
}

// Internal Mini Player Component for Table Cell
const MiniPlayer: React.FC<{ url: string; currentPlaying: string | null; setCurrentPlaying: (url: string | null) => void }> = ({ url, currentPlaying, setCurrentPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state with global playing track
  useEffect(() => {
    if (currentPlaying !== url) {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }
  }, [currentPlaying, url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(url);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onSeek = (val: number) => {
    if (audioRef.current) {
      const time = (val / 100) * duration;
      audioRef.current.currentTime = time;
      setProgress(val);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, padding: '4px 0' }}>
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata} 
        onEnded={() => { setIsPlaying(false); setCurrentPlaying(null); setProgress(0); }}
      />
      <Button 
        type="text" 
        icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: 24, color: '#6366f1' }} /> : <PlayCircleOutlined style={{ fontSize: 24, color: 'rgba(255,255,255,0.45)' }} />} 
        onClick={togglePlay}
        style={{ padding: 0, height: 'auto' }}
      />
      <div style={{ flex: 1 }}>
        <Slider 
          value={progress} 
          onChange={onSeek} 
          tooltip={{ open: false }}
          styles={{ 
            track: { background: '#6366f1' },
            handle: { background: '#fff', border: '2px solid #6366f1', boxShadow: 'none' },
            rail: { background: 'rgba(255, 255, 255, 0.05)' }
          }}
          disabled={!duration}
        />
      </div>
      <Text style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.25)', width: 30, textAlign: 'right' }}>
        {Math.floor(audioRef.current?.currentTime || 0)}s
      </Text>
    </div>
  );
};

const MusicList: React.FC<MusicListProps> = ({ songs, loading, onEdit, onDelete }) => {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const columns = [
    {
      title: "Banner",
      dataIndex: "cover_url",
      key: "cover_url",
      width: 80,
      render: (url: string) => (
        <div style={{ position: 'relative', width: 48, height: 48 }}>
            <Image 
                src={url} 
                width={48} 
                height={48} 
                className="rounded-xl object-cover border border-white/5 shadow-lg"
                loading="lazy"
                fallback="https://via.placeholder.com/48?text=MV"
            />
        </div>
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (_: any, record: Song) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#fff', fontSize: '13px' }}>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{record.artist}</Text>
        </Space>
      ),
    },
    {
      title: "Preview",
      key: "preview",
      render: (_: any, record: Song) => (
        <MiniPlayer 
            url={record.audio_url} 
            currentPlaying={currentPlaying} 
            setCurrentPlaying={setCurrentPlaying} 
        />
      ),
    },
    {
      title: "Order",
      dataIndex: "display_order",
      key: "display_order",
      width: 80,
      align: 'center' as const,
      render: (v: number) => <Text style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: 12 }}>#{v}</Text>
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: 'right' as const,
      render: (_: any, record: Song) => (
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
            onClick={() => onDelete(record.id, record.audio_url, record.cover_url)}
            className="hover:bg-red-500/10"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-table-container">
      <Table 
        dataSource={songs} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={false}
        className="admin-table"
        locale={{
            emptyText: (
                <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.2 }}>
                    <CustomerServiceOutlined style={{ fontSize: 40, marginBottom: 16 }} />
                    <p>No signal detected. Initialize music to start.</p>
                </div>
            )
        }}
      />
    </div>
  );
};

export default MusicList;
