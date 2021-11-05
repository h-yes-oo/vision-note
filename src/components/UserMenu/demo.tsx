import { FC } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

import DarkMode from 'assets/icons/DarkMode.svg';
import { theme } from 'state';
import { darkTheme, lightTheme } from 'styles/theme';

interface Props {
  show: boolean;
  setShow: any;
}

const UserMenuForDemo: FC<Props> = ({ show, setShow }) => {
  const [currentTheme, setTheme] = useRecoilState(theme);

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

  return (
    <>
      <Menu show={show}>
        <MenuList onClick={darkmode}>
          <ContextImage src={DarkMode} />
          {currentTheme === lightTheme ? '다크모드' : '다크모드 해제'}
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

export default UserMenuForDemo;
