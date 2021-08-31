import { FC } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import LoginArrow from 'assets/icons/LoginArrow.svg';

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
  margin-top: 281px;
`;

const Info = styled(Title)`
  font-size: 18px;
  font-weight: normal;
  line-height: 1.22;
  margin-top: 9px;
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

const FindBtn = styled.button`
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
    background-color: #6a58d3;
  }
`;

const NotYet = styled.span`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 0 13px 0 0;

  user-select: none !important;
`;

const PurpleAnchor = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #7b68ee;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const FlexBetween = styled(Flex)`
  justify-content: space-between;
`;

const Arrow = styled.img`
  height: 18px;
`;

interface Props {
  toSignUp: any;
  toLogin: any;
}

const Find: FC<Props & RouteComponentProps> = ({
  toSignUp,
  toLogin,
  history,
}) => {
  const goTo = () => history.push('/folder');

  return (
    <>
      <Title>비밀번호 찾기</Title>
      <Info>가입하신 메일 주소로 임시 비밀번호를 보내드립니다.</Info>
      <Form placeholder="이메일 주소" type="email" />
      <FindBtn onClick={goTo}>비밀번호 찾기</FindBtn>
      <FlexBetween>
        <Flex>
          <NotYet>아직 회원이 아니신가요?</NotYet>
          <PurpleAnchor onClick={toSignUp}>회원가입하기</PurpleAnchor>
        </Flex>
        <Flex>
          <PurpleAnchor onClick={toLogin}>
            로그인 하기
            <Arrow src={LoginArrow} />
          </PurpleAnchor>
        </Flex>
      </FlexBetween>
    </>
  );
};

export default withRouter(Find);
