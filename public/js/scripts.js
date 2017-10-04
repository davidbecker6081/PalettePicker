const palette = [];


const postProject = () => {
	const name = $('.addProjectInput').val();

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
		return response.json()
	})
	.then(result => {
		console.log(result);
		populateDropDowns(result)
	})
	.catch(error => {
		console.log(error)
	})
}

const getAllProjects = () => {
	fetch('/api/projects')
	.then(response => response.json())
	.then(results => populateDropDowns(results))
	.catch(error => console.log(error))
}

const populateDropDowns = (projects) => {
	$('.project-list').each((i, elemDisplay) => {
		projects.forEach((elemProj) => {
			$(elemDisplay).append(`<option value=${elemProj.id}>${elemProj.project_Name}</option>`)
		})
	})
}

const postPalette = () => {

	const savedPalette = {
		projectId: $('#projectList').val(),
		paletteName: $('.paletteNameInput').val(),
		colors: palette
	}

	console.log('palette', savedPalette);

	fetch('/api/palettes', {
		method: 'POST',
		body: JSON.stringify(palette),
		headers: {
			'Content-Type': 'application/json'
		}
	})
}


$(document).ready(getAllProjects)

$('.lock-img').on('click', e => {
	toggleLock(e);
});

const toggleLock = e => {
	const hexValue = $(e.target)
		.parent('article')
		.children('p')
		.text();

	$(e.target).toggleClass('lock-img-locked');
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
		if (!$(`.rando-color-${i + 1}`).children('div').hasClass('lock-img-locked')) {
			palette.splice(i, 1, hexArray[i])
		} else if ($(`.rando-color-${i + 1}`).children('div').hasClass('lock-img-locked')) {
			palette.splice(i, 1, $(`.hexColor${i + 1}`).text())
		} else {
			palette.push(hexArray[i])
		}
	}
};

const populateColorSwatch = () => {
	// const paletteKeys = Object.keys(paletteObj);
	console.log(palette);
	$('.gen-color').each((i, swatch) => {
		let color = palette[i];
		$(swatch).css('background-color', color);
		$(swatch)
			.children('p')
			.text(color);
	});
};

const appendPalettes = (projectId) => {
  const projectKeys = Object.keys(project)
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

$('.generate-btn').on('click', () => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
});

$('.submitProjectBtn').on('click', (e) => {
	e.preventDefault();
	postProject()
})

$('.submitPaletteBtn').on('click', (e) => {
	e.preventDefault();
	postPalette()
})
