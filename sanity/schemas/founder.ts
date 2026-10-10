export default {
  name: "founder",
  title: "Founder / Principal Architect",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "title",
      title: "Designation / Role",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 4,
    },
    {
      name: "image",
      title: "Portrait Image URL",
      type: "string",
    },
    {
      name: "display_order",
      title: "Display Order",
      type: "number",
      initialValue: 1,
    },
    {
      name: "contact_link",
      title: "Contact / LinkedIn URL",
      type: "string",
    },
  ],
};
