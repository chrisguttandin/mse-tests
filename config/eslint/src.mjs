import { defineConfig, globalIgnores } from 'eslint/config';
import config from 'eslint-config-holy-grail';
import globals from 'globals';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
    globalIgnores(['src/assets/audio.ts']),
    {
        extends: [config],
        languageOptions: {
            globals: { ...globals.browser }
        }
    }
]);
