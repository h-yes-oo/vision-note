import { FC } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

import { sortMode, theme } from 'state';
import { SortMode } from 'types';

import CheckDark from 'assets/icons/CheckDark.svg';
import Check from 'assets/icons/Check.svg';
import { lightTheme } from 'styles/theme';

interface Props {
  show: boolean;
  closeMenu: () => void;
}

const SortMenu: FC<Props> = ({ show, closeMenu }) => {
  const [sortBy, setSortBy] = useRecoilState(sortMode);
  const currentTheme = useRecoilValue(theme);

  const changeSortMode = (mode: SortMode) => {
    setSortBy(mode);
    closeMenu();
  };

  return (
    <>
      <Menu show={show}>
        <MenuList onClick={() => changeSortMode(SortMode.Alphabetically)}>
          <ContextImage
            visible={sortBy === SortMode.Alphabetically}
            src={currentTheme === lightTheme ? Check : CheckDark}
          />
          이름 오름차순
        </MenuList>
        <MenuList
          onClick={() => changeSortMode(SortMode.ReverseAlphabetically)}
        >
          <ContextImage
            visible={sortBy === SortMode.ReverseAlphabetically}
            src={currentTheme === lightTheme ? Check : CheckDark}
          />
          이름 내림차순
        </MenuList>
        <MenuList onClick={() => changeSortMode(SortMode.Newest)}>
          <ContextImage
            visible={sortBy === SortMode.Newest}
            src={currentTheme === lightTheme ? Check : CheckDark}
          />
          최근 만든 순
        </MenuList>
        <MenuList onClick={() => changeSortMode(SortMode.Oldest)}>
          <ContextImage
            visible={sortBy === SortMode.Oldest}
            src={currentTheme === lightTheme ? Check : CheckDark}
          />
          가장 오래된 순
        </MenuList>
      </Menu>
    </>
  );
};

const Menu = styled.div<{ show: boolean }>`
  border-radius: 5rem;
  box-shadow: 3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12);
  background-color: ${(props) => props.theme.color.contextBackground};
  padding: 13rem 0;
  z-index: 2;

  height: auto;
  margin: 0;

  position: absolute;
  right: 0;
  top: 24rem;

  ${(props) => (props.show ? '' : 'display: none;')}
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 0.5s linear;
`;

const MenuList = styled.button`
  border: none;
  width: max-content;
  height: 38rem;
  padding: 0 19rem 0 0;
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

const ContextImage = styled.img<{ visible: boolean }>`
  width: 16rem;
  height: 16rem;
  margin: 0 10rem 0 20rem;
  opacity: ${(props) => (props.visible ? '1' : '0')};
`;

export default SortMenu;
