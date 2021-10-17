import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import NoteData from 'components/ListData/note';
import FolderData from 'components/ListData/folder';
import { notesMode } from 'state';
import { NotesMode } from 'types';

export interface NoteFile {
  fileId: number;
  userId: number;
  folderId: number;
  fileName: string;
  createdAt: string;
  updatedAt: string;
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

interface Props {
  data: NoteResponse;
  depth: number;
  // 해당 데이터가 들어 있는 폴더를 다시 렌더
  refreshNotes: () => void;
  // 아예 루트부터 다시 렌더
  refreshRoot: () => void;
}

const ListData: FC<Props> = ({ data, depth, refreshNotes, refreshRoot }) => {
  const mode = useRecoilValue(notesMode);

  if (data.itemType === 'FILE') {
    const note = data.noteFile!;
    const oldDate =
      mode === NotesMode.Recent ? note?.updatedAt : note?.createdAt;
    const newDate = `${oldDate?.substring(0, 4)}.${oldDate?.substring(
      5,
      7
    )}.${oldDate?.substring(8, 10)}`;
    return (
      <NoteData
        key={note?.fileId}
        title={note?.fileName}
        depth={depth}
        date={newDate}
        starred={note.isImportant === 1}
        subject={note.categoryName}
        noteId={note.fileId}
        refreshNotes={refreshNotes}
      />
    );
  }

  const folder = data.noteFolder!;

  return (
    <FolderData
      key={folder.folderId}
      title={folder.folderName}
      depth={depth}
      opened={mode === NotesMode.Star}
      folderId={folder.folderId}
      refreshNotes={refreshNotes}
      refreshRoot={refreshRoot}
    />
  );
};

export default ListData;
