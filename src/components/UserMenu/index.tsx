import { FC, useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import DarkMode from 'assets/icons/DarkMode.svg';
import Logout from 'assets/icons/Logout.svg';
import UserEdit from 'assets/icons/UserEdit.svg';

import { authenticateToken } from 'state';
import UserModal from 'components/PopupModal/user';

interface Props {
  show: boolean;
  setShow: any;
}

const UserMenu: FC<Props & RouteComponentProps> = ({
  show,
  setShow,
  history,
}) => {
  const [userModal, setUserModal] = useState<boolean>(false);
  const setAuthToken = useSetRecoilState(authenticateToken);

  const closeModal = () => {
    setUserModal(false);
  };

  const darkmode = () => {
    alert(
      '아직 지원하지 않는 기능입니다. 빠른 시일 내에 제공하고자 노력하겠습니다.'
    );
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthToken(null);
    history.push('/');
  };

  const userEdit = () => {
    setUserModal(true);
    setShow(false);
  };

  return (
    <>
      <UserModal onClose={closeModal} visible={userModal} />
      <Menu show={show}>
        <MenuList onClick={darkmode}>
          <ContextImage src={DarkMode} />
          다크모드
        </MenuList>
        <MenuList onClick={logout}>
          <ContextImage src={Logout} />
          로그아웃
        </MenuList>
        <MenuList onClick={userEdit}>
          <ContextImage src={UserEdit} />내 정보 수정
        </MenuList>
      </Menu>
    </>
  );
};

const Menu = styled.div<{ show: boolean }>`
  width: 150px;
  border-radius: 5px;
  box-shadow: 3px 5px 16px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: 13px 0;

  height: auto;
  margin: 0;

  position: absolute;
  right: 0;
  top: 54px;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
`;

const MenuList = styled.button`
  border: none;
  width: 150px;
  height: 38px;
  padding: 0px;
  background-color: #fff;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #000;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ContextImage = styled.img`
  width: 24px;
  height: 24px;
  margin: 0 10px 0 20px;
`;

export default withRouter(UserMenu);
