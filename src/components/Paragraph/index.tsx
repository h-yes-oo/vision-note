import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import ParagraphMenu from 'components/ParagraphMenu';
import { useRecoilValue } from 'recoil';

import { authenticateToken } from 'state';
import BookMarkEmpty from 'assets/icons/BookMarkEmpty.svg';
import BookMarkFull from 'assets/icons/BookMarkFull.svg';
import NoteEmpty from 'assets/icons/NoteEmpty.svg';
import NoteFull from 'assets/icons/NoteFull.svg';
import HighlightButton from 'assets/icons/HighlightButton.svg';
import HighlightCancel from 'assets/icons/HighlightCancel.png';
import MoreHorizontal from 'assets/icons/MoreHorizontal.svg';

interface Props {
  paragraphId: number;
  bookmarked: boolean;
  content: string;
  time: string;
  note: string | null;
  recording: boolean;
  waiting: boolean;
  partialResult: string;
  keywords: string[];
}

const Paragraph: FC<Props> = ({
  paragraphId,
  bookmarked,
  content,
  time,
  note,
  recording,
  waiting,
  partialResult,
  keywords,
}) => {
  const [bookmark, setBookmark] = useState<boolean>(bookmarked);
  const [noted, setNoted] = useState<boolean>(note !== null && note !== '');
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showHighlightBtn, setShowHighlightBtn] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [memo, setMemo] = useState<string | null>(note);
  const [memoEditMode, setMemoEditMode] = useState<boolean>(false);
  const [newMemo, setNewMemo] = useState<string>(note ?? '');
  const [contentToShow, setContentToShow] = useState<string>(content);
  const [paragraphEditMode, setParagraphEditMode] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content);
  const memoRef: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const contentRef: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const authToken = useRecoilValue(authenticateToken);
  const [highlightKeyword, setHighlightKeyword] = useState<string[]>(keywords);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [showHighlightCancelBtn, setShowHighlightCancelBtn] =
    useState<boolean>(false);

  useEffect(() => {
    setContentToShow(content);
    setNewContent(content);
  }, [content]);

  const bookmarkParagraph = async () => {
    try {
      const bookmarkData = new FormData();
      bookmarkData.append('paragraphId', String(paragraphId));
      bookmarkData.append('isBookmarked', bookmark ? '0' : '1');
      await axios.put(`/v1/script/paragraph/${paragraphId}`, bookmarkData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {
      alert('북마크에 실패했습니다. 다시 시도해주세요');
    }
    setBookmark(!bookmark);
  };

  const highlightSelection = (event: React.MouseEvent) => {
    try {
      const userSelection = window.getSelection()?.getRangeAt(0);
      if (userSelection !== undefined && userSelection.toString()) {
        setAnchorPoint({ x: event.clientX, y: event.clientY });
        setShowHighlightBtn(true);
        setSelectedKeyword(userSelection.toString().trim());
      }
    } catch {
      console.log('highlight error');
    }
  };

  const addNewKeyword = (keyword: string) => {
    try {
      const keywordData = new FormData();
      keywordData.append('paragraphId', String(paragraphId));
      keywordData.append('keyword', keyword);
      axios.post(`/v1/script/paragraph/keyword/${paragraphId}`, keywordData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {
      console.log(`${keyword} 등록 실패`);
    }
  };

  const deleteKeyword = (keyword: string) => {
    try {
      const keywordData = new FormData();
      keywordData.append('paragraphId', String(paragraphId));
      keywordData.append('keyword', keyword);
      axios.post(
        `/v1/script/paragraph/keyword/delete/${paragraphId}`,
        keywordData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    } catch {
      console.log(`${keyword} 등록 실패`);
    }
  };

  const highlightRange = (keyword: string) => {
    if (keyword.includes('?')) {
      const newKeywords = keyword
        .split('?')
        .map((value: string) => value.trim());
      setHighlightKeyword((prev) => [...prev, ...newKeywords]);
      newKeywords.forEach((keyword) => addNewKeyword(keyword));
    } else {
      setHighlightKeyword((prev) => [...prev, keyword]);
      addNewKeyword(keyword);
    }
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    console.log(highlightKeyword);
    // TODO : 데이터베이스로 highlight keyword 보내기
  }, [highlightKeyword]);

  const onClickHighlight = () => {
    setShowHighlightBtn(false);
    highlightRange(selectedKeyword);
  };

  const onClickHighlighted = (event: React.MouseEvent, word: string) => {
    setAnchorPoint({ x: event.clientX, y: event.clientY });
    setShowHighlightCancelBtn(true);
    setSelectedKeyword(word);
  };

  const cancelHighlight = () => {
    setHighlightKeyword((prev) =>
      prev.filter((val) => val !== selectedKeyword)
    );
    deleteKeyword(selectedKeyword);
    setShowHighlightCancelBtn(false);
  };

  const onClickOther = () => {
    if (showHighlightBtn) {
      setShowHighlightBtn(false);
      window.getSelection()?.removeAllRanges();
    } else {
      setShowHighlightCancelBtn(false);
    }
    setAnchorPoint({ x: 0, y: 0 });
  };

  const editMemo = () => {
    if (memoRef.current !== null) {
      setTimeout(() => memoRef.current!.focus(), 10);
    }
    setMemoEditMode(true);
  };

  const endEditingMemo = async () => {
    setMemoEditMode(false);
    if (newMemo !== '') {
      try {
        const memoData = new FormData();
        memoData.append('paragraphId', String(paragraphId));
        memoData.append('memoContent', newMemo);
        await axios.put(`/v1/script/paragraph/${paragraphId}`, memoData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setMemo(newMemo);
        setNoted(true);
      } catch {
        alert('메모를 변경하지 못했습니다');
      }
    } else {
      try {
        const memoData = new FormData();
        memoData.append('paragraphId', String(paragraphId));
        memoData.append('memoContent', '');
        await axios.put(`/v1/script/paragraph/${paragraphId}`, memoData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setMemo(newMemo);
        setNoted(false);
      } catch {
        alert('메모를 변경하지 못했습니다');
      }
    }
  };

  const endEditingContent = async () => {
    setParagraphEditMode(false);
    if (newContent !== '') {
      try {
        const paragraphData = new FormData();
        paragraphData.append('paragraphId', String(paragraphId));
        paragraphData.append('paragraphContent', newContent);
        await axios.put(`/v1/script/paragraph/${paragraphId}`, paragraphData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setContentToShow(newContent);
      } catch {
        alert('폴더 이름을 변경하지 못했습니다');
      }
    }
  };

  const onPressEnterMemo = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await endEditingMemo();
    }
  };

  const onPressEnterContent = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await endEditingContent();
    }
  };

  const editParagraph = () => {
    if (contentRef.current !== null) {
      setTimeout(() => contentRef.current!.focus(), 10);
    }
    setParagraphEditMode(true);
  };

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setShowMenu(true);
    },
    [setShowMenu]
  );

  const highlightContent = () => {
    const splited = [contentToShow];
    highlightKeyword
      .sort((a, b) => b.length - a.length)
      .forEach((keyword) => {
        try {
          const regExp = new RegExp(`(${keyword})`);
          for (let idx = 0; idx < splited.length; ) {
            if (highlightKeyword.includes(splited[idx])) {
              // 이미 중요 단어 단계까지 쪼개져 있으면 더 쪼개지 않음
              idx += 1;
            } else {
              // 해당 키워드를 포함하여 쪼개기
              const trick = splited[idx].split(regExp);
              splited.splice(idx, 1, ...trick);
              idx += trick.length;
            }
          }
        } catch (error) {
          // 물음표를 포함하는 경우 간혹 에러 발생
          console.log(error);
        }
      });
    let highlighted = 0;
    const toShow = splited.map((word) => {
      if (highlightKeyword.includes(word)) {
        return (
          <Highlighted
            key={highlighted++}
            onClick={(event: React.MouseEvent) =>
              onClickHighlighted(event, word)
            }
          >
            {word}
          </Highlighted>
        );
      }
      return <>{word}</>;
    });
    return toShow;
  };

  return (
    <Root>
      <PreventClick
        visible={showHighlightBtn || showHighlightCancelBtn}
        onClick={onClickOther}
      >
        <HighligtBtn
          top={anchorPoint.y - 58}
          left={anchorPoint.x - 30}
          src={showHighlightBtn ? HighlightButton : HighlightCancel}
          onClick={showHighlightBtn ? onClickHighlight : cancelHighlight}
        />
      </PreventClick>
      {paragraphEditMode ? (
        <EditContent
          bookmarked={bookmark}
          ref={contentRef}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyPress={onPressEnterContent}
        />
      ) : (
        <Contents onMouseUp={highlightSelection} bookmarked={bookmark}>
          {highlightContent()}
          {waiting && (
            <>
              <PartialResult>{partialResult}</PartialResult>
              <DotWrapper>
                <DotFalling />
              </DotWrapper>
            </>
          )}
        </Contents>
      )}
      <FlexColumn>
        <BtnWrapper>
          <TimeStamp>{time}</TimeStamp>
          {recording ? (
            <>
              <BookMark
                src={bookmark ? BookMarkFull : BookMarkEmpty}
                onClick={bookmarkParagraph}
              />
              <Note src={noted ? NoteFull : NoteEmpty} onClick={editMemo} />
            </>
          ) : (
            <Relative
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowMenu(false)}
            >
              <MoreBtn src={MoreHorizontal} />
              <ParagraphMenu
                show={showMenu}
                closeMenu={() => setShowMenu(false)}
                bookmarked={bookmark}
                noted={noted}
                paragraphId={paragraphId}
                editMemo={editMemo}
                editParagraph={editParagraph}
                bookmarkParagraph={bookmarkParagraph}
              />
            </Relative>
          )}
        </BtnWrapper>
        {!memoEditMode && noted && <Memo>{memo}</Memo>}
        <EditMemo
          visible={memoEditMode}
          ref={memoRef}
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          onKeyPress={onPressEnterMemo}
        />
      </FlexColumn>
    </Root>
  );
};

