export default {
  name: "carouselSettings",
  title: "Carousel Settings",
  type: "document",
  fields: [
    {
      name: "autoplay_enabled",
      title: "Autoplay Enabled",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "autoplay_interval",
      title: "Autoplay Interval (ms)",
      type: "number",
      initialValue: 5000,
    },
  ],
};
