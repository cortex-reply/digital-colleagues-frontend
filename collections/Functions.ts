import type { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const Functions: CollectionConfig = {
  slug: "functions",
  access: {
    read: () => true, // Public read access
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: 'waysOfWorking',
      label: 'Ways of working',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: "systemMsg",
      type: "textarea",
    },
    {
      name: "squad",
      type: "relationship",
      relationTo: "squads",
      hasMany: false
    },
    {
      name: "knowledeBase",
      type: "relationship",
      relationTo: "knowledgeBases"
    }
  ],
};
