const ErrorPage = (error: any) => {
  return (
    <>
      <h2>
        Sorry, there was an error loading the data. Please try again. If it
        keeps happening, please contact your local office.
      </h2>
      <br />
      <h3>{`The error message is: ${error}`}</h3>
    </>
  );
};

export default ErrorPage;
