const Blog = require("../models/Blog");

// GET ALL BLOGS
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs.",
    });
  }
};

// GET SINGLE BLOG BY ID
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog.",
    });
  }
};

// GET SINGLE BLOG BY SLUG
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const cleanSlug = slug.trim().toLowerCase();

    console.log("Looking for blog slug:", cleanSlug);

    const blog = await Blog.findOne({
      slug: cleanSlug,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
        reason: "No blog exists with this slug.",
        slug: cleanSlug,
      });
    }

    if (blog.published !== true) {
      return res.status(404).json({
        success: false,
        message: "Blog post is not published.",
        reason: "Set Published to ON in Admin > Blogs.",
        slug: blog.slug,
      });
    }

    if (blog.isActive !== true) {
      return res.status(404).json({
        success: false,
        message: "Blog post is inactive.",
        reason: "Set Active to ON in Admin > Blogs.",
        slug: blog.slug,
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog post.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      published,
      publishedAt,
      order,
      isActive,
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required.",
      });
    }

    const cleanSlug = slug.trim().toLowerCase();

    const existingBlog = await Blog.findOne({
      slug: cleanSlug,
    });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with this slug already exists.",
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt?.trim() || "",
      content: content.trim(),
      coverImage: coverImage || "",
      category: category || "",
      tags: Array.isArray(tags) ? tags : [],
      author: author || "",
      published: published === true,
      publishedAt:
        published === true
          ? publishedAt || new Date()
          : publishedAt || null,
      order: Number(order) || 0,
      isActive:
        isActive !== undefined
          ? isActive === true
          : true,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      published,
      publishedAt,
      order,
      isActive,
    } = req.body;

    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    let cleanSlug = existingBlog.slug;

    if (slug !== undefined) {
      cleanSlug = slug.trim().toLowerCase();

      const duplicateSlug = await Blog.findOne({
        slug: cleanSlug,
        _id: { $ne: id },
      });

      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: "A blog with this slug already exists.",
        });
      }
    }

    const nextPublished =
      published !== undefined
        ? published === true
        : existingBlog.published;

    let nextPublishedAt =
      publishedAt !== undefined
        ? publishedAt
        : existingBlog.publishedAt;

    if (nextPublished === true && !nextPublishedAt) {
      nextPublishedAt = new Date();
    }

    const updateData = {
      title:
        title !== undefined
          ? title.trim()
          : existingBlog.title,

      slug: cleanSlug,

      excerpt:
        excerpt !== undefined
          ? excerpt.trim()
          : existingBlog.excerpt,

      content:
        content !== undefined
          ? content.trim()
          : existingBlog.content,

      coverImage:
        coverImage !== undefined
          ? coverImage
          : existingBlog.coverImage,

      category:
        category !== undefined
          ? category
          : existingBlog.category,

      tags:
        tags !== undefined
          ? Array.isArray(tags)
            ? tags
            : []
          : existingBlog.tags,

      author:
        author !== undefined
          ? author
          : existingBlog.author,

      published: nextPublished,

      publishedAt: nextPublishedAt,

      order:
        order !== undefined
          ? Number(order)
          : existingBlog.order,

      isActive:
        isActive !== undefined
          ? isActive === true
          : existingBlog.isActive,
    };

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
      data: blog,
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog.",
    });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};