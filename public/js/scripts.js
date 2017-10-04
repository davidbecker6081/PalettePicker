const palette = [];

$('.generate-btn').on('click', () => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
});

$('.submitProjectBtn').on('click', (e) => {
	e.preventDefault();
	const name = $('.addProjectInput').val()
	console.log('name', name);

	fetch('/api/projects', {
		method: 'POST',
		body: JSON.stringify({projectName: name}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		if (response.status !== 201){
			console.log('bad response')
			return false
		}
		// appendProjectName(name)
	})
	.catch(error => {
		console.log(error)
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

const addProjectToList = (name) => {

}

const appendProject = (name) => {

}

const appendProjects = projects => {
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
