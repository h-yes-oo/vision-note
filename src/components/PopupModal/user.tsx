import React, { FC, useState } from 'react';
import styled from 'styled-components';

import Edit from 'assets/icons/Edit.svg';
import EditType from 'assets/icons/EditType.svg';
import SampleProfile from 'assets/images/SampleProfile.svg';
import ProfileChange from 'assets/icons/ProfileChange.svg';

interface Props {
  onClose: any;
  showAlert: any;
}

const UserModal: FC<Props> = ({ onClose, showAlert }) => {
  const user = {
    email: 'hyesoo5115@naver.com',
    nickname: '혜수',
    type: '대학생',
    storage: 6,
  };

  const [editNickname, setEditNickname] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user.nickname);

  const handleEditNickname = (e: React.MouseEvent) => {
    if (editNickname) {
      // TODO : 닉네임 수정하기
      console.log(nickname);
      setEditNickname(false);
    } else {
      setEditNickname(true);
    }
  };

  return (
    <>
      <Top>
        <div style={{ position: 'relative' }}>
          <ProfileImage src={SampleProfile} />
          <ChangeProfile />
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
            />
            <EditButton src={Edit} onClick={handleEditNickname} />
          </FlexCenter>
          <FlexCenter>
            <Title>학생 구분</Title>
            <Content disabled type="text" placeholder={user.type} />
            <EditButton src={EditType} />
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
        <SignOut onClick={showAlert}>회원 탈퇴</SignOut>
        <Flex>
          <WhiteButton onClick={onClose}>나가기</WhiteButton>
          <PurpleButton>저장하기</PurpleButton>
        </Flex>
      </Bottom>
    </>
  );
};

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

export default UserModal;