const PartialResult = styled.span`
  user-select: none;
  font-style: oblique;
  color: ${(props) => props.theme.color.tertiaryText};
`;

const EditContent = styled.textarea<{ bookmarked: boolean }>`
  font-family: Pretendard;
  font-size: 19rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.63;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  white-space: pre-wrap;
  user-select: text !important;
  border-radius: 3rem;
  padding: 20rem 0;
  min-width: 500rem;
  max-width: 70%;
  background-color: ${(props) =>
    props.bookmarked ? props.theme.color.highlightBackground : ''};
  ${(props) =>
    props.bookmarked
      ? 'border-left: 5rem solid #7b68ee; padding: 20rem 15rem 20rem 20rem;'
      : ''}
`;

const Highlighted = styled.span`
  user-select: none;
  color: ${(props) => props.theme.color.purple};
  &:hover {
    text-shadow: 0 0 black;
    cursor: pointer;
  }
`;
const Flex = styled.div`
  display: flex;
`;

const FlexColumn = styled(Flex)`
  flex-direction: column;
`;

const Memo = styled.div`
  width: 201rem;
  height: 145rem;
  border-radius: 5rem;
  box-shadow: 0 5rem 12rem 0 rgba(0, 0, 0, 0.12);
  background-color: ${(props) => props.theme.color.contextBackground};
  border-top: solid 8rem ${(props) => props.theme.color.hover};
  padding: 20px;
  box-sizing: border-box;
  overflow: scroll;
  margin-top: 4px;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.semiText};
`;

