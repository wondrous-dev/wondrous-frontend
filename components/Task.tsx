import * as React from 'react';
import { TextInput, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <SafeAreaView style={styles.ListItem}>
      <TextInput value={title} editable={false} />
    </SafeAreaView>
  );
}