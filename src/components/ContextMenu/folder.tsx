import { FC } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import { authenticateToken } from 'state';
import ContextDelete from 'assets/icons/ContextDelete.svg';
import Edit from 'assets/icons/Edit.svg';

interface Props {
  visible: boolean;
  anchorPoint: { x: number; y: number };
  closeContextMenu: any;
  folderId: number;
  refreshNotes: () => void;
  editFolderName: any;
}

const ContextMenuFolder: FC<Props> = ({
  visible,
  anchorPoint,
  closeContextMenu,
  folderId,
  refreshNotes,
  editFolderName,
}) => {
  const authToken = useRecoilValue(authenticateToken);

  const deleteFolder = async () => {
    await axios.delete(`/v1/note/folder/${folderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    refreshNotes();
  };

  return (
    <Root visible={visible}>
      <PreventClick onClick={closeContextMenu} />
      <Menu top={anchorPoint.y} left={anchorPoint.x} onClick={closeContextMenu}>
        <MenuList onClick={editFolderName}>
          <ContextImage src={Edit} />
          폴더 이름 변경
        </MenuList>
        <MenuList onClick={deleteFolder}>
          <ContextImage src={ContextDelete} />
          폴더 삭제하기
        </MenuList>
      </Menu>
    </Root>
  );
};

const Root = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
`;

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

export default ContextMenuFolder;
