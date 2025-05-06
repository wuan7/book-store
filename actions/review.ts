export const getReviewsByProductId = async (productId: string) => {
  try {
    const res = await fetch(`/api/review/product/${productId}`, {
      cache: "force-cache",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
