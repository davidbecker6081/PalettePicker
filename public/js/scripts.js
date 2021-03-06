const palette = [];

// fetch calls

const deletePalette = (paletteId) => {
	fetch(`/api/palettes/${paletteId}`, {
		method: 'DELETE',
		body: JSON.stringify({paletteId}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		console.log(response.status)
	})
	.catch(error => console.log(error))
}

const getAllPalettes = (projectId) => {
	fetch(`/api/projects/${projectId}/palettes`)
		.then(response => response.json())
		.then(results => appendPalette(results))
		.catch(error => console.log(error))
}

const getAllProjects = () => {
	fetch('/api/projects')
	.then(response => response.json())
	.then(results => populateDropDowns(results))
	.catch(error => console.log(error))
}

const postPalette = () => {

	const savedPalette = {
		projectId: $('#projectList').val(),
		paletteName: $('.palette-name-input').val(),
		colors: palette
	}

	fetch('/api/palettes', {
		method: 'POST',
		body: JSON.stringify(savedPalette),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		if (response.status !== 201){
			return false
		}
		return response.json()
	})
	.then(result => {
		appendPalette(result)
	})
	.catch(error => {
		console.log(error)
	})
}

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
			return false
		}
		return response.json()
	})
	.then(result => {
		populateDropDowns(result)
	})
	.catch(error => {
		console.log(error)
	})
}

//UI manipulation

const appendPalette = (palettes) => {
	const projectIdSelected = $('#projectDisplayList').val()

	palettes.forEach((palette, i) => {
		if (palette.project_id == projectIdSelected) {
		$('.project-container').append(`
				<div class="palette-container" id="${palette.project_id}">
          <h4>${palette.palette_name}</h4>
          <div class="palette-colors-container" id="paletteColors">
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
            <div class="swatch ${palette.id}"></div>
          </div>
          <button class="delete-btn" id="${palette.id}"></button>
        </div>`)

				$(`.${palette.id}`).each((i, div) => {
						$(div).css('background-color', palette[`palette_color${i + 1}`])
				})
		}
	})
}

const generateHexValues = num => {
	let hexValues = [];
	for (let i = 0; i < num; i++) {
		hexValues.push('#' + ((Math.random() * 0xffffff) << 0).toString(16));
	}
	return hexValues;
};


const populateColorObj = (hexArray, unlock = false) => {
	if (!unlock) {
		for (let i = 0; i < 5; i++) {
			let isLocked = $(`.rando-color-${i + 1}`).children('div').hasClass('lock-img-locked')

			if (!isLocked) {
				palette.splice(i, 1, hexArray[i])
			} else if (isLocked) {
				palette.splice(i, 1, $(`.hexColor${i + 1}`).text())
			} else {
				palette.push(hexArray[i])
			}
		}
	} else {
		for (let i = 0; i < 5; i++) {
			$(`.rando-color-${i + 1}`).children('div').removeClass('lock-img-locked')
			palette.splice(i, 1, hexArray[i])
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

const populateDropDowns = (projects) => {
	$('.project-list').each((i, elemDisplay) => {
		projects.forEach((elemProj) => {
			$(elemDisplay).append(`<option value=${elemProj.id}>${elemProj.project_Name}</option>`)
		})
	})
}

const toggleLock = e => {
	const hexValue = $(e.target)
		.parent('article')
		.children('p')
		.text();

	$(e.target).toggleClass('lock-img-locked');
};

//Event Listeners

$(document).ready(() => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
	getAllProjects()
})

$('.addProjectInput').on('keyup', (e) => {
	$(e.target).val() ? $('.submitProjectBtn').prop('disabled', false) : $('.submitProjectBtn').prop('disabled', true)
})

$('.lock-img').on('click', e => {
	toggleLock(e);
});

$('.generate-btn').on('click', () => {
	populateColorSwatch(populateColorObj(generateHexValues(5)));
});

$('.project-container').on('click', '.delete-btn',  (e) => {
	const paletteId = $(e.target).prop('id');

	$(e.target).parents('.palette-container').remove()
	deletePalette(paletteId)
})

$('.project-container').on('click', '.palette-colors-container', (e) => {
	const paletteId = $(e.target).parents('.palette-container').children('.delete-btn').prop('id')

	fetch(`/api/palettes/${paletteId}`)
	.then(response => response.json())
	.then(results => {
		let hexCodes = [];

		for (let keys of ['palette_color1', 'palette_color2', 'palette_color3', 'palette_color4', 'palette_color5']) {
			hexCodes.push(results[0][keys])
		}

		return hexCodes
	})
	.then(hexCodes => populateColorSwatch(populateColorObj(hexCodes, true)))
	.catch(error => console.log(error))

	$(window).scrollTop(0);
})

$('.palette-name-input').on('keyup', (e) => {
	$(e.target).val() && $('#projectList').val() ? $('.submitPaletteBtn').prop('disabled', false) : $('.submitPaletteBtn').prop('disabled', true)
})

$('#projectDisplayList').on('change', () => {
	const	projectId = $('#projectDisplayList').val()

	$('.project-container').empty()
	getAllPalettes(projectId)
})

$('#projectList').on('change', (e) => {
	$(e.target).val() && $('.palette-name-input').val() ? $('.submitPaletteBtn').prop('disabled', false) : $('.submitPaletteBtn').prop('disabled', true)
})

$('.submitProjectBtn').on('click', (e) => {
	e.preventDefault();
	e.stopImmediatePropagation()
	postProject()
})

$('.submitPaletteBtn').on('click', (e) => {
	e.preventDefault();
	e.stopImmediatePropagation()
	postPalette()
})
