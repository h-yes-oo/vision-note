import { FC, useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import * as T from 'types';

import SlidingModal from 'components/SlidingModal';
import AlertTimeout from 'components/Alert/timeout';

import LogoLight from 'assets/icons/LogoLight.png';
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

  const goToDemo = () => {
    history.push('/userDemo');
  };

  const signUpModal = () => {
    setModalType(T.ModalType.SignUp);
  };

  const closeModal = () => {
    setModalType(T.ModalType.No);
  };

  const FAQContents = [
    {
      id: 1,
      title: '서비스 이용은 어떻게 하나요?',
      content:
        '비전 노트 서비스는 로그인 후 이용하실 수 있습니다. 음성 인식 엔진을 체험하시려면 visionnote.io/demo 페이지를 방문해주세요',
    },
    {
      id: 2,
      title: '음성 녹음은 어떻게 하나요?',
      content: `비전 노트의 음성 인식은 크게 두가지 방식으로 가능합니다.\n녹음이 완료된 wav 확장자 파일을 업로드하거나, 비전 노트에서 실시간으로 녹음할 수 있습니다.\n\n실시간 음성 녹음은 PC의 마이크를 통하여 녹음하거나, PC의 마이크를 거치지 않고 PC에서 송출되는 소리를 그대로 녹음할 수 있습니다.\n실시간 녹음 시에는 크롬 브라우저를 이용해주세요\n`,
    },
    {
      id: 3,
      title: '서비스 이용 요금은 어떻게 되나요?',
      content:
        '비전 노트는 모두를 위한 서비스로, 기본 기능은 무료로 제공됩니다.\n추가 기능 사용에는 요금이 청구될 수 있습니다.',
    },
  ];

  return (
    <Root>
      <AlertTimeout />
      <HeaderViewWidth>
        <Header>
          <Logo>
            <LogoImage src={LogoLight} />
          </Logo>
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
            <GetStarted onClick={goToDemo}>체험하기</GetStarted>
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
              강의 음성을 인식하여 강의록 형태로 보여줍니다.{'\n'}
              녹음이 완료된 파일을 올리거나, 실시간으로 녹음을 진행할 수
              있습니다.{'\n'}
              과목별 특화 엔진으로 높은 인식률을 제공합니다.
            </Description>
          </Advantage>
          <Illust src={Illust1} />
        </Feature>
        <Feature>
          <Illust src={Illust2} />
          <Advantage>
            <Title>강의록 다시보기</Title>
            <Description>
              저장된 강의록을 폴더별로 관리하고 다시 볼 수 있습니다.{'\n'}
              강의록의 내용을 수정하거나 메모를 덧붙일 수 있습니다.{'\n'}
              복습을 위한 간단한 퀴즈를 제공합니다.
            </Description>
          </Advantage>
        </Feature>
        <Feature>
          <Advantage>
            <Title>개인 노트필기</Title>
            <Description>
              중요한 부분에 하이라이팅을 하거나 필기 노트를 작성할 수 있습니다.
              {'\n'}
              하이라이팅은 글자 단위로, 메모는 문단 단위로 작성이 가능합니다.
              {'\n'}
              작성된 필기 노트는 언제든지 다시 보고 수정할 수 있습니다.
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
  width: 1000rem;
  height: 130rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const TopDiv = styled.div`
  width: 1000rem;
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
  font-size: 50rem;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  white-space: pre-wrap;
  margin-bottom: 18rem;
`;

const SmallText = styled.div`
  width: 357rem;
  height: 21rem;
  object-fit: contain;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const MainImage = styled.img`
  height: 400rem;
`;

const BtnWrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  font-family: Pretendard;
  font-size: 18rem;
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
  border-radius: 6rem;

  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const GetStarted = styled(PurpleButton)`
  width: 183rem;
  height: 60rem;
  margin: 59rem 0 45rem;
`;

const LoginButton = styled(PurpleButton)`
  width: 129rem;
  height: 50rem;
  margin: 0 0 0 50rem;
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
  width: 1000rem;
  display: flex;
  flex-direction: column;
`;

const AboutText = styled.div`
  object-fit: contain;
  font-family: Pretendard;
  font-size: 40rem;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  margin: 82rem 0 117rem;
`;

const Feature = styled.div`
  margin-bottom: 120rem;
  display: flex;
  width: 1000rem;
  justify-content: space-between;
  align-items: center;
`;

const Illust = styled.img`
  height: 338rem;
`;

const Advantage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 36rem;
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
  font-size: 18rem;
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
  padding-bottom: 100rem;
`;

const FAQTitle = styled.div`
  font-family: Pretendard;
  font-size: 40rem;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  margin: 82rem 0 57rem;
`;

const Footer = styled.div`
  width: 1000rem;
  padding: 40rem 0;
  display: flex;
  justify-content: space-between;
`;

const FooterTitle = styled.div`
  font-family: Pretendard;
  font-size: 24rem;
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
  font-size: 14rem;
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
  font-size: 12rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: left;
  color: #9c9c9c;
  margin-top: 21rem;
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
  font-size: 14rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #9c9c9c;
  margin-left: 60rem;
`;

const Logo = styled.div`
  width: 300rem;
  height: 80rem;
  margin: 0 -40rem;
  &:hover {
    cursor: pointer;
  }
  overflow: hidden;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default MainPage;
