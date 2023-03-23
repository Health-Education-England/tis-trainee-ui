export default function RenderSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return (
    <div id="search-params">
      {Object.keys(paramsObj).map(key => (
        <span id={`${key}:${paramsObj[key]}`} />
      ))}
    </div>
  );
}
