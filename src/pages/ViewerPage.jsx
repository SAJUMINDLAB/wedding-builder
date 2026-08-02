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
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#ffffff', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999', fontSize: '14px' }}>
        데이터를 불러오는 중입니다...
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

  useEffect(() => {
    // ViewerPage 에서는 body 스크롤을 허용하여 IntersectionObserver 모바일 버그 방지
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#e5e5e5', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.1)', minHeight: '100vh', overflow: 'hidden' }}>
        <InvitationPreview />
      </div>
    </div>
  );
};

export default ViewerPage;
