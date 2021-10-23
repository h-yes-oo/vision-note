import React, { FC, useState, ReactNode, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { authenticateToken, theme } from 'state';

import Loading from 'components/Loading';
import Note from 'assets/icons/Note.svg';
import Search from 'assets/icons/SearchIcon.svg';
import ToggleDown from 'assets/icons/ToggleDown.svg';
import NoSearchKeywordLight from 'assets/icons/NoSearchKeywordLight.svg';
import NoSearchKeywordDark from 'assets/icons/NoSearchKeywordDark.svg';
import NoSearchResultLight from 'assets/icons/NoSearchResultLight.svg';
import NoSearchResultDark from 'assets/icons/NoSearchResultDark.svg';
import { lightTheme } from 'styles/theme';

interface SearchResult {
  scriptId: number;
  file_name: string;
  paragraphContent: string;
  folderName: string;
}

interface Props {
  searchKeyword: string;
}

const SearchModal: FC<Props & RouteComponentProps> = ({
  searchKeyword,
  history,
}) => {
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const authToken = useRecoilValue(authenticateToken);
  const [result, setResult] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultNode, setResultNode] = useState<ReactNode>(<></>);
  const currentTheme = useRecoilValue(theme);

  const getSearchResult = async (keyword: string) => {
    if (keyword !== '') {
      setLoading(true);
      try {
        const response = await axios.get(`/v1/note/search/${keyword}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setResult(response.data);
        if (response.data.length === 0) {
          setResultNode(
            <ImageWrapper>
              <Image
                src={
                  currentTheme === lightTheme
                    ? NoSearchResultLight
                    : NoSearchResultDark
                }
              />
              검색 결과가 없습니다
            </ImageWrapper>
          );
        } else {
          const searchResult: ReactNode = response.data.map(
            (value: SearchResult) => (
              <Result
                key={value.scriptId}
                onClick={() => history.push(`/note/${value.scriptId}`)}
              >
                <Title>
                  <NoteIcon src={Note} />
                  {value.file_name}
                </Title>
                <Folder>{value.folderName}</Folder>
                <Content>
                  {value.paragraphContent
                    .split(keyword)
                    .map((notKeyword, index) => {
                      if (index !== 0)
                        return (
                          <>
                            <Highlighted>{keyword}</Highlighted>
                            {notKeyword}
                          </>
                        );
                      return <>{notKeyword}</>;
                    })}
                </Content>
              </Result>
            )
          );
          setResultNode(searchResult);
        }
      } catch {
        alert('검색에 실패했습니다. 다시 시도해주세요');
      }
      setLoading(false);
    } else {
      setResultNode(
        <ImageWrapper>
          <Image
            src={
              currentTheme === lightTheme
                ? NoSearchKeywordLight
                : NoSearchKeywordDark
            }
          />
          키워드 입력 후 검색해보세요
        </ImageWrapper>
      );
    }
  };

  const onPressEnter = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await getSearchResult(keyword);
    }
  };

  useEffect(() => {
    setKeyword(searchKeyword);
    // getSearchResult(searchKeyword)
  }, [searchKeyword]);

  useEffect(() => {
    getSearchResult(searchKeyword);
  }, []);

  const getLength = (input: any[]) => {
    return input.length;
  };

  const resultLength = useMemo(() => getLength(result), [result]);

  return (
    <>
      <SearchBar
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={onPressEnter}
      />
      <SearchIcon onClick={() => getSearchResult(keyword)} src={Search} />
      <Sort>
        <Num>
          정렬 :<Span>{` 가장 잘 맞는 결과부터`}</Span>
          <ToggleIcon src={ToggleDown} />
        </Num>
        <Num>
          <Span>{`${resultLength} `}</Span>
          개의 결과
        </Num>
      </Sort>
      <ResultWrapper>{loading ? <Loading notes /> : resultNode}</ResultWrapper>
    </>
  );
};

const Image = styled.img`
  width: 250rem;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: ${(props) => props.theme.color.secondaryText};
`;

const Highlighted = styled.span`
  color: ${(props) => props.theme.color.purple};
`;

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
  border-bottom: solid 1rem ${(props) => props.theme.color.border};
  border-radius: 20rem 20rem 0 0;
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.secondaryText};
  background-color: ${(props) => props.theme.color.lightBackground};
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
  height: 100%;
`;

const Sort = styled.div`
  min-height: 52rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rem;
  border-bottom: solid 1rem ${(props) => props.theme.color.border};
`;

const Num = styled(Font)`
  font-size: 16rem;
  color: ${(props) => props.theme.color.semiText};
`;

const Span = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.color.primaryText};
  user-select: none !important;
`;

const Result = styled.div`
  min-height: 123rem;
  background-color: ${(props) => props.theme.color.lightBackground};
  padding: 20rem 30rem 0;
  border-bottom: solid 1rem ${(props) => props.theme.color.border};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: ${(props) => props.theme.color.hover};
  }
`;

const Title = styled(Font)`
  font-size: 16rem;
  color: ${(props) => props.theme.color.primaryText};
  display: flex;
  align-items: center;
`;

const Folder = styled(Font)`
  font-size: 14rem;
  color: ${(props) => props.theme.color.tertiaryText};
  margin: 8rem 0 0 37rem;
`;

const Content = styled(Font)`
  font-size: 16rem;
  color: ${(props) => props.theme.color.semiText};
  margin: 16rem 0 0 37rem;
`;

const NoteIcon = styled.img`
  height: 24rem;
  margin-right: 13rem;
`;

export default withRouter(React.memo(SearchModal));
