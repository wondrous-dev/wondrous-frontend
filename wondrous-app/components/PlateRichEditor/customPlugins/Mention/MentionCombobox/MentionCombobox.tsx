import React from 'react';
import { Data, NoData } from '@udecode/plate-combobox';
import { getPluginOptions, usePlateEditorRef } from '@udecode/plate-core';

import { getMentionOnSelectItem, MentionPlugin } from 'components/PlateRichEditor/customPlugins/CustomMention';
import { Combobox, ComboboxProps } from 'components/PlateRichEditor/customPlugins/Combobox';
import { ElementTypes } from 'components/PlateRichEditor/types';

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
