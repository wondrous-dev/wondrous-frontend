import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
  autoformatSmartQuotes,
} from '@udecode/plate';

import { CustomAutoformatRule } from '../../types';
import { autoformatBlocks } from './autoformatBlocks';
import { autoformatLists } from './autoformatLists';
import { autoformatMarks } from './autoformatMarks';

export const autoformatRules = [
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...(autoformatSmartQuotes as CustomAutoformatRule[]),
  ...(autoformatPunctuation as CustomAutoformatRule[]),
  ...(autoformatLegal as CustomAutoformatRule[]),
  ...(autoformatLegalHtml as CustomAutoformatRule[]),
  ...(autoformatArrow as CustomAutoformatRule[]),
  ...(autoformatMath as CustomAutoformatRule[]),
];
