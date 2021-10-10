import { FC, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import AlertWithMessage from 'components/Alert/message';

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
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const deleteFolder = async () => {
    await axios.delete(`/v1/note/folder/${folderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    refreshNotes();
  };

  const onClickDeleteFolder = () => {
    setShowAlert(true);
  };

  const onConfirmAlert = async () => {
    await deleteFolder();
    setShowAlert(false);
  };

  const onCancelAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <AlertWithMessage
        visible={showAlert}
        confirm={onConfirmAlert}
        cancel={onCancelAlert}
        message={`선택된 폴더에 속한 모든 폴더 및 노트가 삭제됩니다. \n삭제하시겠습니까?`}
      />
      <Root visible={visible}>
        <PreventClick onClick={closeContextMenu} />
        <Menu
          top={anchorPoint.y}
          left={anchorPoint.x}
          onClick={closeContextMenu}
        >
          <MenuList onClick={editFolderName}>
            <ContextImage src={Edit} />
            폴더 이름 변경
          </MenuList>
          <MenuList onClick={onClickDeleteFolder}>
            <ContextImage src={ContextDelete} />
            폴더 삭제하기
          </MenuList>
        </Menu>
      </Root>
    </>
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
  width: 150rem;
  border-radius: 5rem;
  box-shadow: 3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: 13rem 0;

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
  width: 150rem;
  height: 38rem;
  padding: 0rem;
  background-color: #fff;

  font-family: Pretendard;
  font-size: 14rem;
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
  width: 24rem;
  height: 24rem;
  margin: 0 10rem 0 20rem;
`;

export default ContextMenuFolder;
