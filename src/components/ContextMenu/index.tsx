import { FC, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import AlertWithMessage from 'components/Alert/message';

import { authenticateToken } from 'state';
import ContextDelete from 'assets/icons/ContextDelete.svg';
import ContextDownload from 'assets/icons/ContextDownload.svg';
import ContextStar from 'assets/icons/ContextStar.svg';
import FilledStar from 'assets/icons/FilledStar.svg';

interface Props {
  visible: boolean;
  anchorPoint: { x: number; y: number };
  closeContextMenu: any;
  noteId: number;
  starred: boolean;
  afterDelete: () => void;
  afterStar: () => void;
}

const ContextMenu: FC<Props> = ({
  visible,
  anchorPoint,
  closeContextMenu,
  noteId,
  starred,
  afterDelete,
  afterStar,
}) => {
  const authToken = useRecoilValue(authenticateToken);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const downloadNote = () => {
    console.log(`${noteId} download`);
    // event.stopPropagation();
  };

  const starNote = async () => {
    const fileData = new FormData();
    fileData.append('fileId', String(noteId));
    fileData.append('isImportant', String(starred ? 0 : 1));
    await axios.put(`/v1/note/file/${noteId}`, fileData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    afterStar();
  };

  const deleteNote = async () => {
    // event.stopPropagation();
    await axios.delete(`/v1/note/file/${noteId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    afterDelete();
  };

  const onClickDeleteNote = () => {
    setShowAlert(true);
  };

  const onConfirmAlert = async () => {
    await deleteNote();
    setShowAlert(false);
  };

  const onCancelAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <AlertWithMessage
        message="선택한 노트를 삭제합니다. 계속할까요 ?"
        visible={showAlert}
        confirm={onConfirmAlert}
        cancel={onCancelAlert}
      />
      <Root visible={visible}>
        <PreventClick onClick={closeContextMenu} />
        <Menu
          top={anchorPoint.y}
          left={anchorPoint.x}
          onClick={closeContextMenu}
        >
          <MenuList onClick={downloadNote}>
            <ContextImage src={ContextDownload} />
            노트 다운로드
          </MenuList>
          <MenuList onClick={starNote}>
            <ContextImage src={starred ? FilledStar : ContextStar} />
            {starred ? '중요 노트 해제' : '중요 노트함'}
          </MenuList>
          <MenuList onClick={onClickDeleteNote}>
            <ContextImage src={ContextDelete} />
            노트 삭제하기
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

export default ContextMenu;
