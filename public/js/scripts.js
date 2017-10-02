const randoPalettes = $('.gen-color');

const generateHexValues = (num) => {
  let hexValues = []
  for(let i = 0; i < num; i++) {
    hexValues.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
  }
  return hexValues
}

console.log(generateHexValues(5))
