import { Box, Button, Dialog, TextareaAutosize, Typography, Divider } from '@mui/material';
import styled from 'styled-components';
import { CreateLayoutsModal } from 'components/CreateEntity/styles';
import { Button as SubmitButton } from '../button';
import { ModalCloseButton } from '../ModalCloseButton';

export const ModalBody = styled(CreateLayoutsModal)`
  && {
    width: auto;
    max-width: 600px;
  }
`;

// export const KudosFormModal = styled(Dialog)`
//   width: 100%;
//   background: transparent;
// `;

// export const KudosFormBorder = styled(Box)`
//   background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.5) 7.84%, rgba(35, 35, 35, 0.5) 108.71%);
//   padding: 1px;
//   border-radius: 6px;
// `;

// export const KudosFormBackground = styled(Box)`
//   background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
//   padding: 24px;
//   border-radius: inherit;
// `;

// export const KudosFormHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// export const KudosFormHeaderText = styled(Typography)`
//   && {
//     font-family: var(--font-space-grotesk);
//     font-size: 20px;
//     font-weight: 700;
//     color: #fff;
//   }
// `;

// export const KudosFormHeaderCloseButton = styled(ModalCloseButton)``;

// export const KudosFormDivider = styled(Divider)`
//   && {
//     background: #363636;
//     width: 100%;
//     margin-top: 24px;
//     height: 1px;
//   }
// `;

// export const KudosFormButtonWrapper = styled.div`
//   display: flex;
//   justify-content: right;
//   margin-top: 24px;
// `;

// export const KudosFormSubmitButton = styled(SubmitButton)`
//   background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
//   max-width: fit-content;
//   font-family: var(--font-space-grotesk);
//   font-size: 16px;
//   font-style: normal;
//   font-weight: 500;
// `;

// export const KudosFormSubmitButtonText = styled(Typography)`
//   && {
//     font-family: var(--font-space-grotesk);
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 500;
//     color: #ffffff;
//   }
// `;
