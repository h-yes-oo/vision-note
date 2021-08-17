import React, { FC, useState } from 'react';
import styled from 'styled-components';

import BaseLayout from 'components/BaseLayout';
import Paragraph from 'components/Paragraph';

import FolderSample from 'assets/images/FolderSample.svg';
import LookCloser from 'assets/icons/LookCloser.svg';
import More from 'assets/icons/More.svg';
import Recording from 'assets/icons/Recording.svg';
import Mic from 'assets/icons/Mic.svg';
import ToggleUp from 'assets/icons/RecordingToggleUp.svg';
import ToggleDown from 'assets/icons/RecordingToggleDown.svg';

interface Props {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  width: 1000px;
`;

const NoteInfo = styled.div``;

const InfoTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoMiddle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 8px 0 11px;
`;

const InfoBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoteTitle = styled.div`
  font-family: Pretendard;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const NoteDate = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const NoteFolder = styled.img`
  height: 20px;
`;

const ButtonWrapper = styled.div``;

const SearchBtn = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
`;

const MoreBtn = styled.img`
  height: 24px;
`;

const NoteContents = styled.div``;

const RecordingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RecordingBtn = styled.img`
  width: 18px;
  margin-right: 8px;
`;

const RecordingStatus = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const MemoBtn = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: 40px;
  &:hover {
    cursor: pointer;
  }
`;

const ToggleBtn = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 8px;
`;

function checkTime(i: number): string {
  return i < 10 ? `0${i}` : String(i);
}

const getDate = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getFullYear()}.${
    currentdate.getMonth() + 1
  }.${currentdate.getDate()} ${checkTime(currentdate.getHours())}:${checkTime(
    currentdate.getMinutes()
  )}`;
  return datetime;
};

const NotesPage: FC<Props> = () => {
  const [title, setTitle] = useState<string>(getDate());
  const [date, setDate] = useState<string>(getDate());
  const [recording, setRecording] = useState<boolean>(false);
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);

  const content1 = `첫번째 문단입니다. \n문장 단위로 인식하여 한 문장씩 쌓이게 됩니다.\n긴 pause를 인식하여 문단 단위로 나누게 됩니다.`;

  const onTitleChange = (e: any) => {
    const html = e.target.innerHTML;
    console.log(html);
    if (html !== '') setTitle(html);
  };

  return (
    <BaseLayout grey={false}>
      <Root>
        <NoteInfo>
          <InfoTop>
            <NoteFolder src={FolderSample} />
            <ButtonWrapper>
              <SearchBtn src={LookCloser} />
              <MoreBtn src={More} />
            </ButtonWrapper>
          </InfoTop>
          <InfoMiddle>
            <NoteTitle contentEditable onChange={onTitleChange}>
              {title}
            </NoteTitle>
          </InfoMiddle>
          <InfoBottom>
            <NoteDate>{date}</NoteDate>
            <RecordingWrapper>
              <RecordingStatus onClick={(e) => setRecording(!recording)}>
                <RecordingBtn src={recording ? Recording : Mic} />
                {recording ? '녹음중' : '녹음하기'}
              </RecordingStatus>
              {recording ? (
                <></>
              ) : (
                <ToggleBtn
                  src={showRecord ? ToggleUp : ToggleDown}
                  onClick={(e) => setShowRecord(!showRecord)}
                />
              )}
              <MemoBtn onClick={(e) => setShowMemo(!showMemo)}>
                {showMemo ? '전체 메모 닫기' : '전체 메모 보기'}
              </MemoBtn>
            </RecordingWrapper>
          </InfoBottom>
        </NoteInfo>
        <NoteContents>
          <Paragraph
            bookmarked={false}
            content={content1}
            time="00:00"
            note=""
          />
        </NoteContents>
      </Root>
    </BaseLayout>
  );
};

export default NotesPage;
