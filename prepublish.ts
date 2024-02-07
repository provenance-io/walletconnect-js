import { writeFileSync } from 'node:fs';
import packageJson from './package.json';

const { publishConfig, name, version, ...rest } = packageJson;

writeFileSync(
  new URL('package.json', import.meta.url),
  JSON.stringify({ name, version, ...publishConfig, ...rest }, null, 2)
);
