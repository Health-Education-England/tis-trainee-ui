const ErrorPage = (errors: any) => {
  return (
    <>
      <p data-cy="errorAction">
        Sorry, there was an error loading the data. Please refresh the page to
        try again. If it keeps happening, please contact your local office.
      </p>
      <br />
      <p>Error message(s): </p>
      <div>{JSON.stringify(errors, null, 2)}</div>
    </>
  );
};

export default ErrorPage;
