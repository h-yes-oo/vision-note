import { atom, selector } from 'recoil';
import axios from 'axios';
import { NotesMode } from 'types';

export const authenticateToken = atom<string | null>({
  key: 'authenticateToken',
  default: JSON.parse(localStorage.getItem('user') ?? 'null'),
});

export const userInfo = selector({
  key: 'UserInfo',
  get: async ({ get }) => {
    const token = get(authenticateToken);
    if (token === null) return '비회원';
    const response = await axios.get('/v1/user', {
      headers: { Authorization: `Bearer ${get(authenticateToken)}` },
    });
    return response.data;
  },
});

export const userName = selector({
  key: 'UserName',
  get: ({ get }) => {
    return get(userInfo).nickname ?? '비회원';
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
