type FieldErrorInlineProps = {
  fieldError: string;
  fieldName: string;
};

export default function FieldErrorInline({
  fieldError,
  fieldName
}: Readonly<FieldErrorInlineProps>) {
  return (
    <div
      className="nhsuk-error-message"
      data-cy={`${fieldName}-inline-error-msg`}
    >
      {fieldError}
    </div>
  );
}
