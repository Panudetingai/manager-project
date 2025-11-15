import { unsplash } from "@/lib/unsplash"; // ปรับ path ตามจริง
import { tool } from "ai";
import z from "zod";

export const CreatePostAgent = tool({
  name: "create_post_agent",
  description: `
    Use this tool to generate an array of blog posts.
    Each post should include a title, content, category, provider, and optionally an array of image URLs.
  `,
  inputSchema: z.object({
    posts: z
      .array(
        z.object({
          images: z.array(z.string().url()).optional(),
          title: z.string().min(5).max(100),
          content: z.string().min(20),
          category: z.string().min(3).max(50),
          provider: z
            .string()
            .min(1)
            .describe("The AI provider used to generate the post"),
        })
      )
      .max(2),
  }),
  execute: async ({ posts }) => {
    const imagesPerPost = 3;
    const totalImages = posts.length * imagesPerPost;

    const images_ = await unsplash.search.getPhotos({
      query: posts.map((p) => p.category || p.title).join(", "),
      perPage: totalImages,
      page: 1,
    });
    const allImages: string[] =
      images_.response?.results.map((photo) => photo.urls.small) || [];

    const results = posts.map((post, index) => {
      const startIdx = index * imagesPerPost;
      const endIdx = startIdx + imagesPerPost;
      return {
        ...post,
        images: allImages.slice(startIdx, endIdx),
      };
    });
    return results;
  },
});
