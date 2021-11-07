import { FC, useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';

import AlertWithMessage from 'components/Alert/message';
import ContextDownload from 'assets/icons/ContextDownload.svg';
import Edit from 'assets/icons/Edit.svg';
import ContextStar from 'assets/icons/ContextStar.svg';
import FilledStar from 'assets/icons/FilledStar.svg';
import ContextDelete from 'assets/icons/ContextDelete.svg';

import { authenticateToken, alertInfo } from 'state';

interface Props {
  show: boolean;
  closeMenu: () => void;
  starred: boolean;
  noteId: number;
  editNoteTitle: () => void;
  starNote: () => Promise<void>;
}

const NoteMenu: FC<Props & RouteComponentProps> = ({
  show,
  closeMenu,
  history,
  starred,
  noteId,
  editNoteTitle,
  starNote,
}) => {
  const authToken = useRecoilValue(authenticateToken);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const setAlert = useSetRecoilState(alertInfo);

  const download = () => {
    setAlert({
      show: true,
      message:
        '아직 지원하지 않는 기능입니다. \n빠른 시일 내에 지원하고자 노력하겠습니다',
    });
    closeMenu();
  };

  const onClickStarNote = async () => {
    await starNote();
    closeMenu();
  };

  const onClickEditTitle = () => {
    editNoteTitle();
    closeMenu();
  };

  const onClickDeleteNote = () => {
    setShowAlert(true);
    closeMenu();
  };

  const onConfirmAlert = async () => {
    await axios.delete(`/v1/note/file/${noteId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setShowAlert(false);
    history.push('/');
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
        message="현재 노트를 삭제합니다. 계속하시곘습니까 ?"
      />
      <Menu show={show}>
        <MenuList onClick={onClickEditTitle}>
          <ContextImage src={Edit} />
          노트 제목 변경
        </MenuList>
        <MenuList onClick={download}>
          <ContextImage src={ContextDownload} />
          노트 다운로드
        </MenuList>
        <MenuList onClick={onClickStarNote}>
          <ContextImage src={starred ? FilledStar : ContextStar} />
          {starred ? '중요 노트 해제' : '중요 노트함'}
        </MenuList>
        <MenuList onClick={onClickDeleteNote}>
          <ContextImage src={ContextDelete} />
          노트 삭제하기
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

export default withRouter(NoteMenu);
