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
    DEC: 12
};
const ReversemonthMap = {
    1:  'JAN',
    2:  'FEB',
    3:  'MAR',
    4:  'APR',
    5:  'MAY',
    6:  'JUN',
    7:  'JUL',
    8:  'AUG',
    9:  'SEP',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC'
  };

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports={getDaysInMonth,ReversemonthMap,monthMap};