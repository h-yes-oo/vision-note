import React, { FC, useState, useCallback, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import { NotesMode } from 'types';
import BaseLayout from 'components/BaseLayout';
import ListData, { NoteResponse } from 'components/ListData/list';
import FolderData from 'components/ListData/folder';
import ContextMenu from 'components/ContextMenu';
import { authenticateToken } from 'state';

import Check from 'assets/icons/Check.svg';
import SortToggleDown from 'assets/icons/SortToggleDown.svg';
import NewFolder from 'assets/icons/NewFolder.svg';
import Star from 'assets/icons/Star.svg';
import Clock from 'assets/icons/Clock.svg';
import TrashCan from 'assets/icons/TrashCan.svg';
import Download from 'assets/icons/Download.svg';
import GreyStar from 'assets/icons/GreyStar.svg';
import GreyTrashCan from 'assets/icons/GreyTrashCan.svg';
import Folder40 from 'assets/icons/Folder40.svg';

interface Props {}

const FolderPage: FC<Props> = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<number>(0);
  const [notes, setNotes] = useState<ReactNode>(<></>);
  const [rootFolderId, setRootFolderId] = useState<number>(1);
  const authToken = useRecoilValue(authenticateToken);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [mode, setMode] = useState<NotesMode>(NotesMode.All);

  useEffect(() => {
    const getRootItems = async () => {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get('/v1/note/folder/root', config);
      const data: NoteResponse[] = response.data.items;
      setRootFolderId(response.data.rootFolderId);
      setNotes(
        data.map((value) => (
          <ListData
            key={`${value.itemType}.${
              value.noteFile
                ? value.noteFile!.fileId
                : value.noteFolder!.folderId
            }`}
            data={value}
            depth={0}
            menu={handleContextMenu}
          />
        ))
      );
    };
    if (authToken !== null) getRootItems();
  }, [authToken]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, noteId) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShow(true);
      setNoteId(noteId);
    },
    [setAnchorPoint, setShow]
  );

  const onClickNewFolder = async () => {
    const folderData = new FormData();
    folderData.append('folderName', '새폴더');
    folderData.append('rootFolderId', String(rootFolderId));
    const response = await axios.post('/v1/note/folder', folderData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(response);
    setNotes(
      <>
        <FolderData
          key={1000}
          title="새폴더"
          folderId={1000}
          depth={0}
          opened={false}
          menu={handleContextMenu}
        />
        {notes}
      </>
    );
  };

  const downloadAll = () => {
    console.log('download all');
    setSelectMode(false);
  };

  const starAll = () => {
    console.log('star all');
    setSelectMode(false);
  };

  const deleteAll = () => {
    console.log('delete all');
    setSelectMode(false);
  };

  const getTitle = () => {
    if (mode === NotesMode.All) return '내 학습노트';
    if (mode === NotesMode.Star) return '중요 노트함';
    return '휴지통';
  };

  return (
    <BaseLayout grey>
      <Root>
        <Top>
          {getTitle()}
          {selectMode ? (
            <ButtonWrapper>
              <Button>
                <FolderImage src={Download} />
                <ButtonName onClick={downloadAll}>노트 다운로드</ButtonName>
              </Button>
              <Button>
                <FolderImage src={GreyStar} />
                <ButtonName onClick={starAll}>중요 표시</ButtonName>
              </Button>
              <Button>
                <FolderImage src={GreyTrashCan} />
                <ButtonName onClick={deleteAll}>노트 삭제</ButtonName>
              </Button>
              <Button>
                <ButtonImage src={Check} />
                <ButtonName onClick={() => setSelectMode(false)}>
                  선택모드 해제
                </ButtonName>
              </Button>
            </ButtonWrapper>
          ) : (
            <ButtonWrapper>
              <Button>
                <FolderImage src={NewFolder} />
                <ButtonName onClick={onClickNewFolder}>새폴더</ButtonName>
              </Button>
              <Button>
                <ButtonImage src={Check} />
                <ButtonName onClick={() => setSelectMode(true)}>
                  파일 선택하기
                </ButtonName>
              </Button>
              <Button>
                <Sort>정렬 기준</Sort>
                <ButtonImage src={SortToggleDown} />
              </Button>
            </ButtonWrapper>
          )}
        </Top>
        {show && (
          <ContextMenu
            anchorPoint={anchorPoint}
            setShow={setShow}
            noteId={noteId}
          />
        )}
        <Box>
          <thead>
            <TableRow>
              <TitleHeader>노트 제목</TitleHeader>
              <StarHeader>중요 표시</StarHeader>
              <DateHeader>생성일</DateHeader>
              <SubjectHeader>분류</SubjectHeader>
            </TableRow>
          </thead>
          <tbody>{notes}</tbody>
        </Box>
        <BoxWrapper>
          <SmallBox onClick={() => setMode(NotesMode.All)}>
            <BoxTitle>
              <BoxImage src={Folder40} />
              전체 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox onClick={() => setMode(NotesMode.Star)}>
            <BoxTitle>
              <BoxImage src={Star} />
              중요 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox onClick={() => setMode(NotesMode.Trash)}>
            <BoxTitle>
              <BoxImage src={TrashCan} />
              휴지통
            </BoxTitle>
          </SmallBox>
        </BoxWrapper>
      </Root>
    </BaseLayout>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 33px;
  width: 1000px;

  > * {
    user-select: none !important;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Pretendard;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HoverAnchor = styled.a`
  &:hover {
    cursor: pointer;
  }
`;

const Button = styled(HoverAnchor)`
  display: flex;
  align-items: center;
  margin-left: 40px;
`;

const ButtonName = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: 8px;
`;

const Sort = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-right: 8px;
`;

const ButtonImage = styled.img`
  height: 12px;
  width: 12px;
`;

const FolderImage = styled.img`
  height: 18px;
  width: 18px;
`;

const Box = styled.table`
  width: 1000px;
  height: 719px;
  object-fit: contain;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  margin: 19px 0 41px;

  table-layout: fixed;
`;

const TableRow = styled.tr`
  height: 48px;
  border-bottom: #e6e6e6 1px solid;
  padding: 0 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TableHeader = styled.th`
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  user-select: none !important;

  display: flex;
  align-items: center;
`;

const TitleHeader = styled(TableHeader)`
  width: 570px;
`;

const StarHeader = styled(TableHeader)`
  width: 52px;
`;

const DateHeader = styled(TableHeader)`
  width: 280px;
  display: flex;
  justify-content: center;
`;

const SubjectHeader = styled(TableHeader)`
  width: 28px;
`;

const BoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 41px;
`;

const SmallBox = styled(HoverAnchor)`
  width: 310px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxTitle = styled.div`
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: -20px;
  display: flex;
  align-items: center;
`;

const BoxImage = styled.img`
  width: 40px;
  margin-right: 10px;
`;

export default FolderPage;
