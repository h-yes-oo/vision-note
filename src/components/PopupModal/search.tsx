import React, { FC, useState, ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import Note from 'assets/icons/Note.svg';
import Search from 'assets/icons/SearchIcon.svg';
import ToggleDown from 'assets/icons/ToggleDown.svg';

interface Props {
  searchKeyword: string;
}

const SearchModal: FC<Props> = ({ searchKeyword }) => {
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
  width: 12rem;
  height: 12rem;
  margin-left: 6rem;
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
  padding: 30rem 30rem 30rem 82rem;
  border: none;
  border-bottom: solid 1rem #e6e6e6;
  border-radius: 20rem 20rem 0 0;
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 30rem;
  left: 30rem;
  width: 32rem;
  height: 32rem;
`;

const ResultWrapper = styled.div`
  overflow: scroll;
  border-radius: inherit;
`;

const Sort = styled.div`
  min-height: 52rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rem;
  border-bottom: solid 1rem #e6e6e6;
`;

const Num = styled(Font)`
  font-size: 16rem;
  color: #656565;
`;

const Span = styled.span`
  font-weight: 600;
  color: #000;
  user-select: none !important;
`;

const Result = styled.div`
  min-height: 123rem;
  background-color: #fff;
  padding: 20rem 30rem 0;
  border-bottom: solid 1rem #e6e6e6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Title = styled(Font)`
  font-size: 16rem;
  color: #000;
  display: flex;
  align-items: center;
`;

const Folder = styled(Font)`
  font-size: 14rem;
  color: #656565;
  margin: 8rem 0 0 37rem;
`;

const Content = styled(Font)`
  font-size: 16rem;
  color: #656565;
  margin: 16rem 0 0 37rem;
`;

const NoteIcon = styled.img`
  height: 24rem;
  margin-right: 13rem;
`;

export default SearchModal;
