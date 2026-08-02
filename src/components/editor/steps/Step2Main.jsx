import React, { useRef } from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const Step2Main = () => {
  const mainInfo = useBuilderStore(state => state.mainInfo);
  const setMainInfo = useBuilderStore(state => state.setMainInfo);
  const fileInputRef = useRef(null);

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMainInfo('mainImage', url);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '1px solid #EBEBEB',
    borderRadius: '6px', fontSize: '0.95rem', marginBottom: '16px',
    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    backgroundColor: '#fff',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px'
  };

  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '6px' };
  const sectionTitleStyle = { fontSize: '1rem', fontWeight: 'bold', margin: '24px 0 16px 0', borderBottom: '2px solid #222', paddingBottom: '8px' };

  const getShapeStyle = (shape) => {
    switch(shape) {
      case 'full':
      case 'rectangle': return { borderRadius: '0' };
      case 'rounded': return { borderRadius: '12px' };
      case 'circle': return { borderRadius: '50%' };
      case 'arch': 
      default: 
        return { borderRadius: '40px 40px 0 0' };
    }
  };

  return (
    <div style={{ padding: '10px 0' }}>
      
      <div style={sectionTitleStyle}>메인 사진 (Cover Photo)</div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                width: '100px', height: '140px', backgroundColor: '#eee', 
                backgroundImage: mainInfo.mainImage ? `url(${mainInfo.mainImage})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'border-radius 0.3s ease',
                ...getShapeStyle(mainInfo.mainImageShape)
              }}
            >
              {!mainInfo.mainImage && <ImageIcon size={28} color="#ccc" />}
            </div>
            {mainInfo.mainImage && (
              <button 
                onClick={() => setMainInfo('mainImage', null)}
                style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '10px 20px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}
            >
              <Upload size={16} /> 사진 {mainInfo.mainImage ? '변경' : '업로드'}
            </button>
            <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>
              권장 사이즈: 1080 x 1920px (세로형)
            </div>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleMainImageUpload} />
        </div>

        {/* 형태(Shape) 선택 UI */}
        <div style={{ marginTop: '16px', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', color: '#555' }}>사진 프레임 형태</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { id: 'full', label: '풀샷 (꽉 차게)' },
              { id: 'arch', label: '아치형' },
              { id: 'rectangle', label: '사각형' },
              { id: 'rounded', label: '둥근 사각형' },
              { id: 'circle', label: '원형' }
            ].map(shape => (
              <label key={shape.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.85rem', color: '#333' }}>
                <input 
                  type="radio" 
                  name="mainImageShape" 
                  value={shape.id}
                  checked={mainInfo.mainImageShape === shape.id}
                  onChange={() => setMainInfo('mainImageShape', shape.id)}
                  style={{ accentColor: '#222' }}
                />
                {shape.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={sectionTitleStyle}>신랑 신부 정보</div>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>신랑 이름 (국문)</label>
          <input type="text" style={inputStyle} value={mainInfo.groomNameKo} onChange={(e) => setMainInfo('groomNameKo', e.target.value)} placeholder="이름만 (예: 철수)" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>신부 이름 (국문)</label>
          <input type="text" style={inputStyle} value={mainInfo.brideNameKo} onChange={(e) => setMainInfo('brideNameKo', e.target.value)} placeholder="이름만 (예: 영희)" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>신랑 이름 (영문)</label>
          <input type="text" style={inputStyle} value={mainInfo.groomNameEn} onChange={(e) => setMainInfo('groomNameEn', e.target.value)} placeholder="영문 (예: Chulsoo)" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>신부 이름 (영문)</label>
          <input type="text" style={inputStyle} value={mainInfo.brideNameEn} onChange={(e) => setMainInfo('brideNameEn', e.target.value)} placeholder="영문 (예: Younghee)" />
        </div>
      </div>

      <div style={sectionTitleStyle}>혼주 정보</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>신랑 아버지</label>
          <input type="text" style={inputStyle} value={mainInfo.groomFather} onChange={(e) => setMainInfo('groomFather', e.target.value)} placeholder="예: 아버님" />
        </div>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>신랑 어머니</label>
          <input type="text" style={inputStyle} value={mainInfo.groomMother} onChange={(e) => setMainInfo('groomMother', e.target.value)} placeholder="예: 어머님" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>관계</label>
          <input type="text" style={inputStyle} value={mainInfo.groomRelation} onChange={(e) => setMainInfo('groomRelation', e.target.value)} placeholder="예: 장남, 아들" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>신부 아버지</label>
          <input type="text" style={inputStyle} value={mainInfo.brideFather} onChange={(e) => setMainInfo('brideFather', e.target.value)} placeholder="예: 아버님" />
        </div>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>신부 어머니</label>
          <input type="text" style={inputStyle} value={mainInfo.brideMother} onChange={(e) => setMainInfo('brideMother', e.target.value)} placeholder="예: 어머님" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>관계</label>
          <input type="text" style={inputStyle} value={mainInfo.brideRelation} onChange={(e) => setMainInfo('brideRelation', e.target.value)} placeholder="예: 장녀, 딸" />
        </div>
      </div>

      <div style={sectionTitleStyle}>예식 일시 및 장소</div>
      <div>
        <label style={labelStyle}>예식 일자</label>
        <input 
          type="date" 
          style={inputStyle} 
          value={mainInfo.date} 
          onChange={(e) => setMainInfo('date', e.target.value)} 
        />
      </div>

      <div>
        <label style={labelStyle}>예식 시간</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={selectStyle} value={mainInfo.timeAmPm} onChange={(e) => setMainInfo('timeAmPm', e.target.value)}>
            <option value="AM">오전</option>
            <option value="PM">오후</option>
          </select>
          <select style={selectStyle} value={mainInfo.timeHour} onChange={(e) => setMainInfo('timeHour', e.target.value)}>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}시</option>
            ))}
          </select>
          <select style={selectStyle} value={mainInfo.timeMinute} onChange={(e) => setMainInfo('timeMinute', e.target.value)}>
            {['00', '10', '20', '30', '40', '50'].map(m => (
              <option key={m} value={m}>{m}분</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>예식 장소</label>
        <input 
          type="text" 
          style={inputStyle} 
          value={mainInfo.location} 
          onChange={(e) => setMainInfo('location', e.target.value)} 
          placeholder="예: OO 웨딩홀 1층, 층/홀 이름 정확히 입력해주세요"
        />
      </div>
    </div>
  );
};

export default Step2Main;
