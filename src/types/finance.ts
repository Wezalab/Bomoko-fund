/* ─────────────────────────────────────────────────────────────
   Finance types — Cost Calculation, Revenue, Margin Analysis
───────────────────────────────────────────────────────────── */

/** A single fixed-cost line (equipment, infrastructure, etc.) */
export interface CostItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  /** Years the asset is used (for annual depreciation) */
  periodOfUse?: number;
  /** Resale / salvage value at end of life */
  resaleValue?: number;
}

/** A single variable labour line (Person-Day based) */
export interface LabourItem {
  id: string;
  name: string;
  /** Number of person-days */
  quantity: number;
  /** Price per person-day */
  unitPrice: number;
}

/** A revenue line (main product or by-product) */
export interface RevenueItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  type: 'product' | 'by-product';
}

export interface VariableCosts {
  inputsServices: CostItem[];
  labour: LabourItem[];
}

export interface FinancialSheet {
  _id: string;
  userId: string;
  ventureId: string;
  /** Local currency code, e.g. "NGN", "EUR", "USD" */
  currency: string;
  /** Exchange rate to USD (1 local unit = exchangeRate USD) */
  exchangeRate: number;
  fixedCosts: CostItem[];
  variableCosts: VariableCosts;
  revenueItems: RevenueItem[];
  createdAt: string;
  updatedAt: string;
}

/* ── Request shapes ── */

export interface CreateFinanceSheetRequest {
  ventureId: string;
  currency: string;
  exchangeRate: number;
  fixedCosts: CostItem[];
  variableCosts: VariableCosts;
  revenueItems: RevenueItem[];
}

export interface UpdateFinanceSheetRequest extends Partial<CreateFinanceSheetRequest> {
  id: string;
}

/* ── Computed summary (derived client-side) ── */

export interface FinanceSummary {
  totalFixedCosts: number;
  totalVariableCosts: number;
  totalCosts: number;
  grossRevenue: number;
  grossMargin: number;
  netMargin: number;
}

/* ── Helpers ── */

/** Annual depreciation for one CostItem */
export const calcDepreciation = (item: CostItem): number => {
  if (!item.periodOfUse || item.periodOfUse <= 0) return item.unitPrice * item.quantity;
  const resale = item.resaleValue ?? 0;
  return ((item.unitPrice - resale) / item.periodOfUse) * item.quantity;
};

export const calcCostItemTotal = (item: CostItem): number =>
  item.unitPrice * item.quantity;

export const calcLabourTotal = (item: LabourItem): number =>
  item.quantity * item.unitPrice;

export const calcRevenueItemTotal = (item: RevenueItem): number =>
  item.quantity * item.unitPrice;

export const computeSummary = (sheet: Omit<FinancialSheet, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): FinanceSummary => {
  const totalFixedCosts = sheet.fixedCosts.reduce(
    (acc, item) => acc + calcDepreciation(item),
    0,
  );
  const totalInputs = sheet.variableCosts.inputsServices.reduce(
    (acc, item) => acc + calcCostItemTotal(item),
    0,
  );
  const totalLabour = sheet.variableCosts.labour.reduce(
    (acc, item) => acc + calcLabourTotal(item),
    0,
  );
  const totalVariableCosts = totalInputs + totalLabour;
  const totalCosts = totalFixedCosts + totalVariableCosts;
  const grossRevenue = sheet.revenueItems.reduce(
    (acc, item) => acc + calcRevenueItemTotal(item),
    0,
  );
  const grossMargin = grossRevenue - totalVariableCosts;
  const netMargin = grossMargin - totalFixedCosts;

  return { totalFixedCosts, totalVariableCosts, totalCosts, grossRevenue, grossMargin, netMargin };
};
