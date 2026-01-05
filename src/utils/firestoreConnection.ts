import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try to read a test document to check connection
    const testRef = doc(db, "_connection_test_", "test");
    await getDoc(testRef);
    return true;
  } catch (error: any) {
    if (
      error.code === "unavailable" ||
      error.message?.includes("offline") ||
      error.message?.includes("Failed to get document")
    ) {
      console.warn("⚠️ Firestore is offline:", error.message);
      return false;
    }
    // Other errors (like permission denied) mean we're connected
    return true;
  }
};

export const waitForFirestoreConnection = async (
  maxRetries = 5
): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    const isConnected = await checkFirestoreConnection();
    if (isConnected) {
      console.log("✅ Firestore connected");
      return true;
    }

    if (i < maxRetries - 1) {
      const delay = 500; // Fast 500ms retry
      console.log(
        `Retrying Firestore connection in ${delay}ms... (${
          i + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error("❌ Firestore connection failed after", maxRetries, "retries");
  return false;
};
