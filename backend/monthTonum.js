const monthMap = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
}
const ReversemonthMap = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC',
}

const columnMap ={
  ServiceID: 'ct.service_id',
  OwnerName: 'u.name',
  VehicleNo: 'vi.vehicleno',
  MechanicName: 'ct.mechanic_name',
  RepairType: 'sc.repair.type',
  RepairCost: 'sc.repair.cost',
  WashType: 'sc.wash.type',
  WashCost:'sc.wash.cost',
  ServiceDate: `to_char(tc.service_date,'yyyy-mm-dd')`,
  LaborHours: 'sc.labor_hours',
  Status: 'sc.completed',
  TotalCost: 'ct.servicing_cost',
  StartDate: `to_char(tc.service_date,'yyyy-mm-dd')`,
  FinalDate: `to_char(lc.final_date,'yyyy-mm-dd')`,
  OdometerRead: 'lc.odometer_reading',
  MaintCategory: 'lc.maintenance_category',
  InsProvider: 'lc.insurance_provider',
  InsExpDate: `to_char(lc.insurance_exp_date,'yyyy-mm-dd')`,
}

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate()
}

module.exports = { getDaysInMonth, ReversemonthMap, monthMap ,columnMap}
