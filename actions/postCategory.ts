
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