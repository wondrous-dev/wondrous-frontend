import { Grid, Typography } from "@mui/material";
import { useCSVReader, formatFileSize } from "react-papaparse";
import DocumentIcon from "./DocumentIcon";
import { DropZone } from "./styles";
import { redColors } from "utils/theme/colors";
import { useEffect } from "react";

interface Props {
  handleFileUpload: (results) => void;
  handleFileRemove?: () => void;
  dropText?: string;
  isDisabled?: boolean;
  setFilename?: (filename) => void;
  setError?: (errorMessage) => void;
}

const CSVFileDropzone = (props: Props) => {
  const {
    handleFileUpload,
    handleFileRemove,
    dropText = "Drop CSV file here or click to upload",
    isDisabled = false,
    setFilename = false,
    setError = null,
  } = props;
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        // clean data
        const cleanedResults = [];
        results?.data?.forEach((result) => {
          if (result?.length !== 1) {
            setError("CSV format does not match with the given format");
          }
          const splitResult = result[0].split("\n");
          splitResult.forEach((res) => {
            cleanedResults.push([res]);
          });
        });
        handleFileUpload(cleanedResults);
      }}
      noDrag={isDisabled}
      noClick={isDisabled}
      skipEmptyLines
    >
      {({ getRootProps, acceptedFile, getRemoveFileProps, Remove }) => {
        useEffect(() => {
          if (acceptedFile?.name && setFilename) {
            setFilename(`${acceptedFile?.name} ${formatFileSize(acceptedFile.size)}`);
          }
        }, [acceptedFile?.name]);
        return (
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
                    fontFamily="Poppins"
                    fontWeight={500}
                    fontSize="12px"
                    color="black"
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
                    <Remove color={redColors.red400} />
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              dropText
            )}
          </DropZone>
        );
      }}
    </CSVReader>
  );
};

export default CSVFileDropzone;
