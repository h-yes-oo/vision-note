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
  font-size: 34px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.76;
  letter-spacing: normal;
  text-align: left;
  color: #000;
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

const HalfForm = styled(Form)`
  width: 200px;
`;

const SelectForm = styled.select`
  width: 200px;
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

  background-image: url(${SelectToggle});
  background-repeat: no-repeat;
  background-position: right 10px center;

  appearance: none;
`;

const SignupButton = styled.button`
  width: 420px;
  height: 61px;
  margin: 19px 0 21px;
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
  width: 420px;
  margin: 31px 0 29px;
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

const SocialWrapper = styled(FlexBetween)`
  align-items: center;
  width: 420px;
  margin: 0 0 20px;
`;

const SocialBox = styled(FlexAlign)`
  width: 200px;
  height: 61px;
  box-sizing: border-box;
  padding: 0 0 0 20px;
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
  color: #656565;

  &:hover {
    cursor: pointer;
    background-color: #f6f8fa;
  }
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

const CheckBox = styled.input`
  height: 20px;
  width: 20px;
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
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: -0.35px;
  text-align: left;
  color: #73768d;
`;

const CheckAnchor = styled.a`
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: -0.35px;
  text-align: left;
  color: #7b68ee;
  margin-left: 8px;
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
  const [type, setType] = useState<string>('');
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
    userData.append('avatar', '');
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
