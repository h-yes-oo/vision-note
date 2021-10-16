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
  bookmarkParagraph: () => Promise<void>;
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
          {noted ? '메모 수정' : '메모 작성'}
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
  top: 20rem;

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

export default ParagraphMenu;
