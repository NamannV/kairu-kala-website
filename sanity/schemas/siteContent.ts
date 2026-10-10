export default {
  name: "siteContent",
  title: "Site Content Key-Value",
  type: "document",
  fields: [
    {
      name: "key",
      title: "Content Key",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "value",
      title: "Content Value (Text or JSON)",
      type: "text",
    },
    {
      name: "description",
      title: "Description / Usage Note",
      type: "string",
    },
  ],
};
