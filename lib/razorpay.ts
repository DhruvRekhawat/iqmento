export async function createOrderId(amount: number, currency: string = "INR"): Promise<string> {
  try {
    const response = await fetch("/api/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create order";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, try to get text
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.orderId) {
      throw new Error("Order ID not received from server");
    }
    return data.orderId;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create order");
  }
}

