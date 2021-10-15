import { FC, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';

import { authenticateToken } from 'state';

import Kakao from 'assets/icons/Kakao.svg';
import Facebook from 'assets/icons/Facebook.svg';
import Google from 'assets/icons/Google.svg';
import Naver from 'assets/icons/Naver@3x.png';
import SelectToggle from 'assets/icons/SelectToggle.svg';
import CheckBoxOff from 'assets/icons/CheckBoxOff.svg';
import CheckBoxOn from 'assets/icons/CheckBoxOn.svg';
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

const HalfForm = styled(Form)`
  width: 200rem;
`;

const SelectForm = styled.select`
  width: 200rem;
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

  background-image: url(${SelectToggle});
  background-repeat: no-repeat;
  background-position: right 10rem center;

  appearance: none;
`;

const SignupButton = styled.button`
  width: 420rem;
  height: 61rem;
  margin: 19rem 0 21rem;
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

const Flex = styled.div`
  display: flex;
`;

const FlexBetween = styled(Flex)`
  justify-content: space-between;
`;

const FlexAlign = styled(Flex)`
  align-items: center;
`;

const OrWrapper = styled(FlexBetween)`
  align-items: center;
  width: 420rem;
  margin: 31rem 0 29rem;
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

const SocialWrapper = styled(FlexBetween)`
  align-items: center;
  width: 420rem;
  margin: 0 0 20rem;
`;

const SocialBox = styled(FlexAlign)`
  width: 200rem;
  height: 61rem;
  box-sizing: border-box;
  padding: 0 0 0 20rem;
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
`;

const ToLogin = styled.a`
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

const CheckBox = styled.input`
  height: 20rem;
  width: 20rem;
  border: none;
  appearance: none;
  background: url(${CheckBoxOff}) no-repeat;
  background-size: contain;

  &:checked {
    background: url(${CheckBoxOn}) no-repeat;
    background-size: contain;
  }
`;

const CheckText = styled.span`
  font-family: Pretendard;
  font-size: 14rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: -0.35rem;
  text-align: left;
  color: #73768d;
`;

const CheckAnchor = styled.a`
  font-family: Pretendard;
  font-size: 14rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: -0.35rem;
  text-align: left;
  color: #7b68ee;
  margin-left: 8rem;
  &:hover {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

interface Props {
  toLogin: any;
}

const SignUp: FC<Props> = ({ toLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [type, setType] = useState<string>('2');
  const [nickname, setNickname] = useState<string>('');
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<boolean>(false);
  const setAuthToken = useSetRecoilState(authenticateToken);
  const [loading, setLoading] = useState<boolean>(false);

  const authenticate = async () => {
    const frm = new FormData();
    frm.append('email', email);
    frm.append('password', password);
    try {
      const response = await axios.post('/v1/authenticate', frm);
      localStorage.setItem('user', JSON.stringify(response.data.token));
      setAuthToken(response.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  const signUp = async () => {
    const userData = new FormData();
    userData.append('avatar', '0');
    userData.append('email', email);
    userData.append('nickname', nickname);
    userData.append('password', password);
    userData.append('socialType', 'NORMAL');
    userData.append('typeId', type);
    try {
      await axios.post('/v1/user', userData);
      return true;
    } catch {
      alert('이미 가입된 메일입니다');
      setEmail('');
      setNickname('');
      setPassword('');
      setConfirm('');
      return false;
    }
  };

  const goTo = async () => {
    if (password !== confirm) alert('비밀번호가 같지 않습니다');
    else if (type === '') alert('학생 구분을 선택해주세요');
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/.test(
        password
      )
    )
      alert(
        '영문 대소문자와 특수문자가 결합된 8자 이상 20자 이하의 비밀번호여야 합니다'
      );
    else if (!privacy) alert('개인정보 처리방침에 동의해주세요');
    else if (!agreement) alert('이용약관에 동의해주세요');
    else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email))
      alert('이메일 형식을 확인해주세요');
    else if (email === '' || nickname === '' || password === '')
      alert('필수 정보를 입력해주세요');
    else {
      setLoading(true);
      const signUpSuccess = await signUp();
      // 로그인 성공시 자동 로그인
      if (signUpSuccess) authenticate();
      else setLoading(false);
    }
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
  };
  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form
        placeholder="이메일 주소"
        type="email"
        value={email}
        onChange={onChangeEmail}
      />
      <Form
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={onChangePassword}
      />
      <Form
        placeholder="비밀번호 확인"
        type="password"
        value={confirm}
        onChange={onChangeConfirm}
      />
      <FlexBetween>
        <HalfForm
          placeholder="닉네임"
          type="text"
          value={nickname}
          onChange={onChangeNickname}
        />
        <SelectForm onChange={(e) => setType(e.target.value)}>
          <option value="default" disabled style={{ color: '#c5c5c5' }}>
            학생 구분
          </option>
          <option value="2">대학생</option>
          <option value="1">초/중/고</option>
        </SelectForm>
      </FlexBetween>

      {loading ? (
        <LoadingDots small={false} />
      ) : (
        <SignupButton onClick={goTo}>가입하기</SignupButton>
      )}
      <FlexAlign>
        <CheckBox
          type="checkbox"
          checked={privacy}
          onChange={() => setPrivacy(!privacy)}
        />
        <CheckAnchor>개인정보 처리방침</CheckAnchor>
        <CheckText>에 동의합니다.</CheckText>
      </FlexAlign>
      <FlexAlign>
        <CheckBox
          type="checkbox"
          checked={agreement}
          onChange={() => setAgreement(!agreement)}
        />
        <CheckAnchor>서비스 이용약관</CheckAnchor>
        <CheckText>에 동의합니다.</CheckText>
      </FlexAlign>
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
    </Wrapper>
  );
};

export default SignUp;
