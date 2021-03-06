import React, { FC, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import axios from 'axios';

import {
  userInfo,
  authenticateToken,
  theme,
  editStatus,
  alertInfo,
} from 'state';
import LoadingDots from 'components/LoadingDots';
import Alert from 'components/Alert';
import AlertWithMessage from 'components/Alert/message';
import { lightTheme } from 'styles/theme';

import Edit from 'assets/icons/Edit.svg';
import EditPurple from 'assets/icons/EditPurple.svg';
import EditType from 'assets/icons/EditType.svg';
import EditTypeUp from 'assets/icons/EditTypeUp.svg';
import ToggleUpDark from 'assets/icons/ToggleUpDark.svg';
import ToggleDownDark from 'assets/icons/ToggleDownDark.svg';
import UserEdit from 'assets/icons/UserEdit.svg';
import ProfileChange from 'assets/icons/ProfileChange.svg';
import PopupModal from '.';

interface Props {
  visible: boolean;
  onClose: any;
}

const UserModal: FC<Props & RouteComponentProps> = ({
  visible,
  onClose,
  history,
}) => {
  // recoil states
  const user = useRecoilValue(userInfo);
  const [authToken, setAuthToken] = useRecoilState(authenticateToken);
  const setEditInfo = useSetRecoilState(editStatus);
  // editing status
  const [editNickname, setEditNickname] = useState<boolean>(false);
  const [editType, setEditType] = useState<boolean>(false);
  // edited values
  const [nickname, setNickname] = useState<string>(user?.nickname);
  const [type, setType] = useState<number>(user?.typeId);
  const [avatar, setAvatar] = useState<string>(user?.avatar);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // loading status
  const [loading, setLoading] = useState<boolean>(false);
  // RefObjects
  const nicknameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  // Alert states
  const [showSignOutAlert, setShowSignOutAlert] = useState<boolean>(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState<boolean>(false);
  const currentTheme = useRecoilValue(theme);
  const setAlert = useSetRecoilState(alertInfo);

  const logout = () => {
    localStorage.removeItem('VisionNoteUser');
    setAuthToken(null);
    history.push('/');
  };

  const confirmSignOut = async () => {
    try {
      await axios.delete('/v1/user', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setShowSignOutAlert(false);
      history.push('/');
      logout();
    } catch {
      setAlert({
        show: true,
        message: '????????? ??????????????????. \n?????? ??????????????????.',
      });
    }
  };

  const cancelSignOut = () => {
    setShowSignOutAlert(false);
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setAvatar(e.target.value);
    const profileFile: File | null = e.target.files ? e.target.files[0] : null;
    if (profileFile !== null) {
      const fileData = new FormData();
      fileData.append('profile', profileFile);
      try {
        const response = await axios.put(`/v1/user/avatar`, fileData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setAvatar(response.data.avatarName);
        setEditInfo({ isEdited: true, newAvatar: response.data.avatarName });
      } catch {
        setAlert({
          show: true,
          message: '?????? ????????? ???????????? ???????????????. \n?????? ??????????????????.',
        });
      }
    }
  };

  const onClickChangeProfile = () => {
    if (fileRef.current !== null) fileRef.current.click();
  };

  const handleEditNickname = () => {
    if (editNickname) {
      setEditNickname(false);
    } else {
      setEditNickname(true);
      if (nicknameRef.current !== null)
        setTimeout(() => nicknameRef.current!.focus(), 10);
    }
  };

  const onClickOption = (option: number) => {
    setType(option);
    setEditType(false);
  };

  const authenticate = async () => {
    const frm = new FormData();
    frm.append('email', user.email);
    frm.append('password', newPassword);
    try {
      const response = await axios.post('/v1/authenticate', frm);
      localStorage.setItem(
        'VisionNoteUser',
        JSON.stringify(response.data.token)
      );
      setAuthToken(response.data.token);
    } catch (e) {
      history.push('/');
    }
  };

  const closeModal = () => {
    setEditNickname(false);
    setEditType(false);
    onClose(false);
  };

  const saveChanges = async () => {
    setEditNickname(false);
    setEditType(false);
    setLoading(true);
    const userData = new FormData();
    if (nickname !== user.nickname) userData.append('nickname', nickname);
    if (newPassword !== '') userData.append('password', newPassword);
    if (type !== user.type) userData.append('typeId', String(type));
    try {
      await axios.put('/v1/user', userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (newPassword !== '') {
        await authenticate();
        setNewPassword('');
        setConfirmPassword('');
      }
      if (nickname !== user.nickname) {
        setEditInfo({ isEdited: true, newNickname: nickname });
      }
      onClose(true);
    } catch {
      setAlert({
        show: true,
        message: '?????? ????????? ???????????? ???????????????. \n?????? ??????????????????.',
      });
      setNickname(user.nickname);
      setType(user.type);
      setAvatar(user.avatar);
    }
    setLoading(false);
  };

  const cancelNewPassword = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordAlert(false);
  };

  const testPassword = (password: string) => {
    // ?????? ?????? ?????? ?????? [ ??? ] ^ ` { | } \
    // ??????????????? ?????? ?????? $ @ $ ! % _ * ? & # " ' ( ) + , - . / : ; < = > @
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%_*?&~#"'()+,-./:;<=>@])[A-Za-z\d$@$!%*_?&~#"'()+,-./:;<=>@]{8,20}/.test(
      password
    );
  };

  const confirmNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setNewPassword('');
      setConfirmPassword('');
      alert('??????????????? ?????? ??????????????????');
    } else if (!testPassword(newPassword)) {
      setNewPassword('');
      setConfirmPassword('');
      alert(
        '??????????????? ?????? ????????????, ??????, ??????????????? ???????????? 8-20?????? ??????????????????'
      );
    } else setShowPasswordAlert(false);
  };

  const getToggleSrc = () => {
    if (currentTheme === lightTheme) return editType ? EditTypeUp : EditType;
    return editType ? ToggleUpDark : ToggleDownDark;
  };

  const toggleSrc = useMemo(() => getToggleSrc(), [currentTheme, editType]);

  const getTypeName = (input: number) => {
    return input === 1 ? '???/???/???' : '?????????/?????????';
  };

  const getEmail = () => {
    return user ? user.email : '';
  };

  const userEmail = useMemo(() => getEmail(), [user]);

  const typeName = useMemo(() => getTypeName(type), [type]);

  const ModalInner = (
    <>
      <Top>
        <div style={{ position: 'relative' }}>
          <ProfileImage
            src={`https://visionnote-static.s3.ap-northeast-2.amazonaws.com/avatar/${avatar}`}
          />
          <ChangeProfile onClick={onClickChangeProfile}>
            <UploadButton
              ref={fileRef}
              type="file"
              accept=".jpg, .png, .svg"
              onChange={onAvatarChange}
            />
          </ChangeProfile>
        </div>
        <Wrapper>
          <FlexCenter>
            <Title>?????????</Title>
            <Content disabled type="email" placeholder={userEmail} />
          </FlexCenter>
          <FlexCenter>
            <Title>?????????</Title>
            <Content
              disabled={!editNickname}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              ref={nicknameRef}
            />
            <EditButton
              src={editNickname ? EditPurple : Edit}
              onClick={handleEditNickname}
            />
          </FlexCenter>
          <FlexCenter>
            <Title>?????? ??????</Title>
            <Relative>
              <TypeContent>{typeName}</TypeContent>
              <Menu show={editType}>
                <TypeOption onClick={() => onClickOption(1)}>
                  <UserIcon src={UserEdit} />
                  ???/???/???
                </TypeOption>
                <TypeOption onClick={() => onClickOption(2)}>
                  <UserIcon src={UserEdit} />
                  ?????????/?????????
                </TypeOption>
              </Menu>
            </Relative>
            <EditButton
              src={toggleSrc}
              onClick={() => setEditType(!editType)}
            />
          </FlexCenter>
          <FlexCenter>
            <Title>???????????? ??????</Title>
            <Content disabled type="password" placeholder="**********" />
            <EditButton
              src={showPasswordAlert ? EditPurple : Edit}
              onClick={() => setShowPasswordAlert(!showPasswordAlert)}
            />
          </FlexCenter>
          <FlexCenter>
            <Title>????????????</Title>
            <FlexColumn>
              <StatusBar>
                <CurrentStatus
                  current={user ? user.totalMemoryUsage / 1500 : 0}
                />
              </StatusBar>
              <StorageInfo>{`15GB ??? ${
                user ? (user.totalMemoryUsage / 100).toFixed(2) : 0
              }GB ??????`}</StorageInfo>
            </FlexColumn>
          </FlexCenter>
        </Wrapper>
      </Top>
      <Bottom>
        <SignOut onClick={() => setShowSignOutAlert(true)}>?????? ??????</SignOut>
        <Flex>
          <WhiteButton onClick={closeModal}>?????????</WhiteButton>
          {loading ? (
            <LoadingDots small />
          ) : (
            <PurpleButton onClick={saveChanges}>????????????</PurpleButton>
          )}
        </Flex>
      </Bottom>
    </>
  );

  return (
    <>
      <AlertWithMessage
        cancel={cancelSignOut}
        confirm={confirmSignOut}
        visible={showSignOutAlert}
        message={`??????????????? ????????? ???????????? ?????? ????????? ?????? ???????????????.\n ?????????????????????????`}
      />
      <Alert
        cancel={cancelNewPassword}
        confirm={confirmNewPassword}
        visible={showPasswordAlert}
      >
        <>
          <Form
            type="password"
            placeholder="??? ????????????"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Form
            type="password"
            placeholder="??? ???????????? ??????"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      </Alert>
      <PopupModal onClose={() => onClose(false)} visible={visible}>
        {ModalInner}
      </PopupModal>
    </>
  );
};

const Form = styled.input`
  height: 61rem;
  box-sizing: border-box;
  padding: 0 20rem;
  margin-bottom: 20rem;
  object-fit: contain;
  border-radius: 5rem;
  border: solid 1rem ${(props) => props.theme.color.lightBorder};
  background-color: ${(props) => props.theme.color.lightBackground};
  color: ${(props) => props.theme.color.primaryText};

  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;

  &::placeholder {
    color: ${(props) => props.theme.color.placeHolder};
  }
`;

const UserIcon = styled.img`
  width: 24rem;
  height: 24rem;
  margin: 0 10rem;
`;

const Flex = styled.div`
  display: flex;
`;

const FlexCenter = styled(Flex)`
  position: relative;
  align-items: center;
`;

const FlexColumn = styled(Flex)`
  flex-direction: column;
`;

const Bottom = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 99rem 80rem 0;
`;

const Top = styled(Flex)`
  align-items: flex-start;
  justify-content: space-between;
  padding: 80rem 80rem 0;
`;

const Wrapper = styled(FlexColumn)`
  justify-content: space-between;
  height: 430rem;
`;

const Title = styled.div`
  width: 158rem;
  object-fit: contain;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.secondaryText};
