import { FC } from 'react';

import NoteData from 'components/ListData/note';
import FolderData from 'components/ListData/folder';

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

interface Props {
  data: NoteResponse;
  depth: number;
  refreshNotes: any;
}

const ListData: FC<Props> = ({ data, depth, refreshNotes }) => {
  if (data.itemType === 'FILE') {
    const note = data.noteFile!;
    const oldDate = note?.createdAt;
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
      opened={false}
      folderId={folder.folderId}
      refreshNotes={refreshNotes}
    />
  );
};

export default ListData;
