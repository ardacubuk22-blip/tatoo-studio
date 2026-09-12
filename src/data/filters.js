/* ------------------------------------------------------------
   Filter taxonomy used on Style Detail pages and in Search.
   Keep option values lowercase-stable; labels are display only.
   ------------------------------------------------------------ */

export const FILTER_GROUPS = [
  {
    key: 'subject',
    label: 'Subject',
    options: ['Portrait', 'Animal', 'Flower', 'Skull', 'Nature', 'Abstract'],
  },
  {
    key: 'bodyPart',
    label: 'Body Part',
    options: ['Arm', 'Forearm', 'Hand', 'Chest', 'Back', 'Leg'],
  },
  {
    key: 'size',
    label: 'Size',
    options: ['Small', 'Medium', 'Large', 'Sleeve'],
  },
]

export const EMPTY_FILTERS = { subject: [], bodyPart: [], size: [] }
