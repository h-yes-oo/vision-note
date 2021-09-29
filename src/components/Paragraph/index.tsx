import React, { FC, useState } from 'react';
import styled from 'styled-components';

import BookMarkEmpty from 'assets/icons/BookMarkEmpty.svg';
import BookMarkFull from 'assets/icons/BookMarkFull.svg';
import NoteEmpty from 'assets/icons/NoteEmpty.svg';
import NoteFull from 'assets/icons/NoteFull.svg';
import HighlightButton from 'assets/icons/HighlightButton.svg';

const Root = styled.div`
  display: flex;
  align-itmes: flex-start;
  justify-content: space-between;
  margin-top: 80px;
`;

const Contents = styled.div<{ bookmarked: boolean }>`
  font-family: Pretendard;
  font-size: 19px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.63;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  white-space: pre-wrap;
  user-select: text !important;
  border-radius: 3px;
  padding: 20px 0;
  ${(props) =>
    props.bookmarked
      ? 'background-color: #f5f4fe; border-left: 5px solid #7b68ee; padding: 20px 15px 20px 20px;'
      : ''}
`;

const BtnWrapper = styled.div`
  display: flex;
`;

const TimeStamp = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #a2a2a2;
`;

const BookMark = styled.img`
  width: 18px;
  height: 18px;
  margin: 0 12px 0 10px;
  &:hover {
    cursor: pointer;
  }
`;

const Note = styled.img`
  width: 18px;
  height: 18px;
  &:hover {
    cursor: pointer;
  }
`;

const HighligtBtn = styled.img<{ top: number; left: number }>`
  position: absolute;
  opacity: 1;
  transition: opacity 0.5s linear;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  &:hover {
    cursor: pointer;
  }
`;

const PreventClick = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
`;

interface Props {
  bookmarked: boolean;
  content: string;
  time: string;
  note: string;
}

const Paragraph: FC<Props> = ({ bookmarked, content, time, note }) => {
  const [bookmark, setBookmark] = useState<boolean>(bookmarked);
  const [noted, setNoted] = useState<boolean>(note !== '');
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [showHighlightBtn, setShowHighlightBtn] = useState<boolean>(false);

  const onClickBookMark = () => {
    // TODO : 해당 문단 북마크 요청 보내기
    setBookmark(!bookmark);
    console.log('hi');
  };

  const highlightSelection = (event: React.MouseEvent) => {
    try {
      const userSelection = window.getSelection()?.getRangeAt(0);
      if (userSelection !== undefined && userSelection.toString()) {
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setShowHighlightBtn(true);
        setSelectedRange(userSelection);
      }
    } catch {
      console.log('highlight error');
    }
  };

  const highlightRange = (range) => {
    try {
      const newNode = document.createElement('span');
      newNode.setAttribute('style', 'color: #7b68ee; display: inline;');
      range.surroundContents(newNode);
      // TODO : 하이라이트된 내용 서버에 저장
    } catch {
      alert('이미 하이라이팅된 부분은 다시 하이라이트할 수 없습니다');
    }
    window.getSelection()?.removeAllRanges();
  };

  const onClickHighlight = () => {
    setShowHighlightBtn(false);
    highlightRange(selectedRange);
  };

  const onClickOther = () => {
    setShowHighlightBtn(false);
    setAnchorPoint({ x: 0, y: 0 });
    window.getSelection()?.removeAllRanges();
  };

  return (
    <Root>
      <PreventClick visible={showHighlightBtn} onClick={onClickOther}>
        <HighligtBtn
          top={anchorPoint.y - 58}
          left={anchorPoint.x - 30}
          src={HighlightButton}
          onClick={onClickHighlight}
        />
      </PreventClick>
      <Contents onMouseUp={highlightSelection} bookmarked={bookmark}>
        {content}
      </Contents>
      <BtnWrapper>
        <TimeStamp>{time}</TimeStamp>
        <BookMark
          src={bookmark ? BookMarkFull : BookMarkEmpty}
          onClick={onClickBookMark}
        />
        <Note src={noted ? NoteFull : NoteEmpty} />
      </BtnWrapper>
    </Root>
  );
};

export default Paragraph;
