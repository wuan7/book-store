export const getOrderById = async (id: string) => {
    try {
        const res = await fetch(`/api/order/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error("Failed to fetch order");
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}

export const getOrderByUserId = async () => {
    try {
        const res = await fetch(`/api/order/user`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error("Failed to fetch order");
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}