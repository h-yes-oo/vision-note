import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import DarkMode from 'assets/icons/DarkMode.svg';
import Logout from 'assets/icons/Logout.svg';
import UserEdit from 'assets/icons/UserEdit.svg';

import { authenticateToken, theme } from 'state';
import UserModal from 'components/PopupModal/user';
import { darkTheme, lightTheme } from 'styles/theme';

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
  const [currentTheme, setTheme] = useRecoilState(theme);

  const closeModal = useCallback(() => {
    setUserModal(false);
  }, []);

  const darkmode = () => {
    if (currentTheme === lightTheme) {
      localStorage.setItem('VisionNoteTheme', '1');
      setTheme(darkTheme);
    } else {
      localStorage.setItem('VisionNoteTheme', '0');
      setTheme(lightTheme);
    }
    setShow(false);
  };

  const logout = () => {
    localStorage.removeItem('VisionNoteUser');
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
          {currentTheme === lightTheme ? '다크모드' : '다크모드 해제'}
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
  width: 150rem;
  border-radius: 5rem;
  box-shadow: 3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12);
  background-color: ${(props) => props.theme.color.contextBackground};
  padding: 13rem 0;

  height: auto;
  margin: 0;

  position: absolute;
  right: 0;
  top: 54rem;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
  z-index: 10;
`;

const MenuList = styled.button`
  border: none;
  width: 150rem;
  height: 38rem;
  padding: 0rem;
  background-color: ${(props) => props.theme.color.contextBackground};

  font-family: Pretendard;
  font-size: 14rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.noteText};

  display: flex;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.color.hover};
  }
`;

const ContextImage = styled.img`
  width: 24rem;
  height: 24rem;
  margin: 0 10rem 0 20rem;
`;

export default withRouter(UserMenu);
