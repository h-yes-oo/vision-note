import { FC, useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import * as T from 'types';
import { init, cancel, stopListening, startListening } from 'stt/demo';

interface Props {}

const SttDemoPage: FC<Props & RouteComponentProps> = ({ history }) => {
  return (
    <Root>
      <PurpleButton onClick={init}>Init</PurpleButton>
      <PurpleButton onClick={startListening}>startListening</PurpleButton>
      <PurpleButton onClick={stopListening}>stopListening</PurpleButton>
      <PurpleButton onClick={cancel}>cancel</PurpleButton>
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

export default SttDemoPage;
