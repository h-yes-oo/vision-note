import { FC, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';

import { authenticateToken, alertInfo } from 'state';

import Kakao from 'assets/icons/Kakao.svg';
import Facebook from 'assets/icons/Facebook.svg';
import Google from 'assets/icons/Google.svg';
import Naver from 'assets/icons/Naver@3x.png';
import CheckBoxOff from 'assets/icons/CheckBoxOff.svg';
import CheckBoxOn from 'assets/icons/CheckBoxOn.svg';
import LoadingDots from 'components/LoadingDots';
import UserEdit from 'assets/icons/UserEdit.svg';
import EditType from 'assets/icons/EditType.svg';
import EditTypeUp from 'assets/icons/EditTypeUp.svg';

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
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<boolean>(false);
  const [privacyError, setPrivacyError] = useState<boolean>(false);
  const [agreementError, setAgreementError] = useState<boolean>(false);
  const [typeError, setTypeError] = useState<boolean>(false);
  const [editType, setEditType] = useState<boolean>(false);
  const [emailAlert, setEmailAlert] = useState<string>('');
  const setAlert = useSetRecoilState(alertInfo);

  const authenticate = async () => {
    const frm = new FormData();
    frm.append('email', email);
    frm.append('password', password);
    try {
      const response = await axios.post('/v1/authenticate', frm);
      localStorage.setItem(
        'VisionNoteUser',
        JSON.stringify(response.data.token)
      );
      setAuthToken(response.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  const signUp = async () => {
    const userData = new FormData();
    userData.append('avatar', 'avatar.svg');
    userData.append('email', email);
    userData.append('nickname', nickname);
    userData.append('password', password);
    userData.append('socialType', 'NORMAL');
    userData.append('typeId', type);
    try {
      await axios.post('/v1/user', userData);
      return true;
    } catch (error: any) {
      if (error.response.status === 409) {
        setEmailError(true);
        setEmailAlert('?????? ????????? ???????????????');
      } else {
        setAlert({
          show: true,
          message: '??????????????? ??????????????????. \n?????? ??????????????????.',
        });
      }
      setEmail('');
      setNickname('');
      setPassword('');
      setConfirm('');
      return false;
    }
  };

  const testEmail = (email: string) => {
    return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
  };

  const testPassword = (password: string) => {
    // ?????? ?????? ?????? ?????? [ ??? ] ^ ` { | } \
    // ??????????????? ?????? ?????? $ @ $ ! % _ * ? & # " ' ( ) + , - . / : ; < = > @
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%_*?&~#"'()+,-./:;<=>@])[A-Za-z\d$@$!%*_?&~#"'()+,-./:;<=>@]{8,20}/.test(
      password
    );
  };

  const goTo = async () => {
    const emailCheck = email === '' || !testEmail(email);
    setEmailError(emailCheck);
    const passwordCheck = password === '' || !testPassword(password);
    setPasswordError(passwordCheck);
    const nicknameCheck = nickname === '';
    setNicknameError(nicknameCheck);
    const confirmCheck = password !== confirm;
    setConfirmError(confirmCheck);
    const typeCheck = type === '';
    setTypeError(typeCheck);
    setPrivacyError(!privacy);
    setAgreementError(!agreement);
    if (
      emailCheck ||
      passwordCheck ||
      nicknameCheck ||
      confirmCheck ||
      typeCheck ||
      !privacy ||
      !agreement
    ) {
      return false;
    }
    setLoading(true);
    const signUpSuccess = await signUp();
    // ????????? ????????? ?????? ?????????
    if (signUpSuccess) authenticate();
    else setLoading(false);
    return true;
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (testEmail(e.target.value)) {
      setEmailError(false);
      setEmailAlert('');
    } else {
      setEmailAlert('????????? ????????? ??????????????????');
    }
    if (e.target.value === '') setEmailAlert('????????? ????????? ??????????????????');
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (testPassword(e.target.value)) setPasswordError(false);
  };
  const onChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    if (e.target.value === password) setPasswordError(false);
  };
  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (e.target.value !== '') setNicknameError(false);
  };
  const onClickOption = (option: string) => {
    setType(option);
    setEditType(false);
    setTypeError(false);
  };

  const getTypeText = () => {
    if (type === '1') return '???/???/???';
    if (type === '2') return '?????????/?????????';
    return '?????? ??????';
  };

  const onChangePrivacy = () => {
    if (!privacy) setPrivacyError(false);
    setPrivacy((prev) => !prev);
  };

  const onChangeAgreement = () => {
    if (!agreement) setAgreementError(false);
    setAgreement((prev) => !prev);
  };

  const onSocialSignup = () => {
    setAlert({
      show: true,
      message:
        '?????? ???????????? ?????? ???????????????. \n?????? ?????? ?????? ??????????????? ?????????????????????',
    });
  };

  return (
    <Wrapper>
      <Title>????????????</Title>
      <Form
        error={emailError}
        placeholder="????????? ??????"
        type="email"
        value={email}
        onChange={onChangeEmail}
      />
      <Alert>{emailAlert}</Alert>
      <Form
        error={passwordError}
        placeholder="????????????"
        type="password"
        value={password}
        onChange={onChangePassword}
      />
      <Alert>
        {password !== '' &&
          !testPassword(password) &&
          '?????? ????????????, ??????, ??????????????? ???????????? 8~20?????? ??????????????????'}
      </Alert>
      <Form
        error={confirmError}
        placeholder="???????????? ??????"
        type="password"
        value={confirm}
        onChange={onChangeConfirm}
      />
      <Alert>{password !== confirm && '??????????????? ?????? ????????????'}</Alert>
      <FlexBetween>
        <HalfForm
          error={nicknameError}
          placeholder="?????????"
          type="text"
          value={nickname}
          onChange={onChangeNickname}
        />
        <Relative>
          <TypeContent error={typeError}>
            {getTypeText()}
            <ToggleImage
              onClick={() => setEditType((prev) => !prev)}
              src={editType ? EditTypeUp : EditType}
            />
          </TypeContent>
          <Menu show={editType}>
            <TypeOption onClick={() => onClickOption('1')}>
              <UserIcon src={UserEdit} />
              ???/???/???
            </TypeOption>
            <TypeOption onClick={() => onClickOption('2')}>
              <UserIcon src={UserEdit} />
              ?????????/?????????
            </TypeOption>
          </Menu>
        </Relative>
      </FlexBetween>

      {loading ? (
        <LoadingDots small={false} />
      ) : (
        <SignupButton onClick={goTo}>????????????</SignupButton>
      )}
      <FlexAlign>
        <CheckBox
          error={privacyError}
          type="checkbox"
          checked={privacy}
          onChange={onChangePrivacy}
        />
        <CheckAnchor>???????????? ????????????</CheckAnchor>
        <CheckText>??? ???????????????.</CheckText>
      </FlexAlign>
      <FlexAlign>
        <CheckBox
          error={agreementError}
          type="checkbox"
          checked={agreement}
          onChange={onChangeAgreement}
        />
        <CheckAnchor>????????? ????????????</CheckAnchor>
        <CheckText>??? ???????????????.</CheckText>
      </FlexAlign>
      <OrWrapper>
        <Line />
        <OR>??????</OR>
        <Line />
      </OrWrapper>
      <SocialWrapper>
        <SocialBox onClick={onSocialSignup}>
          <SocialImage src={Kakao} />
          ????????? ????????????
        </SocialBox>
        <SocialBox onClick={onSocialSignup}>
          <SocialImage src={Naver} />
          ????????? ????????????
        </SocialBox>
      </SocialWrapper>
      <SocialWrapper>
        <SocialBox onClick={onSocialSignup}>
          <SocialImage src={Facebook} />
          ???????????? ????????????
        </SocialBox>
        <SocialBox onClick={onSocialSignup}>
          <SocialImage src={Google} />
          ?????? ????????????
        </SocialBox>
      </SocialWrapper>
      <Flex>
        <NotYet>?????? ????????? ????????????????</NotYet>
        <ToLogin onClick={toLogin}>????????? ??????</ToLogin>
      </Flex>
    </Wrapper>
  );
};

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
  margin-bottom: 13rem;
