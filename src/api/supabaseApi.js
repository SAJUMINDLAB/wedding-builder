import { supabase } from './supabaseClient';

// 고유 ID 생성 (UUID v4 대신 8자리 짧은 고유 문자열 사용)
const generateShortId = () => Math.random().toString(36).substring(2, 10);

export const saveInvitation = async (invitationData) => {
  // 기존 ID가 있으면 업데이트, 없으면 새로 생성 (현재는 새로 만들기 기준)
  const id = invitationData.id || generateShortId();
  
  // rsvpList나 guestbookInfo.entries는 별도 테이블로 뺄 것이므로, 
  // 메인 데이터에서 초기화하거나 무시합니다.
  // Zustand 스토어의 함수들을 제거하기 위해 JSON 직렬화/역직렬화를 거칩니다.
  const dataToSave = JSON.parse(JSON.stringify(invitationData));
  if (dataToSave.rsvpList) delete dataToSave.rsvpList;
  if (dataToSave.guestbookInfo && dataToSave.guestbookInfo.entries) {
    dataToSave.guestbookInfo.entries = [];
  }

  const { error } = await supabase
    .from('invitations')
    .upsert({ 
      id, 
      data: dataToSave 
    });

  if (error) {
    console.error('Supabase Save Error:', error);
    throw new Error('청첩장 저장에 실패했습니다: ' + (error.message || JSON.stringify(error)));
  }

  return id;
};

export const getInvitation = async (id) => {
  // 1. 청첩장 기본 데이터 가져오기
  const { data: invData, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (invError || !invData) {
    console.error('Supabase Fetch Error:', invError);
    return null;
  }

  const fullData = { ...invData.data, id: invData.id, createdAt: invData.created_at };

  // 2. 방명록 가져오기
  const { data: guestbookData, error: gbError } = await supabase
    .from('guestbooks')
    .select('*')
    .eq('invitation_id', id)
    .order('created_at', { ascending: false });

  if (!gbError && guestbookData) {
    if (!fullData.guestbookInfo) fullData.guestbookInfo = {};
    // map DB format back to frontend format
    fullData.guestbookInfo.entries = guestbookData.map(g => ({
      id: g.id,
      name: g.name,
      content: g.content,
      date: g.date
    }));
  }

  // 3. RSVP 가져오기
  const { data: rsvpData, error: rsvpError } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', id)
    .order('submitted_at', { ascending: false });

  if (!rsvpError && rsvpData) {
    fullData.rsvpList = rsvpData.map(r => ({
      id: r.id,
      side: r.side,
      name: r.name,
      attend: r.attend,
      companions: r.companions,
      meal: r.meal,
      contact: r.contact,
      message: r.message,
      submittedAt: r.submitted_at
    }));
  }

  return fullData;
};

export const getAllInvitations = async () => {
  // 관리자 대시보드용
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return {};

  const result = {};
  for (const inv of data) {
    // 상세 정보를 전부 불러오지는 않고, 뼈대만 전달
    // (현재 AdminDashboard는 rsvp 개수 등을 보려 하므로, 실제로는 
    // 여기서 각 invitation의 rsvp를 다 불러오거나, AdminDashboard 로직 수정 필요)
    
    // 단순함을 위해 getInvitation 재활용
    const fullInv = await getInvitation(inv.id);
    if (fullInv) {
      result[inv.id] = fullInv;
    }
  }

  return result;
};

export const submitRsvp = async (id, rsvpData) => {
  const { error } = await supabase
    .from('rsvps')
    .insert([{
      invitation_id: id,
      side: rsvpData.side,
      name: rsvpData.name,
      attend: rsvpData.attend,
      companions: String(rsvpData.companions || 0),
      meal: rsvpData.meal,
      contact: rsvpData.contact,
      message: rsvpData.message
    }]);

  if (error) {
    console.error('RSVP Submit Error:', error);
    throw new Error('참석 의사 전달에 실패했습니다.');
  }
  return true;
};

export const submitGuestbook = async (id, entryData) => {
  const { data, error } = await supabase
    .from('guestbooks')
    .insert([{
      invitation_id: id,
      name: entryData.name,
      content: entryData.content,
      date: entryData.date
    }])
    .select()
    .single();

  if (error) {
    console.error('Guestbook Submit Error:', error);
    throw new Error('방명록 작성에 실패했습니다.');
  }

  return {
    id: data.id,
    name: data.name,
    content: data.content,
    date: data.date
  };
};
