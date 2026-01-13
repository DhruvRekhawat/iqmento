import axios from "axios";

// MSG91 credentials - matching the original code provided
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || "395515AXkDp29FHEDx69637a16P1";
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || "69637ae8ac5de15414632582";

export async function sendOtp({ otp, number }: { otp: string; number: string }): Promise<{ success: boolean; error?: string }> {
  try {
    // Format: mobiles should be "91" + 10-digit number (as per original code)
    const formattedPhone = `91${number}`;
    
    const data = JSON.stringify({
      template_id: MSG91_TEMPLATE_ID,
      sender: "CLGCNT",
      short_url: "0",
      mobiles: formattedPhone,
      OTP: otp,
    });

    console.log("Sending OTP via MSG91:", {
      requestData: {
        template_id: MSG91_TEMPLATE_ID,
        sender: "CLGCNT",
        short_url: "0",
        mobiles: formattedPhone,
        OTP: otp,
      },
      authKey: MSG91_AUTH_KEY.substring(0, 10) + "...", // Show partial key for security
      url: "https://control.msg91.com/api/v5/flow/",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://control.msg91.com/api/v5/flow/",
      headers: {
        accept: "application/json",
        authkey: MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
      data: data,
      timeout: 10000, // 10 second timeout
    };

    console.log("📤 MSG91 Request Details:", {
      url: config.url,
      method: config.method,
      headers: {
        accept: config.headers.accept,
        authkey: config.headers.authkey?.substring(0, 15) + "...",
        contentType: config.headers["content-type"],
      },
      body: JSON.parse(data),
    });

    const response = await axios.request(config);
    
    console.log("📥 MSG91 API Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      dataType: typeof response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
    });
    
    // MSG91 API typically returns success in different formats
    // Check for common success indicators based on MSG91 documentation
    const responseData = response.data;
    const hasRequestId = responseData?.request_id || responseData?.RequestID || responseData?.requestId;
    const hasTypeSuccess = responseData?.type === "success" || responseData?.Type === "success";
    const hasMessageSuccess = 
      responseData?.message?.toLowerCase().includes("success") ||
      responseData?.Message?.toLowerCase().includes("success");
    const isStringSuccess = typeof responseData === "string" && 
      (responseData.toLowerCase().includes("success") || responseData.includes("request_id"));
    const isArrayWithData = Array.isArray(responseData) && responseData.length > 0;
    
    const isSuccess = 
      response.status === 200 && (
        hasRequestId ||
        hasTypeSuccess ||
        hasMessageSuccess ||
        isStringSuccess ||
        isArrayWithData ||
        // Sometimes MSG91 returns just a request_id string
        (typeof responseData === "string" && /^[a-zA-Z0-9]+$/.test(responseData))
      );
    
    if (isSuccess) {
      // Decode the message field if it looks like hex
      const requestId = hasRequestId || responseData?.message || responseData;
      if (typeof requestId === "string" && /^[0-9a-f]+$/i.test(requestId) && requestId.length > 10) {
        // Try to decode hex to see if it's a readable request ID
        try {
          const decoded = Buffer.from(requestId, "hex").toString("utf-8");
          console.log("✅ SMS sent successfully via MSG91", {
            requestId: requestId,
            decodedMessage: decoded,
            responseType: typeof responseData,
            fullResponse: responseData,
          });
        } catch {
          console.log("✅ SMS sent successfully via MSG91", {
            requestId: requestId,
            responseType: typeof responseData,
            fullResponse: responseData,
            note: "Message field appears to be hex-encoded request ID",
          });
        }
      } else {
        console.log("✅ SMS sent successfully via MSG91", {
          requestId: requestId,
          responseType: typeof responseData,
          fullResponse: responseData,
        });
      }
      return { success: true };
    }
    
    // Log the actual response for debugging
    console.warn("⚠️ MSG91 response doesn't indicate success:", {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      dataType: typeof responseData,
      checks: {
        hasRequestId,
        hasTypeSuccess,
        hasMessageSuccess,
        isStringSuccess,
        isArrayWithData,
      },
    });
    
    // Extract error message from various possible formats
    let errorMessage = "Failed to send OTP";
    if (responseData?.message) {
      errorMessage = responseData.message;
    } else if (responseData?.error) {
      errorMessage = responseData.error;
    } else if (responseData?.Message) {
      errorMessage = responseData.Message;
    } else if (typeof responseData === "string") {
      errorMessage = responseData;
    } else if (responseData) {
      errorMessage = JSON.stringify(responseData);
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  } catch (error: any) {
    console.error("❌ SMS Error Details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
      isAxiosError: error.isAxiosError,
      isNetworkError: error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "ETIMEDOUT",
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to send OTP";
    if (error.code === "ECONNREFUSED") {
      errorMessage = "Cannot connect to MSG91 API. Check your internet connection or firewall settings.";
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "MSG91 API host not found. Check the API endpoint URL.";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Request to MSG91 API timed out.";
    } else if (error.response?.status === 401) {
      errorMessage = "MSG91 authentication failed. Check your auth key.";
    } else if (error.response?.status === 400) {
      errorMessage = `MSG91 API error: ${error.response?.data?.message || JSON.stringify(error.response?.data)}`;
    } else if (error.response?.data) {
      errorMessage = `MSG91 API error: ${JSON.stringify(error.response.data)}`;
    } else {
      errorMessage = error.message || "Failed to send OTP";
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
