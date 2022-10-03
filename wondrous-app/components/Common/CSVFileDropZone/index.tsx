import { Grid } from '@mui/material';
import { useCSVReader, formatFileSize } from 'react-papaparse';
import palette from 'theme/palette';
import { DropZone, DropZoneFileContainer, DropZoneFileName, DropZoneFileRemoveButton, DropZoneIcon } from './styles';

interface ICSVFileDropzoneProps {
  handleFileUpload: (results) => void;
  handleFileRemove?: () => void;
  dropText?: string;
  isDisabled?: boolean;
}

const CSVFileDropzone = (props: ICSVFileDropzoneProps) => {
  const {
    handleFileUpload,
    handleFileRemove,
    dropText = 'Drop CSV file here or click to upload',
    isDisabled = false,
  } = props;
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        handleFileUpload(results?.data);
      }}
      noDrag={isDisabled}
      noClick={isDisabled}
      skipEmptyLines
    >
      {({ getRootProps, acceptedFile, getRemoveFileProps, Remove }: any) => (
        <DropZone
          {...getRootProps()}
          onDragOver={(event: DragEvent) => {
            event.preventDefault();
          }}
          onDragLeave={(event: DragEvent) => {
            event.preventDefault();
          }}
        >
          {acceptedFile ? (
            <DropZoneFileContainer>
              <DropZoneIcon />
              <Grid display="flex" alignItems="center">
                <DropZoneFileName>
                  {acceptedFile.name} ( {formatFileSize(acceptedFile.size)} )
                </DropZoneFileName>
                <DropZoneFileRemoveButton
                  {...getRemoveFileProps()}
                  onMouseOver={(event: Event) => {
                    event.preventDefault();
                  }}
                  onMouseOut={(event: Event) => {
                    event.preventDefault();
                  }}
                  onClick={(event: Event) => {
                    getRemoveFileProps().onClick(event);
                    handleFileRemove && handleFileRemove();
                  }}
                >
                  <Remove color={palette.red200} />
                </DropZoneFileRemoveButton>
              </Grid>
            </DropZoneFileContainer>
          ) : (
            dropText
          )}
        </DropZone>
      )}
    </CSVReader>
  );
};

export default CSVFileDropzone;