`;

const shake = keyframes`
  0% { margin-left: 0rem; }
  25% { margin-left: 5rem; }
  75% { margin-left: -5rem; }
  100% { margin-left: 0rem; }
`;

const Form = styled.input<{ error: boolean }>`
  width: 420rem;
  height: 61rem;
  box-sizing: border-box;
  padding: 0 20rem;
  margin-top: 9rem;
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

  transition: box-shadow 0.5s;

  ${(props) =>
    props.error &&
    css`
      animation: ${shake} 0.2s ease-in-out 0s 2;
      box-shadow: 0 0 0.5em red;
    `}
`;

const HalfForm = styled(Form)`
  width: 200rem;
  margin-top: 9rem;
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

const CheckBox = styled.input<{ error: boolean }>`
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

  transition: box-shadow 0.5s;

  ${(props) =>
    props.error &&
    css`
      animation: ${shake} 0.2s ease-in-out 0s 2;
      box-shadow: 0 0 0.5em red;
    `}
`;

const UserIcon = styled.img`
  width: 24rem;
  height: 24rem;
  margin: 0 10rem;
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

const Alert = styled.div`
  margin-top: 4rem;
  height: 17rem;
  font-family: Pretendard;
  font-size: 14rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #ff2a2a;
`;

const TypeContent = styled.div<{ error: boolean }>`
  width: 200rem;
  height: 61rem;
  box-sizing: border-box;
  padding: 0 20rem;
  margin-top: 9rem;
  object-fit: contain;
  border-radius: 5rem;
  border: solid 1rem #e6e6e6;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;

  transition: box-shadow 0.5s;

  ${(props) =>
    props.error &&
    css`
      animation: ${shake} 0.2s ease-in-out 0s 2;
      box-shadow: 0 0 0.5em red;
    `}
`;

const TypeOption = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10rem;
  box-sizing: border-box;
  width: 200rem;
  height: 40rem;
  z-index: 1001;
  border: none;

  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  &:hover {
    background: #f6f6f6;
  }
`;

const Relative = styled.div`
  position: relative;
`;

const Menu = styled.div<{ show: boolean }>`
  border-radius: 5rem;
  box-shadow: 3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;
  background-color: #fff;

  height: auto;
  margin: 0;
  padding: 13rem 0;

  position: absolute;
  left: 0;
  top: 67rem;
  z-index: 1000;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
`;

const ToggleImage = styled.img`
  width: 24rem;
`;

export default SignUp;
