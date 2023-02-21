import { Editable } from 'slate-react';
import styled from 'styled-components';

export const BulletedList = styled.ul`
  margin: 0;
  padding: 0 24px;

  li {
    margin: 0;
    padding: 0;
  }
`;

export const NumberedList = styled.ol`
  margin: 0;
  padding: 0 24px;

  li {
    margin: 0;
    padding: 0;
  }
`;

export const RichTextStyled = styled.div`
  font-size: 15px;
  line-height: 24px;

  a {
    color: rgb(0, 186, 255);
    text-decoration: none;

    &:hover {
      color: rgb(138, 223, 255);
    }
  }

  p {
    margin: 0;
  }
`;

export const Strikethrough = styled.span`
  text-decoration: line-through;
`;

export const StyledEditable = styled(Editable)`
  && {
    overflow-x: scroll;
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    [data-slate-placeholder='true'] {
      ${({ theme }) => `
        color: ${theme.palette.white};
        `}
    }
  }
`;
