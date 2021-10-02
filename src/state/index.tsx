import { atom, selector, useSetRecoilState } from 'recoil';
import axios from 'axios';
import { NotesMode } from 'types';

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  } catch {
    return null;
  }
};

export const authenticateToken = atom<string | null>({
  key: 'authenticateToken',
  default: getToken(),
});

export const userInfo = selector({
  key: 'UserInfo',
  get: async ({ get }) => {
    const token = get(authenticateToken);
    if (token === null) return null;
    try {
      const response = await axios.get('/v1/user', {
        headers: { Authorization: `Bearer ${get(authenticateToken)}` },
      });
      return response.data;
    } catch {
      // 기존에 저장되어 있던 토큰이 변경되어 인증이 불가한 경우
      localStorage.removeItem('user');
      return null;
    }
  },
});

export const userName = selector({
  key: 'UserName',
  get: ({ get }) => {
    const user = get(userInfo);
    return user ? user.nickname : '비회원';
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
