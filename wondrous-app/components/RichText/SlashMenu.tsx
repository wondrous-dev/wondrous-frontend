import { useEffect, useRef } from 'react';
import { ReactEditor, useFocused, useSlate } from 'slate-react';

import { Card, Group, Stack, Text } from '@mantine/core';
import { Range } from 'slate';
import React, { createContext } from 'react';
export const SlashMenuTargetContext = createContext(null);
export const SlashMenuIndexContext = createContext(null);
export const slashMenuSearchContext = createContext(null);

const slashMenuTargetAtom = atom<Range | null>({
  key: 'slashMenuModalAtom',
  default: null,
});
const slashMenuIndexAtom = atom<number>({
  key: 'slashMenuIndexAtom',
  default: 0,
});
const slashMenuSearchAtom = atom<string>({
  key: 'slashMenuSearchAtom',
  default: '',
});

function useSlashMenu() {
  const targetState = useRecoilState(slashMenuTargetAtom);
  const indexState = useRecoilState(slashMenuIndexAtom);
  const searchState = useRecoilState(slashMenuSearchAtom);
  return {
    targetState,
    indexState,
    searchState,
  };
}
// function SlashMenuComponent(props, ref) {
//   // const [slashMenuOpen, setSlashMenuOpen] = useRecoilState(slashMenuModalAtom);
//   const [target, setTarget] = useRecoilState(slashMenuTargetAtom);
//   const editor = useSlate();
function MenuSectionTitle({ title }: { title: string }) {
  return (
    <Text
      pl={16}
      p={8}
      weight="light"
      size="sm"
      color="gray"
      transform="uppercase"
    >
      {title}
    </Text>
  );
}
function SlashMenuSection({
  title,
  blocks,
}: {
  title: string;
  blocks: string[];
}) {
  const {
    indexState: [selectedIndex],
  } = useSlashMenu();
  return (
    <>
      <MenuSectionTitle title={title} />
      {blocks.map((blockName: string, index) => {
        const { name, description } = DocBlocks[blockName];
        return (
          <Group
            key={blockName}
            px={16}
            py={8}
            sx={{
              backgroundColor: selectedIndex === index ? '#F1F3F5' : '',
              ':hover': {
                backgroundColor: '#F1F3F5',
              },
            }}
          >
            <H1 />
            <Stack spacing={0}>
              <Text weight="bold" size="sm">
                {name}
              </Text>
              <Text size="xs">{description}</Text>
            </Stack>
          </Group>
        );
      })}
    </>
  );
}
// }
// const SlashMenu = forwardRef(SlashMenuComponent);
function SlashMenu() {
  const ref = useRef<any | null>();
  const {
    targetState: [target],
    // searchState: [search],
    // indexState: [index],
  } = useSlashMenu();
  const editor = useSlate();
  // const escRef = useHotkeys('esc', () => {
  //   setSlashMenuOpen(false);
  // });
  // const focusTrapRef = useFocusTrap();
  // const merged = useMergedRef(ref, focusTrapRef);
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }
    if (!inFocus || !el || !target) {
      // el.removeAttribute('style');
      // el.style.top = '-9999px';
      // el.style.transform = 'translate(-8000x, 0px)';
      // el.style.zIndex = -300;
      // el.style.opacity = '0';
      return;
    }

    // const domSelection = window.getSelection();
    if (target) {
      const { anchor, focus } = target;
      const sameLineTarget =
        anchor.path[0] < focus.path[0]
          ? {
              focus,
              anchor: {
                offset: 0,
                path: focus.path,
              },
            }
          : target;
      const domRange = ReactEditor.toDOMRange(editor, sameLineTarget);
      const rect = domRange.getBoundingClientRect();
      // el.style.top = `${rect.top + window.pageYOffset + 24}px`
      // el.style.left = `${rect.left + window.pageXOffset}px`
      // const domRange = domSelection?.getRangeAt(0);
      // const rect = domRange?.getBoundingClientRect() ?? {
      //   top: 0,
      //   left: 0,
      //   width: 0,
      //   height: 0,
      // };

      el.style.opacity = '1';
      el.style.transform = `translate(${
        rect.left + window.pageXOffset - 240 + 900
      }px, ${rect.top + window.pageXOffset + 32 + 900}px)`;
      // el.style.top = `${rect.top + window.pageYOffset + 32}px`;
      // el.style.left = `${rect.left + window.pageXOffset - 240}px`;
      el.style.zIndex = 100;
    }
  });

  if (!target) return null;
  return (
    <Card
      ref={ref}
      shadow="xl"
      p={0}
      sx={{
        zIndex: 300,
        position: 'absolute',
        top: '-900px',
        left: '-900px',
        width: '300px',
        height: '360px',
        overflowY: 'auto',
      }}
    >
      {BlockSections.map((section) => {
        return (
          <SlashMenuSection
            key={section.sectionName}
            title={section.sectionName}
            blocks={section.blocks}
          />
        );
      })}
    </Card>
  );
}

export {
  slashMenuTargetAtom,
  slashMenuIndexAtom,
  slashMenuSearchAtom,
  SlashMenu,
  useSlashMenu,
};
