import { FC, useState } from 'react';
import styled from 'styled-components';

import BookMarkEmpty from 'assets/icons/BookMarkEmpty.svg';
import BookMarkFull from 'assets/icons/BookMarkFull.svg';
import NoteEmpty from 'assets/icons/NoteEmpty.svg';
import NoteFull from 'assets/icons/NoteFull.svg';

const Root = styled.div`
  display: flex;
  align-itmes: flex-start;
  justify-content: space-between;
  margin-top: 80px;
`;

const Contents = styled.div`
  display: flex;
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
`;

const Note = styled.img`
  width: 18px;
  height: 18px;
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
  return (
    <Root>
      <Contents>{content}</Contents>
      <BtnWrapper>
        <TimeStamp>{time}</TimeStamp>
        <BookMark src={bookmarked ? BookMarkFull : BookMarkEmpty} />
        <Note src={noted ? NoteFull : NoteEmpty} />
      </BtnWrapper>
    </Root>
  );
};

export default Paragraph;
