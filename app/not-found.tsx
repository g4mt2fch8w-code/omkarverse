import { ErrorLayout } from "@/components/ErrorLayout";

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="Page not found"
      message="The page you are looking for doesn't exist or may have been moved."
    />
  );
}