`;

const EditButton = styled.img`
  position: absolute;
  right: 0;
  width: 24rem;
  height: 24rem;
  &:hover {
    cursor: pointer;
  }
`;

const Content = styled.input`
  width: 440rem;
  height: 33rem;
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.tertiaryText};
  border: none;
  border-bottom: solid 1rem #e6e6e6;
  outline: none;
  background-color: ${(props) => props.theme.color.lightBackground};

  &:disabled {
    color: ${(props) => props.theme.color.tertiaryText};
  }
  &::placeholder {
    color: ${(props) => props.theme.color.tertiaryText};
  }
`;

const TypeContent = styled.a`
  width: 440rem;
  height: 33rem;
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.tertiaryText};
  border: none;
`;

const TypeOption = styled(TypeContent)`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.color.background};
  padding-left: 10rem;
  box-sizing: border-box;
  height: 40rem;
  z-index: 1001;
  &:hover {
    background: ${(props) => props.theme.color.hover};
  }
`;

const Relative = styled.div`
  position: relative;
  border-bottom: solid 1rem #e6e6e6;
  min-width: 440rem;
`;

const Menu = styled.div<{ show: boolean }>`
  border-radius: 5rem;
  box-shadow: 3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.color.background};

  height: auto;
  margin: 0;
  padding: 13rem 0;

  position: absolute;
  left: 0;
  top: 30rem;
  z-index: 1000;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
