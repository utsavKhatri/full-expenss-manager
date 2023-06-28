export const getExpensePercentageChange = (
  data: { analyticsData: any[] } | undefined
) => {
  let expensePercentageChange = 0;
  let length = data?.analyticsData.length;
  data?.analyticsData.map((account: { expensePercentageChange: number }) => {
    expensePercentageChange += account.expensePercentageChange;
  });
  // console.log(expensePercentageChange);
  return (expensePercentageChange / length!).toFixed(2);
};
export const getIncomePercentageChange = (
  data: { analyticsData: any[] } | undefined
) => {
  let incomePercentageChange = 0;
  let length = data?.analyticsData.length;
  data?.analyticsData.map((account: { incomePercentageChange: number }) => {
    incomePercentageChange += account.incomePercentageChange;
  });
  return (incomePercentageChange / length!).toFixed(2);
};
