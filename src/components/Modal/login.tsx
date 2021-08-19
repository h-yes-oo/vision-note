import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Kakao from 'assets/icons/Kakao.svg';
import Facebook from 'assets/icons/Facebook.svg';
import Google from 'assets/icons/Google.svg';
import Naver from 'assets/icons/Naver@3x.png';

const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => (props.visible ? '1000' : '-1')};
  ${(props) => (props.visible ? '' : 'transition: all 0.5s;')};
  overflow: auto;
  outline: 0;
`;

const ModalOverlay = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const Root = styled.div<{ visible: boolean }>`
  width: 500px;
  height: 1080px;
  padding: 40px 40px 230px;
  background-color: #fff;
  position: fixed;
  transition: all 0.5s;
  transform: translate3d(${(props) => (props.visible ? '0' : '100%')}, 0, 0);
  right: 0;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
`;

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
  margin-top: 145px;
`;

const Info = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 9px 0;
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

const LoginBtn = styled.button`
  width: 420px;
  height: 61px;
  margin: 19px 0 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  border-radius: 5px;
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

const SignUp = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #7b68ee;
`;

const Flex = styled.div`
  display: flex;
`;

interface ModalProps {
  className: string;
  onClose: any;
  maskClosable: boolean;
  btnClosable: boolean;
  visible: boolean;
  goTo: any;
}

const LoginModal: FC<ModalProps> = ({
  className,
  onClose,
  maskClosable,
  btnClosable,
  visible,
  goTo,
}) => {
  const onMaskClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  const dummyClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    console.log('happy !');
  };

  const close = (e: any) => {
    if (onClose) {
      onClose(e);
    }
  };

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper
        className={className}
        onClick={maskClosable ? onMaskClick : dummyClick}
        tabIndex={-1}
        visible={visible}
      >
        <Root visible={visible}>
          <Title>로그인</Title>
          <Info>학습 노트를 바로 만들고 관리해보세요</Info>
          <Form placeholder="이메일 주소" type="email" />
          <Form placeholder="비밀번호" type="password" />
          <Find>아이디 / 비밀번호 찾기</Find>
          <LoginBtn onClick={goTo}>로그인</LoginBtn>
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
            <SignUp>회원가입하기</SignUp>
          </Flex>
        </Root>
      </ModalWrapper>
    </>
  );
};

export default LoginModal;
