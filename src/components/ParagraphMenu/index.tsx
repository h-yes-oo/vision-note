import { FC } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import Edit from 'assets/icons/Edit.svg';
import BookMarkEmpty from 'assets/icons/BookMarkEmpty.svg';
import BookMarkFull from 'assets/icons/BookMarkFull.svg';
import NoteEmpty from 'assets/icons/NoteEmpty.svg';
import NoteFull from 'assets/icons/NoteFull.svg';
import Play from 'assets/icons/Play.svg';

interface Props {
  show: boolean;
  closeMenu: () => void;
  bookmarked: boolean;
  noted: boolean;
  paragraphId: number;
  editMemo: () => void;
  editParagraph: () => void;
  bookmarkParagraph: () => void;
}

const ParagraphMenu: FC<Props> = ({
  show,
  closeMenu,
  bookmarked,
  noted,
  paragraphId,
  editMemo,
  editParagraph,
  bookmarkParagraph,
}) => {
  const onClickEditMemo = () => {
    editMemo();
    closeMenu();
  };

  const onClickEditParagraph = () => {
    editParagraph();
    closeMenu();
  };

  const playParagraph = async () => {
    console.log(`play ${paragraphId}`);
    closeMenu();
  };

  const onClickBookmark = async () => {
    await bookmarkParagraph();
    closeMenu();
  };

  return (
    <>
      <Menu show={show}>
        <MenuList onClick={onClickBookmark}>
          <ContextImage src={bookmarked ? BookMarkFull : BookMarkEmpty} />
          {bookmarked ? '북마크 해제' : '북마크 하기'}
        </MenuList>
        <MenuList onClick={onClickEditMemo}>
          <ContextImage src={noted ? NoteFull : NoteEmpty} />
          {bookmarked ? '메모 수정' : '메모 작성'}
        </MenuList>
        <MenuList onClick={onClickEditParagraph}>
          <ContextImage src={Edit} />
          강의록 수정
        </MenuList>
        <MenuList onClick={playParagraph}>
          <ContextImage src={Play} />
          구간 다시 듣기
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

export default ParagraphMenu;
