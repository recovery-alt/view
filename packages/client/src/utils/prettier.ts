import { format as rawFormat } from 'prettier/standalone';
import babel from 'prettier/plugins/babel';
import estree from 'prettier/plugins/estree';
import type { BuiltInParserName } from 'prettier';

export const format = (text: string, parser: BuiltInParserName = 'json') =>
  rawFormat(text, { parser, plugins: [estree, babel] });
