export type CategoryTotalRow = {
  categoryName: string;
  total: number;
};

export type TotalsByCategoryResult = {
  income: CategoryTotalRow[];
  expense: CategoryTotalRow[];
};