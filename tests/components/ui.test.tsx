import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeverityBadge, StatusBadge } from "@/components/status/badges";
import { AccessDeniedState } from "@/components/layout/page-states";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DataTable } from "@/components/tables/data-table";

describe("Status badge", () => {
  it("renders severity with text label", () => {
    render(<SeverityBadge level="critical" locale="en" />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<StatusBadge status="approved" label="Approved" />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
});

describe("Access denied", () => {
  it("shows denied message", () => {
    render(<AccessDeniedState locale="en" />);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });
});

describe("Dashboard card", () => {
  it("renders title and demo badge", () => {
    render(
      <DashboardCard locale="en" title="My Tasks">
        <p>Task list</p>
      </DashboardCard>,
    );
    expect(screen.getByText("My Tasks")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });
});

describe("Data table", () => {
  it("renders rows and supports search label", () => {
    render(
      <DataTable
        caption="Demo table"
        rows={[
          { id: "1", cells: { title: "Alpha" } },
          { id: "2", cells: { title: "Beta" } },
        ]}
        columns={[{ id: "title", header: "Title" }]}
      />,
    );
    expect(screen.getByLabelText("Search table")).toBeInTheDocument();
    expect(screen.getAllByText("Alpha").length).toBeGreaterThan(0);
  });
});
