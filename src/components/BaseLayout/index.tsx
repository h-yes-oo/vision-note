import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SampleLogo from 'assets/icons/SampleLogo12.png';
import SearchIcon from 'assets/icons/SearchIcon.svg';
import ProfileImage from 'assets/images/SampleProfile.svg';
import ProfileToggleDown from 'assets/icons/ProfileToggleDown.svg';
import ProfileToggleUp from 'assets/icons/ProfileToggleUp.svg';

const Root = styled.div<{ grey: boolean }>`
  height: 100vh;
  background-color: ${(props) => (props.grey ? '#f9f9f9' : '')};
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    user-select: none !important;
  }
`;

const Header = styled.div`
  width: 100vw;
  height: 90px;
  padding-top: 15px;
  object-fit: contain;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  display: flex;
  justify-content: center;
`;

const HeaderInside = styled.div`
  width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  width: 240px;
  height: 50px;
  object-fit: contain;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

const SearchBox = styled.input`
  width: 330px;
  height: 50px;
  padding: 13px 37px 13px 20px;
  object-fit: contain;
  border-radius: 5px;
  border: solid 1px #e6e6e6;
  background-color: #fff;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #c5c5c5;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
`;

const SearchBtn = styled.img`
  width: 23px;
  height: 23px;
  object-fit: contain;
  position: absolute;
  right: 14px;
`;

const StartBtn = styled.a`
  width: 140px;
  height: 50px;
  object-fit: contain;
  background-color: #7b68ee;
  padding: 16px 0;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  border-radius: 6px;
  &:hover {
    cursor: pointer;
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 12px;
  object-fit: contain;
`;

const ProfileName = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #676767;
`;

const ProfileToggle = styled.img`
  width: 10.2px;
  margin-left: 10px;
`;

const Contents = styled.div`
  width: 1000px;
`;

interface Props {
  children: ReactNode;
  grey: boolean;
}

const BaseLayout: FC<Props & RouteComponentProps> = ({
  children,
  grey,
  history,
}) => {
  return (
    <Root grey={grey}>
      <Header>
        <HeaderInside>
          <Logo src={SampleLogo} onClick={() => history.push('/')} />
          <FlexDiv>
            <SearchWrapper>
              <SearchBox placeholder="노트에서 검색하기" />
              <SearchBtn src={SearchIcon} />
            </SearchWrapper>
            <StartBtn onClick={() => history.push('/notes')}>
              {' '}
              학습 시작하기{' '}
            </StartBtn>
          </FlexDiv>
          <FlexDiv>
            <ProfileImg src={ProfileImage} />
            <ProfileName>혜수님</ProfileName>
            <ProfileToggle src={ProfileToggleDown} />
          </FlexDiv>
        </HeaderInside>
      </Header>
      {children}
    </Root>
  );
};

export default withRouter(BaseLayout);