import { FC, useState, ReactNode, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';

import { NotesMode, SortMode } from 'types';
import BaseLayout from 'components/BaseLayout';
import ListData, { NoteResponse } from 'components/ListData/list';
import Loading from 'components/Loading';
import SortMenu from 'components/SortMenu';
import {
  authenticateToken,
  selectMode,
  selectedNotes,
  notesMode,
  dragRefresh,
  selectedRefresh,
  sortMode,
} from 'state';

import Check from 'assets/icons/Check.svg';
import SortToggleDown from 'assets/icons/SortToggleDown.svg';
import SortToggleUp from 'assets/icons/SortToggleUp.svg';
import NewFolder from 'assets/icons/NewFolder.svg';
import Star from 'assets/icons/Star.svg';
import EmptyTrashCan from 'assets/icons/EmptyTrashCan.svg';
import TrashCan from 'assets/icons/TrashCan.svg';
import Download from 'assets/icons/Download.svg';
import GreyStar from 'assets/icons/GreyStar.svg';
import GreyTrashCan from 'assets/icons/GreyTrashCan.svg';
import Folder40 from 'assets/icons/Folder40.svg';

interface Props {}

const FolderPage: FC<Props> = () => {
  // about notes
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<ReactNode>(<></>);
  const [rootFolderId, setRootFolderId] = useState<number>(1);
  const authToken = useRecoilValue(authenticateToken);
  const [refresh, setRefresh] = useState<boolean>(false);
  // about folder page mode
  const [mode, setMode] = useRecoilState(notesMode);
  const [sortBy, setSortBy] = useRecoilState(sortMode);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [selecting, setSelecting] = useRecoilState(selectMode);
  const [selectedIds, setSelectedIds] = useRecoilState(selectedNotes);
  const [selectedRefreshList, setSelectedRefresh] =
    useRecoilState(selectedRefresh);
  const refreshDrag = useRecoilValue<() => void>(dragRefresh);

  const sortFolder = (a, b) => {
    // 한글 오름차순
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFolder!.folderName < b.noteFolder!.folderName) return -1;
      if (a.noteFolder!.folderName > b.noteFolder!.folderName) return 1;
      return 0;
    }
    // 오래된 순
    if (sortBy === SortMode.Oldest) {
      if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return -1;
      if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return 1;
      return 0;
    }
    // 새로 만든 순
    if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return -1;
    if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return 1;
    return 0;
  };

  const sortNote = (a, b) => {
    // 한글 오름차순
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFile!.fileName < b.noteFile!.fileName) return -1;
      if (a.noteFile!.fileName > b.noteFile!.fileName) return 1;
      return 0;
    }
    // 오래된 순
    if (sortBy === SortMode.Oldest) {
      if (a.noteFile!.createdAt < b.noteFile!.createdAt) return -1;
      if (a.noteFile!.createdAt > b.noteFile!.createdAt) return 1;
      return 0;
    }
    // 새로 만든 순
    if (a.noteFile!.createdAt > b.noteFile!.createdAt) return -1;
    if (a.noteFile!.createdAt < b.noteFile!.createdAt) return 1;
    return 0;
  };

  const getRootItems = async () => {
    const response = await axios.get('/v1/note/folder/root', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    let data: NoteResponse[] = response.data.items;
    console.log(data);
    setRootFolderId(response.data.rootFolderId);
    if (mode === NotesMode.Star)
      data = data.filter(
        (value) =>
          value.itemType === 'FOLDER' ||
          (value.itemType === 'FILE' && value.noteFile!.isImportant === 1)
      );
    const folders = data
      .filter((value) => value.itemType === 'FOLDER')
      .sort(sortFolder)
      .map((value) => {
        const key = `FOLDER.${value.noteFolder!.folderId}`;
        return (
          <ListData
            key={key}
            data={value}
            depth={0}
            refreshNotes={getRootItems}
            refreshRoot={getRootItems}
          />
        );
      });

    const notes = data
      .filter((value) => value.itemType === 'FILE')
      .sort(sortNote)
      .map((value) => {
        const key = `FILE.${value.noteFile!.fileId}.${
          value.noteFile!.isImportant
        }`;
        return (
          <ListData
            key={key}
            data={value}
            depth={0}
            refreshNotes={getRootItems}
            refreshRoot={getRootItems}
          />
        );
      });

    // const mixed = data.map((value) => {
    //   let key = '';
    //   if (value.itemType === 'FOLDER') {
    //     key = `FOLDER.${value.noteFolder!.folderId}`;
    //   } else {
    //     key = `FILE.${value.noteFile!.fileId}.${value.noteFile!.isImportant}`;
    //   }
    //   return (
    //     <ListData
    //       key={key}
    //       data={value}
    //       depth={0}
    //       refreshNotes={getRootItems}
    //       refreshRoot={getRootItems}
    //     />
    //   );
    // });

    setNotes(
      <>
        {folders}
        {notes}
      </>
    );
  };

  // refresh 되거나 mode 바뀌면 로딩닷과 함께 리렌더
  useEffect(() => {
    setLoading(true);
    if (authToken !== null) getRootItems();
    setLoading(false);
  }, [refresh, mode]);

  // 정렬 기준 바뀌면 로딩닷 없이 리렌더
  useEffect(() => {
    getRootItems();
  }, [sortBy]);

  const onClickNewFolder = async () => {
    const folderData = new FormData();
    folderData.append('folderName', '새폴더');
    folderData.append('parentFolderId', String(rootFolderId));
    try {
      await axios.post('/v1/note/folder', folderData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      getRootItems();
    } catch {
      alert('새 폴더를 생성하지 못했습니다');
    }
  };

  const downloadAll = () => {
    console.log('download all');
    setSelectedIds([]);
    setSelecting(false);
  };

  const starNote = async (noteId: number) => {
    try {
      const fileData = new FormData();
      fileData.append('fileId', String(noteId));
      fileData.append('isImportant', '1');
      await axios.put(`/v1/note/file/${noteId}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return true;
    } catch {
      alert('문제가 발생했습니다');
      return false;
    }
  };

  const starAll = async () => {
    const responses = await Promise.all(
      selectedIds.map((noteId) => starNote(noteId))
    );
    if (responses.every((res) => res)) {
      selectedRefreshList.map((refreshFunction) => refreshFunction());
      setSelectedRefresh([]);
      setSelectedIds([]);
      setSelecting(false);
    } else {
      alert('문제가 발생했습니다');
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`/v1/note/file/${noteId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return true;
    } catch {
      alert('문제가 발생했습니다');
      return false;
    }
  };

  const deleteAll = async () => {
    const responses = await Promise.all(
      selectedIds.map((noteId) => deleteNote(noteId))
    );
    if (responses.every((res) => res)) {
      selectedRefreshList.map((refreshFunction) => refreshFunction());
      setSelectedRefresh([]);
      setSelectedIds([]);
      setSelecting(false);
    } else {
      alert('문제가 발생했습니다');
    }
  };

  const onClickMode = (mode: NotesMode) => {
    setMode(mode);
    setSelectedIds([]);
    setSelecting(false);
  };

  const getTitle = () => {
    if (mode === NotesMode.All) return '내 학습노트';
    if (mode === NotesMode.Star) return '중요 노트함';
    return '휴지통';
  };

  const startSelectMode = () => {
    setSelecting(true);
    setSelectedIds([]);
  };

  const stopSelectMode = () => {
    setSelecting(false);
    setSelectedIds([]);
  };

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setShowSortMenu(true);
    },
    [setShowSortMenu]
  );

  const SortElement = (
    <Button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowSortMenu(false)}
    >
      <Sort>정렬 기준</Sort>
      <ButtonImage src={showSortMenu ? SortToggleUp : SortToggleDown} />
      <SortMenu show={showSortMenu} closeMenu={() => setShowSortMenu(false)} />
    </Button>
  );

  const getTopMenu = () => {
    // 중요 노트함 기본 모드
    if (mode === NotesMode.Star && !selecting)
      return (
        <ButtonWrapper>
          <Button>
            <ButtonImage src={Check} />
            <ButtonName onClick={startSelectMode}>파일 선택하기</ButtonName>
          </Button>
          {SortElement}
        </ButtonWrapper>
      );
    // 중요 노트함 파일 선택 모드
    if (mode === NotesMode.Star && selecting)
      return (
        <ButtonWrapper>
          <Button>
            <FolderImage src={Download} />
            <ButtonName onClick={downloadAll}>노트 다운로드</ButtonName>
          </Button>
          <Button>
            <FolderImage src={GreyTrashCan} />
            <ButtonName onClick={deleteAll}>노트 삭제</ButtonName>
          </Button>
          <Button>
            <ButtonImage src={Check} />
            <ButtonName onClick={stopSelectMode}>선택모드 해제</ButtonName>
          </Button>
        </ButtonWrapper>
      );
    // 휴지통 기본 모드
    if (mode === NotesMode.Trash && !selecting)
      return (
        <ButtonWrapper>
          <Button>
            <ButtonImage src={Check} />
            <ButtonName onClick={startSelectMode}>파일 선택하기</ButtonName>
          </Button>
          <Button>
            <ButtonImage src={EmptyTrashCan} />
            <ButtonName onClick={() => console.log('휴지통 비우기')}>
              휴지통 비우기
            </ButtonName>
          </Button>
          {SortElement}
        </ButtonWrapper>
      );
    // 휴지통 파일 선택 모드
    if (mode === NotesMode.Trash && selecting)
      return (
        <ButtonWrapper>
          <Button>
            <ButtonImage src={EmptyTrashCan} />
            <ButtonName onClick={() => console.log('휴지통 비우기')}>
              선택 파일 영구 삭제
            </ButtonName>
          </Button>
          <Button>
            <ButtonImage src={Check} />
            <ButtonName onClick={stopSelectMode}>선택모드 해제</ButtonName>
          </Button>
        </ButtonWrapper>
      );
    // 전체 노트함 파일 선택 모드
    if (mode === NotesMode.All && selecting)
      return (
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
            <ButtonName onClick={stopSelectMode}>선택모드 해제</ButtonName>
          </Button>
        </ButtonWrapper>
      );
    // 전체 노트함 기본 모드
    return (
      <ButtonWrapper>
        <Button>
          <FolderImage src={NewFolder} />
          <ButtonName onClick={onClickNewFolder}>새폴더</ButtonName>
        </Button>
        <Button>
          <ButtonImage src={Check} />
          <ButtonName onClick={startSelectMode}>파일 선택하기</ButtonName>
        </Button>
        {SortElement}
      </ButtonWrapper>
    );
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const type = data[0];
    const id = data.slice(1);
    if (type === 'f') {
      // 폴더(id)를 루트 폴더 내부로 옮길 때
      const fileData = new FormData();
      fileData.append('folderId', String(id));
      fileData.append('parentFolderId', String(rootFolderId));
      await axios.put(`/v1/note/folder/${id}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // 폴더(id)의 상위 폴더와 루트 폴더 리렌더
      // 어차피 루트 폴더 리렌더 하면 전체 리렌더
      refreshDrag();
      getRootItems();
    } else {
      // 파일(id)를 루트 폴더 내부로 옮길 때
      const fileData = new FormData();
      fileData.append('fileId', String(id));
      fileData.append('folderId', String(rootFolderId));
      await axios.put(`/v1/note/file/${id}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // 파일(id)의 상위 폴더와 루트 폴더 리렌더
      // 어차피 루트 폴더 리렌더 하면 전체 리렌더
      refreshDrag();
      getRootItems();
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <BaseLayout grey>
      <Root>
        <Top>
          {getTitle()}
          {getTopMenu()}
        </Top>
        <Box>
          <div>
            <TableRow>
              <TitleHeader>노트 제목</TitleHeader>
              <StarHeader>중요 표시</StarHeader>
              <DateHeader>생성일</DateHeader>
              <SubjectHeader>분류</SubjectHeader>
            </TableRow>
          </div>
          <NoteWrapper>
            {loading ? (
              <Loading notes />
            ) : (
              <>
                {notes}
                <DropZone
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                />
              </>
            )}
          </NoteWrapper>
        </Box>
        <BoxWrapper>
          <SmallBox onClick={() => onClickMode(NotesMode.All)}>
            <BoxTitle>
              <BoxImage src={Folder40} />
              전체 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox onClick={() => onClickMode(NotesMode.Star)}>
            <BoxTitle>
              <BoxImage src={Star} />
              중요 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox onClick={() => onClickMode(NotesMode.Trash)}>
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

const NoteWrapper = styled.div`
  height: calc(100% - 49rem);
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const DropZone = styled.div`
  min-height: 65rem;
  flex: 1;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 33rem;
  width: 1000rem;

  > * {
    user-select: none !important;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Pretendard;
  font-size: 24rem;
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
  border-radius: 5rem;
  &:hover {
    cursor: pointer;
    background-color: #f1f3f4;
  }
`;

const Button = styled(HoverAnchor)`
  display: flex;
  align-items: center;
  margin-left: 40rem;
  position: relative;
  height: 100%;
`;

const ButtonName = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: 8rem;
`;

const Sort = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-right: 8rem;
`;

const ButtonImage = styled.img`
  height: 12rem;
  width: 12rem;
`;

const FolderImage = styled.img`
  height: 18rem;
  width: 18rem;
`;

const Box = styled.div`
  width: 1000rem;
  height: 719rem;
  object-fit: contain;
  box-shadow: 0 3rem 16rem 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 15rem;
  margin: 19rem 0 41rem;

  table-layout: fixed;
`;

const TableRow = styled.div`
  height: 48rem;
  border-bottom: #e6e6e6 1rem solid;
  padding: 0 30rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TableHeader = styled.div`
  font-family: Pretendard;
  font-size: 14rem;
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
  width: 570rem;
`;

const StarHeader = styled(TableHeader)`
  width: 52rem;
`;

const DateHeader = styled(TableHeader)`
  width: 280rem;
  display: flex;
  justify-content: center;
`;

const SubjectHeader = styled(TableHeader)`
  width: 28rem;
`;

const BoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 41rem;
`;

const SmallBox = styled(HoverAnchor)`
  width: 310rem;
  height: 70rem;
  object-fit: contain;
  border-radius: 8rem;
  box-shadow: 0 3rem 16rem 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxTitle = styled.div`
  font-family: Pretendard;
  font-size: 20rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: -20rem;
  display: flex;
  align-items: center;
`;

const BoxImage = styled.img`
  width: 40rem;
  margin-right: 10rem;
`;

export default FolderPage;
