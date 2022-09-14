import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, MenuItem, Select } from '@mui/material';
import EllipsesIcon from 'components/Icons/ellipsesIcon';
import styled from 'styled-components';
import palette from 'theme/palette';

export const CoordinapeIntegrationFormWrapper = styled.div`
  background: ${palette.grey900};
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  width: 490px;
`;

export const CoordinapeIntegrationFormContent = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CoordinapeIntegrationFormContentSection = styled(CoordinapeIntegrationFormContent)`
  && {
    width: 100%;
    padding: 0;
  }
`;

export const CoordinapeIntegrationFormExpandedViewWrapper = styled(Accordion)`
  && {
    background: ${palette.grey900};
    margin-top: ${(props) => (props.expanded ? 0 : '-26px')};

    & .MuiAccordion-region {
      display: flex;
      flex-direction: column;
      box-shadow: none;
    }

    & .MuiAccordionDetails-root {
      padding: 0;
    }

    &.MuiPaper-root {
      width: 100%;
    }

    &.MuiPaper-root.MuiAccordion-root {
      box-shadow: none;
    }

    &.MuiPaper-root::before {
      display: none;
    }
  }
`;

export const CoordinapeIntegrationFormExpandedViewInvisibleState = styled(AccordionSummary)`
  && {
    display: none;
  }
`;

export const CoordinapeIntegrationFormExpandedViewContent = styled(AccordionDetails)``;

export const CoordinapeIntegrationFormContentSectionSeperator = styled.div`
  height: 1px;
  width: 100%;
  background: ${palette.grey79};
  margin: 24px 0;
`;

export const Ellipses = styled(EllipsesIcon)`
  transform: rotate(90deg);
`;

const StyledSelect = styled(Select)`
  && {
    background: transparent;
    color: ${palette.white};
    width: 100%;
    border-radius: 6px;
    border: 1px solid ${palette.grey79};
    transition: border 0.2s ease-out;
    margin-top: 12px;

    :hover {
      border: 1px solid ${palette.grey60};
    }

    svg {
      color: ${(props) => (props.isActive ? palette.white : palette.grey58)};
      transition: transform 0.2s ease-out;
      display: ${(props) => (props.showIcon ? 'block' : 'none')};
    }

    p {
      margin: 0;
    }

    > div {
      padding: 8px;
    }
  }
`;

export const CoordinapeIntegrationFormSelect = styled(({ className, showIcon = true, ...props }) => (
  <StyledSelect
    {...props}
    {...className}
    MenuProps={{ classes: { paper: className } }}
    isActive={!!props.value?.value}
    showIcon={showIcon}
  />
))`
  &.MuiPaper-root {
    background: ${palette.grey77};
    width: 100%;
    max-width: 344px;
    max-height: 180px;
    color: ${palette.white};
  }

  &.MuiPaper-root > .MuiList-root {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 4px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${palette.grey10};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${palette.grey50};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${palette.grey76};
  }
`;

export const CoordinapeIntegrationFormSelectMenuItem = styled(MenuItem)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${palette.grey87};
    color: ${palette.white};
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    font-size: 12px;
    transition: background 0.2s ease-out;

    :hover {
      background: ${palette.black92};
    }
  }
`;

export const CoordinapeIntegrationFormSelectChip = styled(Chip)`
  && {
    font-size: 13px;
    color: ${palette.grey40};

    span {
      padding: 10px;
    }

    svg {
      color: ${palette.grey40};
      transition: color 0.2s ease-out;

      :hover {
        color: ${palette.grey55};
      }
    }
  }
`;

export const CoordinapeIntegrationFormActions = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid ${palette.grey79};
`;

export const CoordinapeIntegrationFormAction = styled(Button)`
  && {
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    color: ${palette.white};
    background: ${({ isPrimary }) => (isPrimary ? palette.electricViolet : 'transparent')};
    border-radius: 6px;
    transition: background 0.2s ease-in-out;

    :hover {
      background: ${({ isPrimary }) => (isPrimary ? `${palette.electricViolet}BF` : palette.grey74)};
    }
  }
`;

export const CoordinapeIntegrationFormActionSeperator = styled.div`
  width: 1px;
  height: 31px;
  background: ${palette.grey79};
`;
