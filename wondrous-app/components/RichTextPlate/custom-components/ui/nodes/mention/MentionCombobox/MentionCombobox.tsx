import React from 'react';
import { Data, NoData } from '@udecode/plate-combobox';
import { getPluginOptions, usePlateEditorRef } from '@udecode/plate-core';

import {
  ELEMENT_MENTION,
  getMentionOnSelectItem,
  MentionPlugin,
} from 'components/RichTextPlate/custom-components/CustomMention';
import { Combobox, ComboboxProps } from 'components/RichTextPlate/custom-components/ui/combobox';

export interface MentionComboboxProps<TData extends Data = NoData> extends Partial<ComboboxProps<TData>> {
  pluginKey?: string;
  mentionables?: any;
}

export const MentionCombobox = <TData extends Data = NoData>({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  mentionables,
  ...props
}: MentionComboboxProps<TData>) => {
  const editor = usePlateEditorRef();

  const { trigger } = getPluginOptions<MentionPlugin>(editor, pluginKey);

  return (
    <Combobox
      id={id}
      trigger={trigger!}
      controlled
      onSelectItem={getMentionOnSelectItem({
        key: pluginKey,
      })}
      {...props}
    />
  );
};
