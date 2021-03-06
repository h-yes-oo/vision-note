import { atom, selector } from 'recoil';
import axios from 'axios';
import { NotesMode, SortMode } from 'types';
import { lightTheme, darkTheme } from 'styles/theme';
import { DefaultTheme } from 'styled-components';

interface EditStatus {
  isEdited: boolean;
  newNickname?: string;
  newAvatar?: string;
}

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem('VisionNoteUser') ?? 'null');
  } catch {
    return null;
  }
};

export const authenticateToken = atom<string | null>({
  key: 'authenticateToken',
  default: getToken(),
});

export const editStatus = atom<EditStatus>({
  key: 'editStatus',
  default: {
    isEdited: false,
  },
});

export const userInfo = selector({
  key: 'UserInfo',
  get: async ({ get }) => {
    const token = get(authenticateToken);
    const edited = get(editStatus);
    if (token === null) return null;
    try {
      const response = await axios.get('/v1/user', {
        headers: { Authorization: `Bearer ${get(authenticateToken)}` },
      });
      let user = response.data;
      if (edited.isEdited) {
        if (edited.newNickname) {
          user = { ...user, nickname: edited.newNickname };
        }
        if (edited.newAvatar) {
          user = { ...user, avatar: edited.newAvatar };
        }
      }
      return user;
    } catch {
      // 기존에 저장되어 있던 토큰이 변경되어 인증이 불가한 경우
      localStorage.removeItem('VisionNoteUser');
      return null;
    }
  },
});

export const selectMode = atom<boolean>({
  key: 'selectMode',
  default: false,
});

export const selectedNotes = atom<number[]>({
  key: 'selected',
  default: [],
});

export const notesMode = atom<NotesMode>({
  key: 'notesMode',
  default: NotesMode.All,
});

export const dragRefresh = atom<() => void>({
  key: 'dragRefresh',
  default: () => () => console.log('no refresh function'),
});

export const status = atom<string>({
  key: 'status',
  default: '',
});

export const selectedRefresh = atom<(() => void)[]>({
  key: 'selectedRefresh',
  default: [],
});

export const sortMode = atom<SortMode>({
  key: 'sortMode',
  default: SortMode.Alphabetically,
});

export const getTheme = (): DefaultTheme => {
  const storedTheme = localStorage.getItem('VisionNoteTheme');

  if (storedTheme === '1') {
    return darkTheme;
  }
  // localStorage에 있는 값이 DARK가 아니라면, 모든 경우에도 LIGHT를 return 합니다.
  return lightTheme;
};

export const theme = atom<DefaultTheme>({
  key: 'theme',
  default: getTheme(),
});

interface AlertInfo {
  show: boolean;
  message?: string;
}

export const alertInfo = atom<AlertInfo>({
  key: 'alertInfo',
  default: {
    show: false,
  },
});
