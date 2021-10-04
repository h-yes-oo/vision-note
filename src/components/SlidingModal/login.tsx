import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';

import Kakao from 'assets/icons/Kakao.svg';
import Facebook from 'assets/icons/Facebook.svg';
import Google from 'assets/icons/Google.svg';
import Naver from 'assets/icons/Naver@3x.png';
import { authenticateToken } from 'state';
import LoadingDots from 'components/LoadingDots';

const Title = styled.div`
  font-family: Pretendard;
  font-size: 34rem;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.76;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-top: 121rem;
`;

const Info = styled.div`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 9rem 0;
`;

const Form = styled.input`
  width: 420rem;
  height: 61rem;
  box-sizing: border-box;
  padding: 0 20rem;
  margin-top: 30rem;
  object-fit: contain;
  border-radius: 5rem;
  border: solid 1rem #e6e6e6;
  background-color: #fff;

  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  &::placeholder {
    color: #c5c5c5;
  }
`;

const Find = styled.a`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #656565;

  margin: 30rem 0 0;
  &:hover {
    cursor: pointer;
  }
`;

const LoginBtn = styled.button`
  width: 420rem;
  height: 61rem;
  margin: 19rem 0 31rem;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  border-radius: 5rem;
  border: none;
  background-color: #7b68ee;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const OrWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 420rem;
  margin: 0 0 29rem;
`;

const Line = styled.div`
  width: 176rem;
  height: 1rem;
  background-color: #e6e6e6;
`;

const OR = styled.div`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #c5c5c5;
  // margin: 0 18rem;
`;

const SocialWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 420rem;
  margin: 0 0 20rem;
`;

const SocialBox = styled.div`
  width: 200rem;
  height: 61rem;
  box-sizing: border-box;
  padding: 0 0 0 20rem;
  object-fit: contain;
  border-radius: 5rem;
  border: solid 1rem #e6e6e6;
  background-color: #fff;
  display: flex;
  align-items: center;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #656565;

  &:hover {
    cursor: pointer;
    background-color: #f6f8fa;
  }
`;

const SocialImage = styled.img`
  width: 30rem;
  margin: 0 10rem 0 0;
`;

const NotYet = styled.span`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 0 13rem 0 0;
  user-select: none !important;
`;

const SignUp = styled.a`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #7b68ee;
  &:hover {
    cursor: pointer;
  }
`;

const Flex = styled.div`
  display: flex;
`;
interface Props {
  toFind: any;
  toSignUp: any;
}

const Login: FC<Props> = ({ toFind, toSignUp }) => {
  const setAuthToken = useSetRecoilState(authenticateToken);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const authenticate = async () => {
    const frm = new FormData();
    frm.append('email', email);
    frm.append('password', password);
    try {
      setLoading(true);
      const response = await axios.post('/v1/authenticate', frm);
      localStorage.setItem('user', JSON.stringify(response.data.token));
      setAuthToken(response.data.token);
    } catch (e) {
      alert('아이디와 비밀번호를 다시 확인해주세요');
    }
    setLoading(false);
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') authenticate();
  };

  return (
    <>
      <Title>로그인</Title>
      <Info>학습 노트를 바로 만들고 관리해보세요</Info>
      <Form
        placeholder="이메일 주소"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form
        placeholder="비밀번호"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <Find onClick={toFind}>아이디 / 비밀번호 찾기</Find>
      {loading ? (
        <LoadingDots small={false} />
      ) : (
        <LoginBtn onClick={authenticate}>로그인</LoginBtn>
      )}
      <OrWrapper>
        <Line />
        <OR>또는</OR>
        <Line />
      </OrWrapper>
      <SocialWrapper>
        <SocialBox>
          <SocialImage src={Kakao} />
          카카오 로그인
        </SocialBox>
        <SocialBox>
          <SocialImage src={Naver} />
          네이버 로그인
        </SocialBox>
      </SocialWrapper>
      <SocialWrapper>
        <SocialBox>
          <SocialImage src={Facebook} />
          페이스북 로그인
        </SocialBox>
        <SocialBox>
          <SocialImage src={Google} />
          구글 로그인
        </SocialBox>
      </SocialWrapper>
      <Flex>
        <NotYet>아직 회원이 아니신가요?</NotYet>
        <SignUp onClick={toSignUp}>회원가입하기</SignUp>
      </Flex>
    </>
  );
};

export default Login;
