// const randoPalettes = $('.gen-color');
// const generateBtn = $('.generate-btn');

// array of swatch objects
// [
// {color: '', locked: false},
// {color: '', locked: false},
// {color: '', locked: false},
// {color: '', locked: false},
// {color: '', locked: false},
// ]

const palette = [];

$('.generate-btn').on('click', () => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
});

$('.submitProjectBtn').on('click', (e) => {
	e.preventDefault();
	const name = $('.addProjectInput').val()

	fetch('/api/v1/projects', {
		method: 'POST',
		body: JSON.stringify({projectName: name}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
})

$('.lock-img').on('click', e => {
	// $(e.target).toggleClass('lock-img-locked')
	toggleLock(e);
	console.log('lock', palette);
});

const toggleLock = e => {
	console.log(
		$(e.target)
			.parent('article')
			.children('p')
			.text(),
	);
	const hexValue = $(e.target)
		.parent('article')
		.children('p')
		.text();

	$(e.target).toggleClass('lock-img-locked');

	palette.forEach(swatch => {
		if (swatch.color === hexValue) {
			swatch.locked = !swatch.locked;
		}
	});
};

const generateHexValues = num => {
	let hexValues = [];
	for (let i = 0; i < num; i++) {
		hexValues.push('#' + ((Math.random() * 0xffffff) << 0).toString(16));
	}
	return hexValues;
};

const populateColorObj = hexArray => {
	for (let i = 0; i < 5; i++) {
		let swatch = {
			color: '',
			locked: false,
		};

		if (palette.length === 5 && palette[i].locked) {
			console.log(i);
			swatch.color = palette[i].color;
			swatch.locked = true;
			palette.splice(i, 1, swatch);
		} else if (palette.length === 5 && !palette[i].locked) {
			swatch.color = hexArray[i];
			palette.splice(i, 1, swatch);
		} else {
			swatch.color = hexArray[i];
			palette.push(swatch);
		}

		console.log(swatch);
	}
};

const populateColorSwatch = () => {
	// const paletteKeys = Object.keys(paletteObj);
	console.log(palette);
	$('.gen-color').each((i, swatch) => {
		let color = palette[i].color;
		$(swatch).css('background-color', color);
		$(swatch)
			.children('p')
			.text(color);
	});
};

const appendProjects = projects => {
  const projects = mockRetrieveFull()
  const projectKeys = Object.keys(projects)
  const projectDisplay = projectKeys.map((projectKey, i) => `<article class="project-container" id="projectContainer">
    <h3>${projectKey}</h3>
    <div class="palette-container" id="paletteContainer">
      <h4>Palette Name</h4>
      ${projects[projectKey].map()}
      <div class="palette-colors-container" id="paletteColors">
        <div class="palette-color" id="paletteColor"></div>
        <div class="palette-color" id="paletteColor"></div>
        <div class="palette-color" id="paletteColor"></div>
        <div class="palette-color" id="paletteColor"></div>
        <div class="palette-color" id="paletteColor"></div>
      </div>
      <button class="delete-btn" id="deleteBtn">Delete</button>
    </div>
  </article>`)

  $('.project.display').append()
};


// const retrieveProjects = () => {
	// fetch('/api/projects')
	// .then(response => {
	//   if (response.status !== 200) {
	//     return false
	//   }
	//   return response
	// })
	// .then(response => response.json())
	// .then(parsedResponse => appendProjects(parsedResponse))
// };

// fetch('/api/users', {
// 			method: 'POST',
// 			body: JSON.stringify(user),
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		})
// 			.then(response => {
// 				if (response.status !== 200) {
// 					dispatch(loginHasErred(true));
// 				} else {
// 					return response;
// 				}
// 			})
