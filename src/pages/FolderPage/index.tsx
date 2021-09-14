import React, { FC, useState, useCallback, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

import BaseLayout from 'components/BaseLayout';
import ListData from 'components/ListData/list';
import ContextMenu from 'components/ContextMenu';

import Check from 'assets/icons/Check.svg';
import SortToggleDown from 'assets/icons/SortToggleDown.svg';
import NewFolder from 'assets/icons/NewFolder.svg';
import Star from 'assets/icons/Star.svg';
import Clock from 'assets/icons/Clock.svg';
import TrashCan from 'assets/icons/TrashCan.svg';

axios.defaults.baseURL = 'http://api.visionnote.io';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export interface NoteFile {
  fileId: number;
  userId: number;
  folderId: number;
  fileName: string;
  createdAt: string;
  updatedAt: string | null;
  categoryName: string;
  isImportant: number;
}

export interface NoteFolder {
  folderId: number;
  parentFolderId: number;
  folderName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  itemType: string;
  noteFile: NoteFile | null;
  noteFolder: NoteFolder | null;
}

interface Props {}

const FolderPage: FC<Props> = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<number>(0);
  // const [data, setData] = useState<any[]>([]);
  const [notes, setNotes] = useState<ReactNode>(<></>);

  useEffect(() => {
    let token: string;
    const authenticate = async () => {
      const frm = new FormData();
      frm.append('email', 'hyesoo5115@naver.com');
      frm.append('password', '1q2w3e4r');
      try {
        const response = await axios.post('/v1/authenticate', frm);
        token = response.data.token;
        console.log(token);
      } catch (e) {
        console.log('authenticate error');
      }
    };
    // authenticate();
    const getRootItems = async () => {
      const token =
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTYzMTY3MDkwOH0.gJr_2Y0LEBwS5k26hg1uoEfgdQjHigFxHLbStZH95WYP1rlQraMRdGmGGZz0ULm9sBaO84AemaftQuCmZsV9IQ';
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('/v1/note/folder/root', config);
      console.log(response.data.items);
      const data: NoteResponse[] = response.data.items;
      setNotes(
        data.map((value, index) => (
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

    // authenticate().then(() => {
    //   getRootItems();
    // });
    getRootItems();
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, noteId) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShow(true);
      setNoteId(noteId);
    },
    [setAnchorPoint, setShow]
  );

  // const notes: ReactNode = data.map((value, index) => (
  //   <ListData
  //     key={`${value.itemType}.${
  //       value.noteFile ? value.noteFile!.fileId : value.noteFolder!.folderId
  //     }`}
  //     data={value}
  //     depth={0}
  //     menu={handleContextMenu}
  //   />
  // ));

  return (
    <BaseLayout grey>
      <Root>
        <Top>
          내 학습 노트
          <ButtonWrapper>
            <Button>
              <FolderImage src={NewFolder} />
              <ButtonName>새폴더</ButtonName>
            </Button>
            <Button>
              <ButtonImage src={Check} />
              <ButtonName>파일 선택하기</ButtonName>
            </Button>
            <Button>
              <Sort>정렬 기준</Sort>
              <ButtonImage src={SortToggleDown} />
            </Button>
          </ButtonWrapper>
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
          <SmallBox>
            <BoxTitle>
              <BoxImage src={Star} />
              중요 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox>
            <BoxTitle>
              <BoxImage src={Clock} />
              최근 노트함
            </BoxTitle>
          </SmallBox>
          <SmallBox>
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

// const SampleData = [
//   {
//     itemType: 'FILE',
//     noteFile: {
//       file_id: 1,
//       user_id: 3,
//       folder_id: 1,
//       file_name: '지구과학 첫걸음',
//       created_at: '2021-08-03 13:16:40.0',
//       updated_at: '2021-08-03 13:16:40.0',
//     },
//     noteFolder: null,
//   },
//   {
//     itemType: 'FILE',
//     noteFile: {
//       file_id: 2,
//       user_id: 3,
//       folder_id: 1,
//       file_name: '지구과학 두걸음',
//       created_at: '2021-08-05 13:16:41.0',
//       updated_at: '2021-08-05 13:16:41.0',
//     },
//     noteFolder: null,
//   },
//   {
//     itemType: 'FOLDER',
//     noteFile: null,
//     noteFolder: {
//       folder_id: 2,
//       user_id: 3,
//       parent_folder_id: 1,
//       folder_name: '2021년 1학기',
//       created_at: '2021-08-03 13:16:02.0',
//       updated_at: '2021-08-03 13:16:02.0',
//     },
//   },
//   {
//     itemType: 'FOLDER',
//     noteFile: null,
//     noteFolder: {
//       folder_id: 3,
//       user_id: 3,
//       parent_folder_id: 1,
//       folder_name: '2020년 2학기',
//       created_at: '2021-08-03 13:16:02.0',
//       updated_at: '2021-08-03 13:16:02.0',
//     },
//   },
//   {
//     itemType: 'FOLDER',
//     noteFile: null,
//     noteFolder: {
//       folder_id: 4,
//       user_id: 3,
//       parent_folder_id: 1,
//       folder_name: '2019년 1학기',
//       created_at: '2021-08-03 13:16:02.0',
//       updated_at: '2021-08-03 13:16:02.0',
//     },
//   },
// ];

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
