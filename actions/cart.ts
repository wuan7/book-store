export const getCartByUser = async () => {
  try {
    const response = await fetch("/api/cart", {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
