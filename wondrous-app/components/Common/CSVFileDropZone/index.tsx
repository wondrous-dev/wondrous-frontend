import { Grid, Typography } from '@mui/material';
import { useCSVReader, formatFileSize } from 'react-papaparse';
import DocumentIcon from 'components/Icons/DocumentIcon';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { DropZone } from './styles';

interface Props {
  handleFileUpload: (results) => void;
  handleFileRemove?: () => void;
  dropText?: string;
  isDisabled?: boolean;
}

const CSVFileDropzone = (props: Props) => {
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
      {({ getRootProps, acceptedFile, getRemoveFileProps, Remove }) => (
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
            <Grid
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="12px"
              position="relative"
            >
              <DocumentIcon width="36px" height="36px" />
              <Grid display="flex" alignItems="center">
                <Typography
                  fontFamily={typography.fontFamily}
                  fontWeight={500}
                  fontSize="12px"
                  color={palette.white}
                  bgcolor={palette.grey850}
                  padding="2px 8px"
                  borderRadius="60px"
                >
                  {acceptedFile.name} ( {formatFileSize(acceptedFile.size)} )
                </Typography>
                <Grid
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginLeft="6px"
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
                </Grid>
              </Grid>
            </Grid>
          ) : (
            dropText
          )}
        </DropZone>
      )}
    </CSVReader>
  );
};

export default CSVFileDropzone;
