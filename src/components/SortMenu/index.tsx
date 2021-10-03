import { FC } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

import { sortMode } from 'state';
import { SortMode } from 'types';

import Edit from 'assets/icons/Edit.svg';
import Check from 'assets/icons/Check.svg';

interface Props {
  show: boolean;
  closeMenu: () => void;
}

const SortMenu: FC<Props> = ({ show, closeMenu }) => {
  const [sortBy, setSortBy] = useRecoilState(sortMode);

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
            src={Check}
          />
          이름 순
        </MenuList>
        <MenuList onClick={() => changeSortMode(SortMode.Newest)}>
          <ContextImage visible={sortBy === SortMode.Newest} src={Check} />
          최근 만든 순
        </MenuList>
        <MenuList onClick={() => changeSortMode(SortMode.Oldest)}>
          <ContextImage visible={sortBy === SortMode.Oldest} src={Check} />
          가장 오래된 순
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
  z-index: 2;

  height: auto;
  margin: 0;

  position: absolute;
  right: 0;
  top: 24px;

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

const ContextImage = styled.img<{ visible: boolean }>`
  width: 16px;
  height: 16px;
  margin: 0 10px 0 20px;
  opacity: ${(props) => (props.visible ? '1' : '0')};
`;

export default SortMenu;
