export const getCategories = async () => {
    try {
        const response = await fetch("/api/category", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const getPostCategories = async () => {
    try {
        const response = await fetch("/api/category/post", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const getPostCategoriesWithPagination = async (page: number, limit: number, sort: string, category?: string) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort,
          });
        
          if (category && category !== "default") {
            params.append("category", category);
          }
          const response = await fetch(`/api/post/category?${params.toString()}`, {
            cache: "force-cache",
          });
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}