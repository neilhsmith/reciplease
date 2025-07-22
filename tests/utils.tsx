import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}
