import SEO from "../components/SEO";

function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found | GetJobAndGo"
        description="The page you are looking for does not exist."
        canonical="https://getjobandgo.com/404"
      />

      <h1>404 - Page Not Found</h1>
    </>
  );
}

export default NotFoundPage;