`;

const SignOut = styled.a`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #a2a2a2;
  &:hover {
    cursor: pointer;
  }
`;

const Button = styled.button`
  width: 140rem;
  height: 50rem;
  border-radius: 5rem;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WhiteButton = styled(Button)`
  border: solid 1rem ${(props) => props.theme.color.placeHolder};
  color: ${(props) => props.theme.color.placeHolder};
  background-color: ${(props) => props.theme.color.lightBackground};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.color.hover};
  }
`;

const PurpleButton = styled(Button)`
  border: none;
  color: #fff;
  background-color: #7b68ee;
  margin-left: 20rem;
  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const ProfileImage = styled.img`
  width: 182rem;
  height: 182rem;
`;

const ChangeProfile = styled.a`
  background-image: url(${ProfileChange});
  width: 49rem;
  height: 49rem;
  background-size: contain;
  position: absolute;
  right: 0;
  bottom: 0;
  &:hover {
    cursor: pointer;
  }
`;

const StatusBar = styled.div`
  width: 440rem;
  height: 8rem;
  border-radius: 5rem;
  background-color: ${(props) => props.theme.color.border};
  position: relative;
`;

const CurrentStatus = styled(StatusBar)<{ current: number }>`
  width: ${(props) => props.current * 440}rem;
  position: absolute;
  left: 0;
  background-color: #7b68ee;
`;

const StorageInfo = styled.div`
  font-family: Pretendard;
  font-size: 14rem;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.tertiaryText};
  margin-top: 10rem;
`;

const UploadButton = styled.input`
  overflow: hidden;
  position: absolute;
  width: 1rem;
  height: 1rem;
  margin: -1rem;
  padding: 0;
  border: 0;
  clip: rect(0, 0, 0, 0);
`;

export default withRouter(React.memo(UserModal));
