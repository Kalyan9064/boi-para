const escapeRegex = (string) => {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

const buildBookQuery = (queryParams) => {
  const filter = { isSold: false };

  // 1. General Search (matches title, author, category, location, description)
  if (queryParams.q) {
    const escapedQ = escapeRegex(queryParams.q);
    filter.$or = [
      { title: { $regex: escapedQ, $options: "i" } },
      { author: { $regex: escapedQ, $options: "i" } },
      { category: { $regex: escapedQ, $options: "i" } },
      { location: { $regex: escapedQ, $options: "i" } },
      { description: { $regex: escapedQ, $options: "i" } }
    ];
  }

  // 2. Specific Field Filters
  if (queryParams.title) {
    filter.title = { $regex: escapeRegex(queryParams.title), $options: "i" };
  }
  if (queryParams.author) {
    filter.author = { $regex: escapeRegex(queryParams.author), $options: "i" };
  }
  if (queryParams.category) {
    filter.category = queryParams.category;
  }
  if (queryParams.condition) {
    filter.condition = queryParams.condition;
  }
  if (queryParams.location) {
    filter.location = { $regex: escapeRegex(queryParams.location), $options: "i" };
  }
  if (queryParams.seller) {
    filter.seller = queryParams.seller;
  }

  // 3. Price Range Filter
  if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
    filter.price = {};
    if (queryParams.minPrice !== undefined && queryParams.minPrice !== "") {
      const min = Number(queryParams.minPrice);
      if (!isNaN(min)) {
        filter.price.$gte = min;
      }
    }
    if (queryParams.maxPrice !== undefined && queryParams.maxPrice !== "") {
      const max = Number(queryParams.maxPrice);
      if (!isNaN(max)) {
        filter.price.$lte = max;
      }
    }
    // Clean up empty price filters
    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }
  }

  // 4. Sorting
  let sort = { createdAt: -1 }; // Default: Newest first
  if (queryParams.sort) {
    if (queryParams.sort === "price_asc") {
      sort = { price: 1 };
    } else if (queryParams.sort === "price_desc") {
      sort = { price: -1 };
    } else if (queryParams.sort === "newest") {
      sort = { createdAt: -1 };
    } else if (queryParams.sort === "oldest") {
      sort = { createdAt: 1 };
    }
  }

  // 5. Pagination Specs
  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.max(1, parseInt(queryParams.limit) || 9);
  const skip = (page - 1) * limit;

  return { filter, sort, page, limit, skip };
};

module.exports = { buildBookQuery, escapeRegex };
