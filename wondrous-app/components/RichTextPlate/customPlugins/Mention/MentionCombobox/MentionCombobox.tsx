import React from 'react';
import { Data, NoData } from '@udecode/plate-combobox';
import { getPluginOptions, usePlateEditorRef } from '@udecode/plate-core';

import { getMentionOnSelectItem, MentionPlugin } from 'components/RichTextPlate/customPlugins/CustomMention';
import { Combobox, ComboboxProps } from 'components/RichTextPlate/customPlugins/Combobox';
import { ElementTypes } from 'components/RichTextPlate/types';

export interface MentionComboboxProps<TData extends Data = NoData> extends Partial<ComboboxProps<TData>> {
  pluginKey?: string;
}

export const MentionCombobox = <TData extends Data = NoData>({
  pluginKey = ElementTypes.ELEMENT_MENTION,
  id = pluginKey,
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
