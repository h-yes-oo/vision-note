import { FC } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Kakao from 'assets/icons/Kakao.svg';
import Facebook from 'assets/icons/Facebook.svg';
import Google from 'assets/icons/Google.svg';
import Naver from 'assets/icons/Naver@3x.png';

const Title = styled.div`
  font-family: Pretendard;
  font-size: 34px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.76;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-top: 121px;
`;

const Form = styled.input`
  width: 420px;
  height: 61px;
  box-sizing: border-box;
  padding: 0 20px;
  margin-top: 30px;
  object-fit: contain;
  border-radius: 5px;
  border: solid 1px #e6e6e6;
  background-color: #fff;

  font-family: Pretendard;
  font-size: 18px;
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
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #656565;

  margin: 30px 0 0;
`;

const SignupButton = styled.button`
  width: 420px;
  height: 61px;
  margin: 19px 0 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  border-radius: 5px;
  border: none;
  background-color: #7b68ee;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const OrWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 420px;
  margin: 0 0 29px;
`;

const Line = styled.div`
  width: 176px;
  height: 1px;
  background-color: #e6e6e6;
`;

const OR = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #c5c5c5;
  // margin: 0 18px;
`;

const SocialWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 420px;
  margin: 0 0 20px;
`;

const SocialBox = styled.div`
  width: 200px;
  height: 61px;
  box-sizing: border-box;
  padding: 0 0 0 20px;
  object-fit: contain;
  border-radius: 5px;
  border: solid 1px #e6e6e6;
  background-color: #fff;
  display: flex;
  align-items: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const SocialImage = styled.img`
  width: 30px;
  margin: 0 10px 0 0;
`;

const NotYet = styled.span`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 0 13px 0 0;
`;

const ToLogin = styled.a`
  font-family: Pretendard;
  font-size: 16px;
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
  toLogin: any;
}

const SignUp: FC<Props & RouteComponentProps> = ({ toLogin, history }) => {
  const goTo = () => history.push('/folder');

  return (
    <>
      <Title>회원가입</Title>
      <Form placeholder="이메일 주소" type="email" />
      <Form placeholder="비밀번호" type="password" />
      <Form placeholder="비밀번호 확인" type="password" />
      <Form placeholder="닉네임" type="password" />
      <SignupButton onClick={goTo}>가입하기</SignupButton>
      <OrWrapper>
        <Line />
        <OR>또는</OR>
        <Line />
      </OrWrapper>
      <SocialWrapper>
        <SocialBox>
          <SocialImage src={Kakao} />
          카카오 회원가입
        </SocialBox>
        <SocialBox>
          <SocialImage src={Naver} />
          네이버 회원가입
        </SocialBox>
      </SocialWrapper>
      <SocialWrapper>
        <SocialBox>
          <SocialImage src={Facebook} />
          페이스북 회원가입
        </SocialBox>
        <SocialBox>
          <SocialImage src={Google} />
          구글 회원가입
        </SocialBox>
      </SocialWrapper>
      <Flex>
        <NotYet>이미 계정이 있으신가요?</NotYet>
        <ToLogin onClick={toLogin}>로그인 하기</ToLogin>
      </Flex>
    </>
  );
};

export default withRouter(SignUp);
