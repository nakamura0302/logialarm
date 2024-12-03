export const remindTime = [
    {id: 0, value: 1, title: 1},
    {id: 1, value: 2, title: 2},
    {id: 2, value: 5, title: 5},
    {id: 3, value: 10, title: 10},
    {id: 4, value: 15, title: 15},
    {id: 5, value: 30, title: 30},
  ];

  export const remindUnit = [
    {id: 0, value: 1, title: '分前'},
    {id: 1, value: 60, title: '時間前'},
    {id: 2, value: 1440, title: '日前'},
  ];

  export const repeatOptions = [
    { id: 1, value: [0], label: '1回のみ' },
    { id: 2, value: [-1], label: '毎日' },
    { id: 3, value: [1,2,3,4,5], label: '月〜金' },
    { id: 4, value: [], label: `カスタム` },
  ];

export const customDayOptions = [
    {id:1, value:'mon', label: '月曜日'},
    {id:2, value:'tue', label: '火曜日'},
    {id:3, value:'wed', label: '水曜日'},
    {id:4, value:'thu', label: '木曜日'},
    {id:5, value:'fri', label: '金曜日'},
    {id:6, value:'sat', label: '土曜日'},
    {id:7, value:'sun', label: '日曜日'},
  ]