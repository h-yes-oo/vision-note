import { FC, useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Modal from 'components/Modal';
import LoginModal from 'components/Modal/login';

import SampleLogo from 'assets/icons/SampleLogo@3x.png';
import MainImage1 from 'assets/images/MainImage1.svg';
import Illust1 from 'assets/images/Illust1@3x.png';
import Illust2 from 'assets/images/Illust2@3x.png';
import Illust3 from 'assets/images/Illust3@3x.png';
import ToggleDown from 'assets/icons/ToggleDown.svg';
import ToggleUp from 'assets/icons/ToggleUp.svg';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 1000px;
  height: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
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

const GetStarted = styled.button`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  width: 183px;
  height: 60px;
  margin: 59px 0 45px;
  background-color: #7b68ee;
  border: none;
  border-radius: 6px;
`;

const MainImage = styled.img`
  height: 400px;
`;

const BtnWrapper = styled.div``;

const SignupButton = styled.button`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  text-align: left;
  color: #676767;
  border: none;
  background-color: white;
`;

const LoginButton = styled.button`
  width: 129px;
  height: 50px;
  margin: 0 0 0 50px;
  padding: 16px 41px 13px;
  border: none;
  border-radius: 6px;
  object-fit: contain;
  background-color: #7b68ee;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
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

const FAQContent = styled.div`
  width: 1000px;
  height: 84px;
  margin-bottom: 20px;
  padding: 30px;
  display: flex;
  justfy-content: space-between;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
`;

const ToggleBtn = styled.img`
  width: 45px;
  height: 45px;
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
  height: 50px;
`;

interface Props {}

const MainPage: FC<Props & RouteComponentProps> = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    console.log('open modal');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const goToNotes = () => history.push('/notes');
  const goToFolder = () => history.push('/folder');

  return (
    <Root>
      <Header>
        <Logo src={SampleLogo} />
        <BtnWrapper>
          <SignupButton>회원가입</SignupButton>
          <LoginButton onClick={openModal}>로그인</LoginButton>
        </BtnWrapper>
      </Header>

      <LoginModal
        className="login-modal"
        visible={modalVisible}
        btnClosable
        maskClosable
        onClose={closeModal}
        goTo={goToFolder}
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
        <FAQContent>
          서비스 이용은 어떻게 하나요?
          <ToggleBtn src={ToggleDown} />
        </FAQContent>
        <FAQContent>
          서비스 이용은 어떻게 하나요?
          <ToggleBtn src={ToggleDown} />
        </FAQContent>
        <FAQContent>
          서비스 이용은 어떻게 하나요?
          <ToggleBtn src={ToggleDown} />
        </FAQContent>
        <FAQContent>
          서비스 이용은 어떻게 하나요?
          <ToggleBtn src={ToggleDown} />
        </FAQContent>
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

export default MainPage;
