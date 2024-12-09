type CctSummaryType = {
  id: string;
  name: string;
  programmeMembershipId: string;
  created: Date | string;
  lastModified: Date | string;
};

export const cctSummaryList: CctSummaryType[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "UserChosenName1",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174001",
    created: "2023-01-01T00:00:00Z",
    lastModified: "2023-01-02T00:00:00Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    name: "UserChosenName2",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174003",
    created: "2023-02-01T00:00:00Z",
    lastModified: "2023-02-02T00:00:00Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    name: "UserChosenName3",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174005",
    created: "2023-03-01T00:00:00Z",
    lastModified: "2023-03-02T00:00:00Z"
  }
];
