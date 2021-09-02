import React, { FC, useState, ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import Note from 'assets/icons/Note.svg';
import Search from 'assets/icons/SearchIcon.svg';
import ToggleDown from 'assets/icons/ToggleDown.svg';

interface Props {
  onClose?: any;
  searchKeyword: string;
}

const SearchModal: FC<Props> = ({ onClose, searchKeyword }) => {
  const [keyword, setKeyword] = useState<string>(searchKeyword);

  useEffect(() => {
    setKeyword(searchKeyword);
  }, [searchKeyword]);

  const result = [
    {
      id: 0,
      title: '지구과학 첫걸음',
      folder: '전체 노트',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 1,
      title: '역사: 단군신화 - 2021.06.22',
      folder: '2021년 1학기/한국사',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 2,
      title: '수학 다시 보는 개념',
      folder: '2021년 1학기',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 3,
      title: '역사 보충 수업',
      folder: '2021년 1학기/한국사',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 4,
      title: '지구과학 첫걸음',
      folder: '전체 노트',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 5,
      title: '역사: 단군신화 - 2021.06.22',
      folder: '2021년 1학기/한국사',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 6,
      title: '수학 다시 보는 개념',
      folder: '2021년 1학기',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
    {
      id: 7,
      title: '역사 보충 수업',
      folder: '2021년 1학기/한국사',
      content: '단군 할아버지가 터잡으시고 홍익인간 뜻으로 ...',
    },
  ];

  const searchResult: ReactNode = result.map((value, index) => (
    <Result key={value.id}>
      <Title>
        <NoteIcon src={Note} />
        {value.title}
      </Title>
      <Folder>{value.folder}</Folder>
      <Content>{value.content}</Content>
    </Result>
  ));

  return (
    <>
      <SearchBar value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <SearchIcon src={Search} />
      <Sort>
        <Num>
          정렬 :<Span>{` 가장 잘 맞는 결과부터`}</Span>
          <ToggleIcon src={ToggleDown} />
        </Num>
        <Num>
          <Span>{`${result.length} `}</Span>
          개의 결과
        </Num>
      </Sort>
      <ResultWrapper>{searchResult}</ResultWrapper>
    </>
  );
};

const ToggleIcon = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 6px;
`;

const Font = styled.div`
  font-family: Pretendard;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
`;

const SearchBar = styled.input`
  padding: 30px 30px 30px 82px;
  border: none;
  border-bottom: solid 1px #e6e6e6;
  border-radius: 20px 20px 0 0;
  font-family: Pretendard;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 30px;
  left: 30px;
  width: 32px;
  height: 32px;
`;

const ResultWrapper = styled.div`
  overflow: scroll;
  border-radius: inherit;
`;

const Sort = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: solid 1px #e6e6e6;
`;

const Num = styled(Font)`
  font-size: 16px;
  color: #656565;
`;

const Span = styled.span`
  font-weight: 600;
  color: #000;
  user-select: none !important;
`;

const Result = styled.div`
  min-height: 123px;
  background-color: #fff;
  padding: 20px 30px 0;
  border-bottom: solid 1px #e6e6e6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Title = styled(Font)`
  font-size: 16px;
  color: #000;
  display: flex;
  align-items: center;
`;

const Folder = styled(Font)`
  font-size: 14px;
  color: #656565;
  margin: 8px 0 0 37px;
`;

const Content = styled(Font)`
  font-size: 16px;
  color: #656565;
  margin: 16px 0 0 37px;
`;

const NoteIcon = styled.img`
  height: 24px;
  margin-right: 13px;
`;

export default SearchModal;
