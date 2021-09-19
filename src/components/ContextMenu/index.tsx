import { FC } from 'react';
import styled from 'styled-components';

import ContextDelete from 'assets/icons/ContextDelete.svg';
import ContextDownload from 'assets/icons/ContextDownload.svg';
import ContextStar from 'assets/icons/ContextStar.svg';

interface Props {
  anchorPoint: { x: number; y: number };
  setShow: any;
  noteId: number;
}

const ContextMenu: FC<Props> = ({ anchorPoint, setShow, noteId }) => {
  const handleClick = () => setShow(false);

  const handleDownload = () => {
    console.log(`${noteId} download`);
    // event.stopPropagation();
  };

  const handleStar = () => {
    console.log(`${noteId} star`);
    // event.stopPropagation();
  };

  const handleDelete = () => {
    console.log(`${noteId} delete`);
    // event.stopPropagation();
  };

  return (
    <>
      <PreventClick onClick={handleClick} />
      <Menu top={anchorPoint.y} left={anchorPoint.x} onClick={handleClick}>
        <MenuList onClick={handleDownload}>
          <ContextImage src={ContextDownload} />
          노트 다운로드
        </MenuList>
        <MenuList onClick={handleStar}>
          <ContextImage src={ContextStar} />
          중요 노트함
        </MenuList>
        <MenuList onClick={handleDelete}>
          <ContextImage src={ContextDelete} />
          노트 삭제하기
        </MenuList>
      </Menu>
    </>
  );
};

const PreventClick = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
`;

const Menu = styled.div<{ top: number; left: number }>`
  width: 150px;
  border-radius: 5px;
  box-shadow: 3px 5px 16px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: 13px 0;

  height: auto;
  margin: 0;

  position: absolute;
  opacity: 1;
  transition: opacity 0.5s linear;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 100;
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

export default ContextMenu;
