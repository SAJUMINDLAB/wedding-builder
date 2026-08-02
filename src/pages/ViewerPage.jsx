import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvitation } from '../api/supabaseApi';
import { useBuilderStore } from '../store/useBuilderStore';
import InvitationPreview from '../components/preview/InvitationPreview';

const ViewerPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvitation(id);
        if (data) {
          // 상태 덮어쓰기 (Zustand 스토어 업데이트)
          useBuilderStore.setState({ ...data, currentInvitationId: id });
          setLoading(false);
        } else {
          setError('해당 청첩장을 찾을 수 없습니다.');
          setLoading(false);
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA', color: '#666', zIndex: 99999 }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #888', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
        <div style={{ fontFamily: 'var(--font-kr-sans, sans-serif)', fontSize: '0.9rem', animation: 'pulseText 1.5s ease-in-out infinite', letterSpacing: '0.05em' }}>
          소중한 청첩장을 불러오는 중입니다
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', color: '#d32f2f', zIndex: 99999 }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', overflowY: 'auto', backgroundColor: '#e5e5e5', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.1)', minHeight: '100vh' }}>
        <InvitationPreview />
      </div>
    </div>
  );
};

export default ViewerPage;
