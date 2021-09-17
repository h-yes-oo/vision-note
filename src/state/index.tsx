import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import axios from 'axios';

export const authenticateToken = atom<string>({
  key: 'authenticateToken',
  default: '',
});

// export const getAuthenticateToken = selectorFamily({
//   key: "authenticate/post",
//   get: ({ email, password }) => async () => {
//     const frm = new FormData();
//     frm.append('email', email);
//     frm.append('password', password);
//     const response = await axios.post('/v1/authenticate', frm);
//     const { token } = response.data;
//     console.log(token);
//     return token;
//   },
//   set: ({set}, newValue)=> {
//     set(authenticateToken, newValue);
//   }
// });
