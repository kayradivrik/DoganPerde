import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Dogan Perde Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hrhbxh34',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio', // Critical for embedded studio routing!

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
