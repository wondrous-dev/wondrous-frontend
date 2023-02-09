import React from 'react';
import { TComboboxItem } from '@udecode/plate-combobox';

import { HeaderIcon } from 'components/RichText/icons/HeaderIcon';
import AddImageIcon from 'components/RichTextPlate/icons/AddImageIcon';
import AddQuoteIcon from 'components/RichTextPlate/icons/AddQuoteIcon';
import BoldIcon from 'components/RichTextPlate/icons/BoldIcon';
import BulletedListIcon from 'components/RichTextPlate/icons/BulletedListIcon';
import ItalicIcon from 'components/RichTextPlate/icons/ItalicIcon';
import LinkIcon from 'components/RichTextPlate/icons/LinkIcon';
import NumberedListIcon from 'components/RichTextPlate/icons/NumberedListIcon';
import StrikethroughIcon from 'components/RichTextPlate/icons/StrikethroughIcon';
import UnderlineIcon from 'components/RichTextPlate/icons/UnderlineIcon';
import { ElementTypes } from 'components/RichTextPlate/types';

export const slashCommandItems: TComboboxItem<any>[] = [
  {
    key: ElementTypes.ELEMENT_H1,
    text: 'Heading 1',
    data: { icon: <HeaderIcon title="H1" /> },
  },
  {
    key: ElementTypes.ELEMENT_H2,
    text: 'Heading 2',
    data: { icon: <HeaderIcon title="H2" /> },
  },
  {
    key: ElementTypes.ELEMENT_H3,
    text: 'Heading 3',
    data: { icon: <HeaderIcon title="H3" /> },
  },
  {
    key: ElementTypes.MARK_BOLD,
    text: 'Bold',
    data: { icon: <BoldIcon /> },
  },
  {
    key: ElementTypes.MARK_ITALIC,
    text: 'Italics',
    data: { icon: <ItalicIcon /> },
  },
  {
    key: ElementTypes.MARK_UNDERLINE,
    text: 'Underline',
    data: { icon: <UnderlineIcon /> },
  },
  {
    key: ElementTypes.MARK_STRIKETHROUGH,
    text: 'Strikethrough',
    data: { icon: <StrikethroughIcon /> },
  },
  {
    key: ElementTypes.ELEMENT_UL,
    text: 'Bulletted List',
    data: { icon: <BulletedListIcon /> },
  },
  {
    key: ElementTypes.ELEMENT_OL,
    text: 'Numbered List',
    data: { icon: <NumberedListIcon /> },
  },
  {
    key: ElementTypes.ELEMENT_LINK,
    text: 'Add Link',
    data: { icon: <LinkIcon /> },
  },
  {
    key: ElementTypes.ELEMENT_IMAGE,
    text: 'Add Image',
    data: { icon: <AddImageIcon /> },
  },
  {
    key: ElementTypes.ELEMENT_BLOCKQUOTE,
    text: 'Add Quote',
    data: { icon: <AddQuoteIcon /> },
  },
];
