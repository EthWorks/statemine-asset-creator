const COLORS_LIST = ['#E6007A', '#2DD4BF','#3b82f6', '#e4c000']
  
export const drawColor = ():string => {
  const colorNumber = Math.floor(Math.random() * (COLORS_LIST.length))

  return COLORS_LIST[colorNumber]
}
