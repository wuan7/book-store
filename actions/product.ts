export const getProducts = async () => {
    try {
        const response = await fetch(`/api/product/default`, {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductsWithPagination = async (page: number, limit: number, sort: string, category?: string) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort,
          });
        
          if (category && category !== "default") {
            params.append("category", category);
          }
          const response = await fetch(`/api/product?${params.toString()}`, {
            cache: "force-cache",
          });
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProduct = async (id: string) => {
    try {
        const response = await fetch(`/api/product/${id}`, {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

export const getImagesProductByBookId = async (id: string) => {
    try {
        const response = await fetch(`/api/product/image/${id}`, {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}