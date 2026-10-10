export default {
  name: "contactInquiry",
  title: "Contact Inquiries",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Client / Inquirer Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },
    {
      name: "typology",
      title: "Project Typology",
      type: "string",
    },
    {
      name: "estimated_budget",
      title: "Estimated Budget",
      type: "string",
    },
    {
      name: "site_location",
      title: "Proposed Site Location",
      type: "string",
    },
    {
      name: "message",
      title: "Inquiry Message",
      type: "text",
    },
    {
      name: "status",
      title: "Inquiry Status",
      type: "string",
      options: {
        list: [
          { title: "New / Unread", value: "unread" },
          { title: "In Discussion", value: "contacted" },
          { title: "Archived", value: "archived" },
        ],
      },
      initialValue: "unread",
    },
    {
      name: "created_at",
      title: "Submission Date",
      type: "datetime",
    },
  ],
};
