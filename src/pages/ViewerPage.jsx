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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', backgroundColor: '#f9f9f9', color: '#666' }}>
        청첩장을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', backgroundColor: '#f9f9f9', color: '#d32f2f' }}>
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
