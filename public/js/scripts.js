// const randoPalettes = $('.gen-color');
// const generateBtn = $('.generate-btn');

$('.generate-btn').on('click', () => {
  populateColorObj(generateHexValues(5));
});

const generateHexValues = num => {
	let hexValues = [];
	for (let i = 0; i < num; i++) {
		hexValues.push('#' + ((Math.random() * 0xffffff) << 0).toString(16));
	}
	return hexValues;
};

// console.log(generateHexValues(5));

const populateColorObj = hexArray => {
	const palette = {
    color1: '',
    color2: '',
    color3: '',
    color4: '',
    color5: '',
  }

  Object.keys(palette).map((key, i) => {
    palette[key] = hexArray[i]
  })
};

const populateColorSwatch = (paletteObj) => {
  const randoPalettes = $('.gen-color');
}
