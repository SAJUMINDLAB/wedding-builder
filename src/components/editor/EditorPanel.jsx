import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBuilderStore } from '../../store/useBuilderStore';
import StepItem from './StepItem';
import { Check, Zap } from 'lucide-react';
import QuickSetupModal from './QuickSetupModal';
import SaveCompleteModal from './SaveCompleteModal';
import { saveInvitation } from '../../api/supabaseApi';

const EditorPanel = () => {
  const steps = useBuilderStore(state => state.steps);
  const reorderSteps = useBuilderStore(state => state.reorderSteps);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  
  // Save States
  const [isSaving, setIsSaving] = useState(false);
  const [saveModalUrl, setSaveModalUrl] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId === 'droppable-steps') {
      reorderSteps(result.source.index, result.destination.index);
    } else if (result.source.droppableId === 'gallery-dnd') {
      useBuilderStore.getState().reorderGalleryImages(result.source.index, result.destination.index);
    }
  };

  const handleSaveAndComplete = async () => {
    setIsSaving(true);
    try {
      const fullState = useBuilderStore.getState();
      const newId = await saveInvitation(fullState);
      
      // 스토어에 ID를 저장하여 다음 번 저장 시 덮어쓰기가 되도록 합니다.
      useBuilderStore.setState({ id: newId });
      
      const url = `${window.location.origin}/v/${newId}`;
      setSaveModalUrl(url);
    } catch (err) {
      alert(err.message || '저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-section">
      <div className="editor-header" style={{ paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Wedding Invitation Editor</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>나만의 청첩장 꾸미기</p>
        </div>
      </div>

      <div style={{ padding: '16px 20px 24px 20px' }}>
        <button 
          onClick={() => setShowQuickSetup(true)}
          style={{ 
            width: '100%', padding: '16px', 
            backgroundColor: '#222', color: '#fff', 
            border: 'none', borderRadius: '10px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
            fontWeight: '600', fontSize: '1rem',
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; }}
        >
          <Zap size={18} fill="#fff" /> 필수 정보 한 번에 입력하기
        </button>
      </div>
      
      <div className="editor-content">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-steps" type="steps">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
              >
                {steps.map((step, index) => (
                  <StepItem key={step.id} step={step} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="editor-footer" style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb', backgroundColor: '#fff', position: 'sticky', bottom: 0, zIndex: 100 }}>
        <button 
          onClick={handleSaveAndComplete} 
          disabled={isSaving} 
          style={{ 
            width: '100%', padding: '16px', backgroundColor: '#222', color: '#fff', 
            border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)', transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => { if(!isSaving) e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { if(!isSaving) e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <Check size={20} />
          {isSaving ? '안전하게 저장 중입니다...' : '청첩장 완성 및 배포하기'}
        </button>
      </div>
      
      {showQuickSetup && <QuickSetupModal onClose={() => setShowQuickSetup(false)} />}
      {saveModalUrl && <SaveCompleteModal shareUrl={saveModalUrl} onClose={() => setSaveModalUrl(null)} />}
    </div>
  );
};

export default EditorPanel;
