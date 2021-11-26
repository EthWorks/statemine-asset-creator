export const handleRandomColor = ():string => {
  const COLORS_LIST = ['#E6007A', '#2DD4BF','#3b82f6', '#e4c000']

  const colorNumber = Math.floor(Math.random() * (COLORS_LIST.length - 0)) + 0

  return COLORS_LIST[colorNumber]
}
