import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";

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

// Npte: had to put this command here rather than commands.ts because of webpack compilaton error on e2e test run (this cmd is only required for CT'ing).

Cypress.Commands.add("mountRouterComponent", (component, route) => {
  const wrapped = (
    <MemoryRouter initialEntries={[route]}>
      <RenderSearchParams />
      {component}
    </MemoryRouter>
  );

  return mount(wrapped);
});
