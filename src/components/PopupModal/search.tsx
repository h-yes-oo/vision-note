import { FC, useState, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { authenticateToken } from 'state';

import Loading from 'components/Loading';
import Note from 'assets/icons/Note.svg';
import Search from 'assets/icons/SearchIcon.svg';
import ToggleDown from 'assets/icons/ToggleDown.svg';

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

  const getSearchResult = async (keyword: string) => {
    if (keyword !== '') {
      setLoading(true);
      try {
        const response = await axios.get(`/v1/note/search/${keyword}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
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
                {value.paragraphContent.split(keyword).map((value, index) => {
                  if (index !== 0)
                    return (
                      <>
                        <Highlighted>{keyword}</Highlighted>
                        {value}
                      </>
                    );
                  return <>{value}</>;
                })}
              </Content>
            </Result>
          )
        );
        setResultNode(searchResult);
        setResult(response.data);
      } catch {
        alert('검색에 실패했습니다. 다시 시도해주세요');
      }
      setLoading(false);
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
    if (searchKeyword !== '') getSearchResult(searchKeyword);
  }, []);

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
          <Span>{`${result.length} `}</Span>
          개의 결과
        </Num>
      </Sort>
      <ResultWrapper>{loading ? <Loading notes /> : resultNode}</ResultWrapper>
    </>
  );
};

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

export default withRouter(SearchModal);
