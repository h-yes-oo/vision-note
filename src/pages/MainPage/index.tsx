import { FC, useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import * as T from 'types';

import SlidingModal from 'components/SlidingModal';

import SampleLogo from 'assets/icons/SampleLogo15.png';
import MainImage1 from 'assets/images/MainImage1.svg';
import Illust1 from 'assets/images/Illust1@3x.png';
import Illust2 from 'assets/images/Illust2@3x.png';
import Illust3 from 'assets/images/Illust3@3x.png';

import FAQToggle from 'components/FAQToggle';

interface Props {}

const MainPage: FC<Props & RouteComponentProps> = ({ history }) => {
  const [modalType, setModalType] = useState<T.ModalType>(T.ModalType.No);

  const loginModal = () => {
    setModalType(T.ModalType.Login);
  };

  const signUpModal = () => {
    setModalType(T.ModalType.SignUp);
  };

  const closeModal = () => {
    setModalType(T.ModalType.No);
  };

  const goToNotes = () => history.push('/notes');

  const FAQContents = [
    {
      id: 1,
      title: '서비스 이용은 어떻게 하나요?',
      content: '로그인 후 이용하실 수 있습니다',
    },
    {
      id: 2,
      title: '서비스 이용은 어떻게 하나요?',
      content: '로그인 후 이용하실 수 있습니다',
    },
    {
      id: 3,
      title: '서비스 이용은 어떻게 하나요?',
      content: '로그인 후 이용하실 수 있습니다',
    },
    {
      id: 4,
      title: '서비스 이용은 어떻게 하나요?',
      content: '로그인 후 이용하실 수 있습니다',
    },
  ];

  return (
    <Root>
      <HeaderViewWidth>
        <Header>
          <Logo src={SampleLogo} />
          <BtnWrapper>
            <SignupButton onClick={signUpModal}>회원가입</SignupButton>
            <LoginButton onClick={loginModal}>로그인</LoginButton>
          </BtnWrapper>
        </Header>
      </HeaderViewWidth>
      <SlidingModal
        visible={modalType !== T.ModalType.No}
        onClose={closeModal}
        type={modalType}
      />
      <ViewHeight>
        <TopDiv>
          <Info>
            <BigText>보는 노트로 {'\n'}꿈에 더 가까이 </BigText>
            <SmallText>
              비전노트는 모두를 위한 자동 강의록 서비스입니다
            </SmallText>
            <GetStarted onClick={goToNotes}>Get Started</GetStarted>
          </Info>
          <MainImage src={MainImage1} />
        </TopDiv>
      </ViewHeight>
      <About>
        <AboutText>청각장애 학생을 위한 강의 학습 보조 도구</AboutText>
        <Feature>
          <Advantage>
            <Title>자동 자막 생성</Title>
            <Description>
              문장 단위로 인식하여 한 문장씩 쌓이게 됩니다.{'\n'}긴 pause를
              인식하여 문단 단위로 나누게 됩니다.{'\n'}하이라이팅은 글자 단위로,
              메모는 문단 단위로 작성이 가능합니다.
            </Description>
          </Advantage>
          <Illust src={Illust1} />
        </Feature>
        <Feature>
          <Illust src={Illust2} />
          <Advantage>
            <Title>강의록 다시보기</Title>
            <Description>
              문장 단위로 인식하여 한 문장씩 쌓이게 됩니다.{'\n'}긴 pause를
              인식하여 문단 단위로 나누게 됩니다.{'\n'}하이라이팅은 글자 단위로,
              메모는 문단 단위로 작성이 가능합니다.
            </Description>
          </Advantage>
        </Feature>
        <Feature>
          <Advantage>
            <Title>개인 노트필기</Title>
            <Description>
              문장 단위로 인식하여 한 문장씩 쌓이게 됩니다.{'\n'}긴 pause를
              인식하여 문단 단위로 나누게 됩니다.{'\n'}하이라이팅은 글자 단위로,
              메모는 문단 단위로 작성이 가능합니다.
            </Description>
          </Advantage>
          <Illust src={Illust3} />
        </Feature>
      </About>
      <FAQ>
        <FAQTitle>자주 묻는 질문</FAQTitle>
        {FAQContents.map((val, idx) => (
          <FAQToggle key={val.id} title={val.title} content={val.content} />
        ))}
      </FAQ>
      <Footer>
        <FooterLeft>
          <FooterTitle>Vision Note</FooterTitle>
          <FooterInfo>
            서울특별시 비전시 비전구 비전로 123번길 123 비전노트 빌딩 10층{'\n'}
            대표전화 02-1234-5678 | 이메일: visionnote@vision.com
          </FooterInfo>
          <Copyright>
            Copyright © 2021 Vision Note All Rights Reserved.
          </Copyright>
        </FooterLeft>
        <FooterRight>
          <FooterBtn>FAQ</FooterBtn>
          <FooterBtn>개인정보처리방침</FooterBtn>
          <FooterBtn>이용약관</FooterBtn>
        </FooterRight>
      </Footer>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    user-select: none !important;
  }
`;

const HeaderViewWidth = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  position: fixed;
  background-color: #fff;
`;

const Header = styled.div`
  width: 1000px;
  height: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const TopDiv = styled.div`
  width: 1000px;
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BigText = styled.div`
  font-family: Pretendard;
  font-size: 50px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  white-space: pre-wrap;
  margin-bottom: 18px;
`;

const SmallText = styled.div`
  width: 357px;
  height: 21px;
  object-fit: contain;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const MainImage = styled.img`
  height: 400px;
`;

const BtnWrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const PurpleButton = styled(Button)`
  background-color: #7b68ee;
  color: #fff;
  border-radius: 6px;

  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const GetStarted = styled(PurpleButton)`
  width: 183px;
  height: 60px;
  margin: 59px 0 45px;
`;

const LoginButton = styled(PurpleButton)`
  width: 129px;
  height: 50px;
  margin: 0 0 0 50px;
`;

const SignupButton = styled(Button)`
  color: #676767;
  background-color: white;

  &:hover {
    cursor: pointer;
    color: #6a58d3;
  }
`;

const ViewHeight = styled.div`
  height: 100vh;
  align-items: center;
  display: flex;
`;

const About = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
`;

const AboutText = styled.div`
  object-fit: contain;
  font-family: Pretendard;
  font-size: 40px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  margin: 82px 0 117px;
`;

const Feature = styled.div`
  margin-bottom: 120px;
  display: flex;
  width: 1000px;
  justify-content: space-between;
  align-items: center;
`;

const Illust = styled.img`
  height: 338px;
`;

const Advantage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 36px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const Description = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  white-space: pre-wrap;
`;

const FAQ = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f9fc;
  padding-bottom: 100px;
`;

const FAQTitle = styled.div`
  font-family: Pretendard;
  font-size: 40px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  margin: 82px 0 57px;
`;

const Footer = styled.div`
  width: 1000px;
  padding: 40px 0;
  display: flex;
  justify-content: space-between;
`;

const FooterTitle = styled.div`
  font-family: ProximaNova-Extrabld;
  font-size: 24px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const FooterInfo = styled.div`
  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #9c9c9c;
  white-space: pre-wrap;
`;

const Copyright = styled.div`
  font-family: Pretendard;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: left;
  color: #9c9c9c;
  margin-top: 21px;
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: flex-end;
`;

const FooterBtn = styled.a`
  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #9c9c9c;
  margin-left: 60px;
`;

const Logo = styled.img`
  height: 90px;
`;

export default MainPage;
