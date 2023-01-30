import { Data } from '@udecode/plate-combobox';
import { createStyles } from '@udecode/plate-styled-components';
import { css } from 'styled-components';

import { ComboboxStyleProps } from './Combobox.types';
import palette from '../../../../../theme/palette';

export const getComboboxStyles = <TData extends Data>(props: ComboboxStyleProps<TData>) => {
  const item = [
    css`
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      user-select: none;

      color: ${palette.grey57};
      min-height: 28px;
      border-radius: 4px;
      padding: 0 10px;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    `,
  ];

  return createStyles({ prefixClassNames: 'Combobox', ...props }, [
    {
      root: [
        css`
          width: 300px;
          border: 1px solid ${palette.grey79};
          border-radius: 6px;
          box-shadow: 12px 10px 24px 2px rgba(16, 16, 16, 0.8);

          z-index: 1300;
          background-color: ${palette.grey910};
          margin: 0;
          padding: 8px;
          max-height: 280px;
          overflow: auto;

          &::-webkit-scrollbar {
            width: 4px;
          }

          &::-webkit-scrollbar-track {
            background: ${palette.grey910};
            margin: 6px 0;
          }

          &::-webkit-scrollbar-thumb {
            background: ${palette.grey79};
            border-radius: 4px;
          }
        `,
      ],
      item: [
        ...item,
        css`
          background: transparent;

          :hover {
            background: ${palette.black95};
          }
        `,
      ],
      highlightedItem: [
        ...item,
        css`
          background: ${palette.black95};

          :hover {
            //background: rgb(237, 235, 233);
          }
        `,
      ],
    },
  ]);
};
