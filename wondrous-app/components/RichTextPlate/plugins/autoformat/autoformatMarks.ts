import { ElementTypes, CustomAutoformatRule } from '../../types';

export const autoformatMarks: CustomAutoformatRule[] = [
  {
    mode: 'mark',
    type: [ElementTypes.MARK_BOLD, ElementTypes.MARK_ITALIC],
    match: '***',
  },
  {
    mode: 'mark',
    type: [ElementTypes.MARK_UNDERLINE, ElementTypes.MARK_ITALIC],
    match: '__*',
  },
  {
    mode: 'mark',
    type: [ElementTypes.MARK_UNDERLINE, ElementTypes.MARK_BOLD],
    match: '__**',
  },
  {
    mode: 'mark',
    type: [ElementTypes.MARK_UNDERLINE, ElementTypes.MARK_BOLD, ElementTypes.MARK_ITALIC],
    match: '___***',
  },
  {
    mode: 'mark',
    type: ElementTypes.MARK_BOLD,
    match: '**',
  },
  {
    mode: 'mark',
    type: ElementTypes.MARK_UNDERLINE,
    match: '__',
  },
  {
    mode: 'mark',
    type: ElementTypes.MARK_ITALIC,
    match: '*',
  },
  {
    mode: 'mark',
    type: ElementTypes.MARK_ITALIC,
    match: '_',
  },
  {
    mode: 'mark',
    type: ElementTypes.MARK_STRIKETHROUGH,
    match: '~~',
  },
];