const EditMemo = styled.textarea<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  width: 201rem;
  height: 145rem;
  border-radius: 5rem;
  box-shadow: 0 5rem 12rem 0 rgba(0, 0, 0, 0.12);
  background-color: ${(props) => props.theme.color.contextBackground};
  border: none;
  border-top: solid 8rem ${(props) => props.theme.color.hover};
  padding: 20px;
  box-sizing: border-box;
  overflow: scroll;
  margin-top: 4px;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.semiText};
`;

const Root = styled.div`
  display: flex;
  align-itmes: flex-start;
  justify-content: space-between;
  margin-top: 80rem;
`;

const MoreBtn = styled.img`
  height: 18rem;
  margin-left: 12rem;
  &:hover {
    cursor: pointer;
  }
`;

const Contents = styled.div<{ bookmarked: boolean }>`
  font-family: Pretendard;
  font-size: 19rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.63;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  white-space: pre-wrap;
  user-select: text !important;
  border-radius: 3rem;
  padding: 20rem 0;
  min-width: 500rem;
  max-width: 70%;
  background-color: ${(props) =>
    props.bookmarked ? props.theme.color.highlightBackground : ''};
  ${(props) =>
    props.bookmarked
      ? 'border-left: 5rem solid #7b68ee; padding: 20rem 15rem 20rem 20rem;'
      : ''}
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TimeStamp = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #a2a2a2;
`;

const BookMark = styled.img`
  width: 18rem;
  height: 18rem;
  margin: 0 12rem 0 10rem;
  &:hover {
    cursor: pointer;
  }
`;

const Note = styled.img`
  width: 18rem;
  height: 18rem;
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
  height: 68rem;
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

const Relative = styled.div`
  position: relative;
`;

const DotWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: none;
  margin: 10px;
  min-width: 40rem;
  max-width: 40rem;
  height: fit-content;
`;

const dotFalling = keyframes`
  0% {
    box-shadow: 9999rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9999rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9999rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingBefore = keyframes`
  0% {
    box-shadow: 9984rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9984rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9984rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingAfter = keyframes`
  0% {
    box-shadow: 10014rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 10014rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 10014rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const DotFalling = styled.div`
  position: relative;
  left: -9999rem;
  width: 10rem;
  height: 10rem;
  border-radius: 5rem;
  background-color: #9a9ba6;
  color: #9a9ba6;
  box-shadow: 9999rem 0 0 0 #9a9ba6;
  animation: ${dotFalling} 1s infinite linear;
  animation-delay: 0.1s;

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingBefore} 1s infinite linear;
    animation-delay: 0s;
  }

  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingAfter} 1s infinite linear;
    animation-delay: 0.2s;
  }
`;

export default Paragraph;
