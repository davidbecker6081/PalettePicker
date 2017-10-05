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

const appendPalette = (palettes) => {
	const projectIdSelected = $('#projectDisplayList').val()
	console.log('project id', projectIdSelected, palettes[0].project_id);

	palettes.forEach((palette, i) => {
		if (palette.project_id == projectIdSelected) {
			console.log('matched');
			$('.project-container').append(`
				<div class="palette-container" id="${palette.project_id}">
          <h4 class="${palette.id}">${palette.palette_name}</h4>
          <div class="palette-colors-container" id="paletteColors">
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
          </div>
          <button class="delete-btn" id="deleteBtn"></button>
        </div>`)

				$(`.${palette.id}`).each((i, div) => {
					$(div).css('background-color', palette[`palette_color${i}`])
				})
		}
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
		body: JSON.stringify(savedPalette),
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
		console.log('palette result', result);
		appendPalette(result)
	})
	.catch(error => {
		console.log(error)
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
	$('.gen-color').each((i, swatch) => {
		let color = palette[i];
		$(swatch).css('background-color', color);
		$(swatch)
			.children('p')
			.text(color);
	});
};

$('.submitPaletteBtn').on('click', (e) => {
	e.preventDefault()
	postPalette();
})

$('.generate-btn').on('click', () => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
});

$('.submitProjectBtn').on('submit', (e) => {
	e.preventDefault();
	postProject()
})

$('.submitPaletteBtn').on('submit', (e) => {
	e.preventDefault();
	postPalette()
})
