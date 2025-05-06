
export const getPostById = async (id: string) => {
    const res = await fetch(`/api/post/${id}`, {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay bai viet");
    return res.json();
}

export const getPosts = async () => {
    const res = await fetch("/api/post", {
        cache: "no-cache",
    });
    if (!res.ok) throw new Error("Loi lay danh sach bai viet");
    return res.json();
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