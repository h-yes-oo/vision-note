import React, { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isMobile } from 'functions';
import { darkTheme, lightTheme } from 'styles/theme';

import SampleLogo from 'assets/icons/SampleLogo15.png';
import LogoLight from 'assets/icons/LogoLight.png';
import LogoDark from 'assets/icons/LogoDark.png';
import SearchIcon from 'assets/icons/SearchIcon.svg';
import ProfileImage from 'assets/images/SampleProfile.svg';
import ProfileToggleDown from 'assets/icons/ProfileToggleDown.svg';
import ProfileToggleUp from 'assets/icons/ProfileToggleUp.svg';

import { userName, theme } from 'state';
import UserMenu from 'components/UserMenu';
import PopupModal from 'components/PopupModal';
import SearchModal from 'components/PopupModal/search';

interface Props {
  children: ReactNode;
  grey: boolean;
}

const BaseLayout: FC<Props & RouteComponentProps> = ({
  children,
  grey,
  history,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const userNickname = useRecoilValue(userName);
  const currentTheme = useRecoilValue(theme);

  const search = () => {
    setShowSearch(true);
    console.log(searchKeyword);
  };

  const closeModal = () => {
    setShowSearch(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShowUserMenu(true);
  };

  const handleMouseLeave = () => setShowUserMenu(false);

  const startNote = () => {
    if (isMobile()) alert('노트 생성은 pc에서만 가능합니다');
    else history.push('/startnote');
  };

  return (
    <Root grey={grey}>
      <PopupModal onClose={closeModal} visible={showSearch}>
        <SearchModal searchKeyword={searchKeyword} />
      </PopupModal>
      <Header>
        <HeaderInside>
          <Logo onClick={() => history.push('/')} />
          <FlexDiv>
            <SearchWrapper>
              <SearchBox
                value={searchKeyword}
                placeholder="노트에서 검색하기"
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') search();
                }}
              />
              <SearchBtn src={SearchIcon} onClick={search} />
            </SearchWrapper>
            <StartBtn onClick={startNote}>학습 시작하기</StartBtn>
          </FlexDiv>
          <UserDiv
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ProfileImg src={ProfileImage} />
            <ProfileName>{userNickname}님</ProfileName>
            <Relative>
              <ProfileToggle
                src={showUserMenu ? ProfileToggleUp : ProfileToggleDown}
              />
              <UserMenu show={showUserMenu} setShow={setShowUserMenu} />
            </Relative>
          </UserDiv>
        </HeaderInside>
      </Header>
      {children}
    </Root>
  );
};

const Root = styled.div<{ grey: boolean }>`
  background-color: ${(props) => {
    if (props.theme === darkTheme) return '#2f3437';
    return props.grey ? '#f9f9f9' : '';
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  > * {
    user-select: none !important;
  }
`;

const Header = styled.div`
  width: 100vw;
  height: 90rem;
  padding-top: 15rem;
  object-fit: contain;
  box-shadow: 0 3rem 6rem 0 rgba(0, 0, 0, 0.08);
  background-color: ${(props) => props.theme.color.background};
  display: flex;
  justify-content: center;
`;

const HeaderInside = styled.div`
  width: 1000rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  width: 210rem;
  height: 100rem;
  background-size: 300rem;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(${(props) => props.theme.logo});
  &:hover {
    cursor: pointer;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-right: 20rem;
  display: flex;
  align-items: center;
`;

const SearchBox = styled.input`
  display: flex;
  justify-content: flex-end;
  width: 330rem;
  height: 50rem;
  padding: 13rem 37rem 13rem 20rem;
  box-sizing: border-box;
  object-fit: contain;
  border-radius: 5rem;
  border: solid 1rem ${(props) => props.theme.color.lightBorder};
  background-color: ${(props) => props.theme.color.background};
  color: ${(props) => props.theme.color.primaryText};

  font-family: Pretendard;
  font-size: 18rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;

  &::placeholder {
    color: ${(props) => props.theme.color.placeHolder};
  }
`;

const SearchBtn = styled.img`
  width: 23rem;
  height: 23rem;
  object-fit: contain;
  position: absolute;
  right: 14rem;
  &:hover {
    cursor: pointer;
  }
`;

const StartBtn = styled.a`
  width: 140rem;
  height: 50rem;
  object-fit: contain;
  background-color: #7b68ee;
  padding: 16rem 0;
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  border-radius: 6rem;
  &:hover {
    cursor: pointer;
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const UserDiv = styled(FlexDiv)`
  padding: 4rem 0;
`;

const ProfileImg = styled.img`
  width: 50rem;
  height: 50rem;
  margin: 0 12rem;
  object-fit: contain;
`;

const ProfileName = styled.div`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.secondaryText}; ;
`;

const ProfileToggle = styled.img`
  width: 10.2rem;
  margin-left: 10rem;
`;

const Relative = styled.div`
  position: relative;
  height: 50rem;
  display: flex;
  align-items: center;
`;

export default withRouter(BaseLayout);
