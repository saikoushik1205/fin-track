import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Give Firestore time to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Try to read a test document to check connection
    const testRef = doc(db, "_connection_test_", "test");
    await getDoc(testRef);
    return true;
  } catch (error: any) {
    // All errors mean we should proceed anyway - Firestore handles offline mode
    // Permission denied actually means we're connected
    if (error.code === "permission-denied") {
      console.log("✅ Firestore connected (permission-denied = online)");
      return true;
    }

    if (
      error.code === "unavailable" ||
      error.message?.includes("offline") ||
      error.message?.includes("Failed to get document")
    ) {
      console.warn("⚠️ Firestore initializing or offline:", error.message);
      return false;
    }

    // Other errors - assume connected
    return true;
  }
};

export const waitForFirestoreConnection = async (
  maxRetries = 3
): Promise<boolean> => {
  // Initial delay to let Firestore initialize
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < maxRetries; i++) {
    const isConnected = await checkFirestoreConnection();
    if (isConnected) {
      return true;
    }

    if (i < maxRetries - 1) {
      const delay = 300; // Shorter delay
      console.log(
        `Retrying Firestore connection in ${delay}ms... (${
          i + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.warn("⚠️ Firestore connection check timed out, proceeding anyway...");
  // Return true anyway - Firestore will sync when online
  return true;
};
