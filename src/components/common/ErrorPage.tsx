const ErrorPage = (errors: any) => {
  return (
    <>
      <p>
        Sorry, there was an error loading the data. Please try again. If it
        keeps happening, please contact your local office.
      </p>
      <br />
      <p>"The error message is: </p>
      <div>
        {errors.map((error: any, index: number) => {
          return <p key={index}>{error}</p>;
        })}
      </div>
    </>
  );
};

export default ErrorPage;
