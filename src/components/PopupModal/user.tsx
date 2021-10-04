import React, { FC, useState, useRef } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import axios from 'axios';

import { userInfo, authenticateToken } from 'state';
import LoadingDots from 'components/LoadingDots';
import Alert from 'components/Alert';
import AlertWithMessage from 'components/Alert/message';

import Edit from 'assets/icons/Edit.svg';
import EditPurple from 'assets/icons/EditPurple.svg';
import EditType from 'assets/icons/EditType.svg';
import EditTypeUp from 'assets/icons/EditTypeUp.svg';
import UserEdit from 'assets/icons/UserEdit.svg';
import SampleProfile from 'assets/images/SampleProfile.svg';
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

  const logout = () => {
    localStorage.removeItem('user');
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
      alert('탈퇴에 실패했습니다. 다시 시도해주세요');
    }
  };

  const cancleSignOut = () => {
    setShowSignOutAlert(false);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAvatar(e.target.value);

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
    frm.append('password', 'coco1003!');
    try {
      const response = await axios.post('/v1/authenticate', frm);
      localStorage.setItem('user', JSON.stringify(response.data.token));
      setAuthToken(response.data.token);
    } catch (e) {
      history.push('/');
    }
  };

  const closeModal = () => {
    setEditNickname(false);
    setEditType(false);
    onClose();
  };

  const saveChanges = async () => {
    setEditNickname(false);
    setEditType(false);
    setLoading(true);
    const userData = new FormData();
    if (avatar !== user.avatar) userData.append('avatar', avatar);
    if (nickname !== user.nickname) userData.append('nickname', nickname);
    if (newPassword !== '') userData.append('password', newPassword);
    if (type !== user.type) userData.append('typeId', String(type));

    try {
      await axios.put('/v1/user', userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await authenticate();
      onClose();
    } catch {
      alert('회원정보를 변경하지 못했습니다');
      setNickname(user.nickname);
      setType(user.type);
      setAvatar(user.avatar);
    }
    setLoading(false);
  };

  const cancleNewPassword = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordAlert(false);
  };

  const confirmNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setNewPassword('');
      setConfirmPassword('');
      alert('비밀번호를 다시 확인해주세요');
    } else setShowPasswordAlert(false);
  };

  const ModalInner = (
    <>
      <Top>
        <div style={{ position: 'relative' }}>
          <ProfileImage src={SampleProfile} />
          <ChangeProfile onClick={onClickChangeProfile}>
            <UploadButton
              ref={fileRef}
              type="file"
              accept=".jpg, .png"
              onChange={onAvatarChange}
            />
          </ChangeProfile>
        </div>
        <Wrapper>
          <FlexCenter>
            <Title>이메일</Title>
            <Content disabled type="email" placeholder={user.email ?? ''} />
          </FlexCenter>
          <FlexCenter>
            <Title>닉네임</Title>
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
            <Title>학생 구분</Title>
            <Relative>
              <TypeContent>{type === 1 ? '초/중/고' : '대학생'}</TypeContent>
              <Menu show={editType}>
                <TypeOption onClick={() => onClickOption(1)}>
                  <UserIcon src={UserEdit} />
                  초/중/고
                </TypeOption>
                <TypeOption onClick={() => onClickOption(2)}>
                  <UserIcon src={UserEdit} />
                  대학생
                </TypeOption>
              </Menu>
            </Relative>
            <EditButton
              src={editType ? EditTypeUp : EditType}
              onClick={() => setEditType(!editType)}
            />
          </FlexCenter>
          <FlexCenter>
            <Title>비밀번호 변경</Title>
            <Content disabled type="password" placeholder="**********" />
            <EditButton
              src={showPasswordAlert ? EditPurple : Edit}
              onClick={() => setShowPasswordAlert(!showPasswordAlert)}
            />
          </FlexCenter>
          <FlexCenter>
            <Title>저장용량</Title>
            <FlexColumn>
              <StatusBar>
                <CurrentStatus current={user.storage ?? 0 / 15} />
              </StatusBar>
              <StorageInfo>{`15GB 중 ${user.storage ?? 0}GB 사용`}</StorageInfo>
            </FlexColumn>
          </FlexCenter>
        </Wrapper>
      </Top>
      <Bottom>
        <SignOut onClick={() => setShowSignOutAlert(true)}>회원 탈퇴</SignOut>
        <Flex>
          <WhiteButton onClick={closeModal}>나가기</WhiteButton>
          {loading ? (
            <LoadingDots small />
          ) : (
            <PurpleButton onClick={saveChanges}>저장하기</PurpleButton>
          )}
        </Flex>
      </Bottom>
    </>
  );

  return (
    <>
      <AlertWithMessage
        cancle={cancleSignOut}
        confirm={confirmSignOut}
        visible={showSignOutAlert}
        message={`탈퇴하시면 그동안 작성하신 학습 노트가 모두 사라집니다.\n 탈퇴하시겠습니까?`}
      />
      <Alert
        cancle={cancleNewPassword}
        confirm={confirmNewPassword}
        visible={showPasswordAlert}
      >
        <>
          <Form
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Form
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      </Alert>
      <PopupModal onClose={onClose} visible={visible}>
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
  color: #000;
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
  color: #656565;
  border: none;
  border-bottom: solid 1rem #e6e6e6;
  outline: none;
  background: white;
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
  color: #656565;
  border: none;
`;

const TypeOption = styled(TypeContent)`
  display: flex;
  align-items: center;
  background: white;
  padding-left: 10rem;
  box-sizing: border-box;
  height: 40rem;
  z-index: 1001;
  &:hover {
    background: #f5f5f5;
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
  background-color: #fff;

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
  border: solid 1rem #c5c5c5;
  color: #c5c5c5;
  background-color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #f6f8fa;
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
  background-color: #e6e6e6;
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
  color: #656565;
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

export default withRouter(UserModal);
