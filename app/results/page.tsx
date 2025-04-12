// This is the Server Component for the results page.
// It handles authentication and then renders the client component for the UI.
import { stackServerApp } from "../../stack"; // Import stackServerApp for auth
import ResultsClient from "./results-client"; // Import the client component

// Server Component default export for authentication
export default async function ResultsPage() {
  // Enforce authentication before rendering the page
  // If the user is not logged in, they will be redirected.
  await stackServerApp.getUser({ or: "redirect" });

  // Render the client component that handles fetching and display
  // Suspense is handled within ResultsClient now
  return <ResultsClient />;
}