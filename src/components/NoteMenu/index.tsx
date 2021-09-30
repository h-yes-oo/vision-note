import { FC } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import axios from 'axios';

import ContextDownload from 'assets/icons/ContextDownload.svg';
import Edit from 'assets/icons/Edit.svg';
import ContextStar from 'assets/icons/ContextStar.svg';
import FilledStar from 'assets/icons/FilledStar.svg';
import ContextDelete from 'assets/icons/ContextDelete.svg';

import { authenticateToken } from 'state';

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

  const download = () => {
    console.log(`download ${noteId}`);
    closeMenu();
  };

  const onClickStarNote = async () => {
    await starNote();
    closeMenu();
  };

  const deleteNote = async () => {
    // event.stopPropagation();
    await axios.delete(`/v1/note/file/${noteId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    history.push('/');
    closeMenu();
  };

  const onClickEditTitle = () => {
    editNoteTitle();
    closeMenu();
  };

  return (
    <>
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
        <MenuList onClick={deleteNote}>
          <ContextImage src={ContextDelete} />
          노트 삭제하기
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

const ContextImage = styled.img`
  width: 24px;
  height: 24px;
  margin: 0 10px 0 20px;
`;

export default withRouter(NoteMenu);
