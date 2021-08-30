import { FC } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

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
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 0 13px 0 0;

  user-select: none !important;
`;

const ToSignUp = styled.a`
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
  toSignUp: any;
}

const Find: FC<Props & RouteComponentProps> = ({ toSignUp, history }) => {
  const goTo = () => history.push('/folder');

  return (
    <>
      <Title>비밀번호 찾기</Title>
      <Form placeholder="이메일 주소" type="email" />
      <FindBtn onClick={goTo}>비밀번호 찾기</FindBtn>
      <Flex>
        <NotYet>아직 회원이 아니신가요?</NotYet>
        <ToSignUp onClick={toSignUp}>회원가입하기</ToSignUp>
      </Flex>
    </>
  );
};

export default withRouter(Find);
