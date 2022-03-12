import { Box, Typography, Divider } from '@material-ui/core';
import styled from 'styled-components';

const Content = styled(Box)`
  background-color: #555;
  padding: 5px;
  width: 250px;
  border-radius: 3px;
  font-family: "Space Grotesk", sans-serif;
`;

const Text = styled(Typography)`
  color: white !important;
  padding-bottom: 3px;
  font-family: "Space Grotesk", sans-serif;
`;

const Span = styled.span`
font-family: "Space Grotesk", sans-serif;
  background-color: #aaa;
  padding: 5px;
  margin-left: 5px;
  border-radius: 4px;
`;

const HLine = styled(Divider)`
height: 1px !important;
background-color: white !important;
`;

const Bold = styled.span`
  font-weight: bold !important;
`;

export { Content, Text, Span, HLine, Bold }
