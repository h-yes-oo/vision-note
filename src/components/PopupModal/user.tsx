import React, { FC, useState, useRef } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import axios from 'axios';

import { userInfo, authenticateToken } from 'state';
import LoadingDots from 'components/LoadingDots';
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
  const [nickname, setNickname] = useState<string>(user.nickname);
  const [type, setType] = useState<number>(user.typeId);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  // loading status
  const [loading, setLoading] = useState<boolean>(false);
  // RefObjects
  const nicknameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  // Alert states
  const [showSignOutAlert, setShowSignOutAlert] = useState<boolean>(false);

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
    userData.append('avatar', avatar);
    userData.append('email', user.email);
    userData.append('nickname', nickname);
    userData.append('password', 'coco1003!');
    userData.append('socialType', user.socialType);
    userData.append('typeId', String(type));

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
            <Content disabled type="email" placeholder={user.email} />
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
            <EditButton src={Edit} />
          </FlexCenter>
          <FlexCenter>
            <Title>저장용량</Title>
            <FlexColumn>
              <StatusBar>
                <CurrentStatus current={user.storage / 15} />
              </StatusBar>
              <StorageInfo>{`15GB 중 ${user.storage}GB 사용`}</StorageInfo>
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
        message={`탈퇴하시면 그동안 작성하신 학습 노트가 모두 사라집니다.\n 계속하시겠습니까?`}
      />
      <PopupModal onClose={onClose} visible={visible}>
        {ModalInner}
      </PopupModal>
    </>
  );
};

const UserIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: 0 10px;
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
  padding: 99px 80px 0;
`;

const Top = styled(Flex)`
  align-items: flex-start;
  justify-content: space-between;
  padding: 80px 80px 0;
`;

const Wrapper = styled(FlexColumn)`
  justify-content: space-between;
  height: 430px;
`;

const Title = styled.div`
  width: 158px;
  object-fit: contain;
  font-family: Pretendard;
  font-size: 18px;
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
  width: 24px;
  height: 24px;
  &:hover {
    cursor: pointer;
  }
`;

const Content = styled.input`
  width: 440px;
  height: 33px;
  font-family: Pretendard;
  font-size: 24px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
  border: none;
  border-bottom: solid 1px #e6e6e6;
  outline: none;
  background: white;
`;

const TypeContent = styled.a`
  width: 440px;
  height: 33px;
  font-family: Pretendard;
  font-size: 24px;
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
  padding-left: 10px;
  box-sizing: border-box;
  height: 40px;
  z-index: 1001;
  &:hover {
    background: #f5f5f5;
  }
`;

const Relative = styled.div`
  position: relative;
  border-bottom: solid 1px #e6e6e6;
  min-width: 440px;
`;

const Menu = styled.div<{ show: boolean }>`
  border-radius: 5px;
  box-shadow: 3px 5px 16px 0 rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;
  background-color: #fff;

  height: auto;
  margin: 0;
  padding: 13px 0;

  position: absolute;
  left: 0;
  top: 30px;
  z-index: 1000;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
`;

const SignOut = styled.a`
  font-family: Pretendard;
  font-size: 18px;
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
  width: 140px;
  height: 50px;
  border-radius: 5px;
  font-family: Pretendard;
  font-size: 18px;
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
  border: solid 1px #c5c5c5;
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
  margin-left: 20px;
  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const ProfileImage = styled.img`
  width: 182px;
  height: 182px;
`;

const ChangeProfile = styled.a`
  background-image: url(${ProfileChange});
  width: 49px;
  height: 49px;
  position: absolute;
  right: 0;
  bottom: 0;
  &:hover {
    cursor: pointer;
  }
`;

const StatusBar = styled.div`
  width: 440px;
  height: 8px;
  border-radius: 5px;
  background-color: #e6e6e6;
  position: relative;
`;

const CurrentStatus = styled(StatusBar)<{ current: number }>`
  width: ${(props) => props.current * 440}px;
  position: absolute;
  left: 0;
  background-color: #7b68ee;
`;

const StorageInfo = styled.div`
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
  margin-top: 10px;
`;

const UploadButton = styled.input`
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0, 0, 0, 0);
`;

export default withRouter(UserModal);
