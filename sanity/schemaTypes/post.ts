import { defineField, defineType } from "sanity";

/**
 * One document type, two kinds of content. Field names match the seven posts
 * already in the dataset (title, slug, publishedAt, excerpt, image, tags,
 * author, body, seo) so nothing existing breaks; `kind` and `externalUrl`
 * are new and optional, so old posts read as stories until someone says
 * otherwise.
 */
export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      description: "Update: short product or company news, shows on the homepage. Story: a full post, lives on /news only.",
      options: { list: [{ title: "Update", value: "update" }, { title: "Story", value: "story" }], layout: "radio" },
      initialValue: "story",
      validation: (r) => r.required(),
    }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "One or two sentences. Keep it under 140 characters so it fits a homepage card.",
      validation: (r) => r.max(160).warning("Longer than 160 characters will clip on the homepage."),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      description: "Required for updates; the homepage cards look thin without one.",
      validation: (r) => r.custom((img, ctx) => (ctx.document?.kind === "update" && !img ? "Updates need an image." : true)),
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "author", type: "string", initialValue: "Ligo" }),
    defineField({
      name: "externalUrl",
      title: "External link",
      type: "url",
      description: "For press coverage. When set, the card links out here instead of to a post page.",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [{ title: "Bullets", value: "bullet" }],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL", validation: (r) => r.uri({ scheme: ["http", "https", "mailto"] }) }],
              },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "seo",
      type: "object",
      title: "Search preview",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "metaTitle", type: "string", title: "Title tag" }),
        defineField({ name: "metaDescription", type: "text", rows: 2, title: "Meta description" }),
      ],
    }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", kind: "kind", date: "publishedAt", media: "image" },
    prepare: ({ title, kind, date, media }) => ({
      title,
      subtitle: `${kind === "update" ? "Update" : "Story"} · ${date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "no date"}`,
      media,
    }),
  },
});
