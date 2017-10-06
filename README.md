### Palette Picker

The goal of this project was to build a simple backend with NodeJS/Express in order to be able to save color palettes under a created project folder. Some of the specs for the project included being able to create a new project, save a palette to that project, lock colors in the generate new colors, and delete a palette. This project is also deployed to [Heroku](https://david-palette-picker.herokuapp.com/). Go take a look and create a palette!

![Palette Picker](https://i.imgur.com/7X99IEX.png)


### Original Specs - Abstract

There is a website out there called Coolors - and others like it are out there. They help you generate color palettes for websites or other design projects.

Your job is to recreate some of this site’s functionality with your own backend and database. A user should be able to come to your site, generate a color palette, and save it for their own future projects.

#### Specifications

Your application should have the following functionality. A user should be able to:

- Generate a palette with 5 distinct colors
- You should be able to hold or “freeze” one color and generate a new palette while the frozen color remains the same (similar to the Lock functionality on Coolors)
- The colors should be randomly generated (do not use predefined lists of color palettes)
- Create a project folder as a place to save palettes
- You should be able to create multiple folders
- Folder names must be unique (you should not be able to create two folders with the same name)
- A folder can hold many saved palettes (a one-to-many relationship)
- The saved folder should persist in your backend database
- Save a generated palette to a project folder
- The saved palette should appear in the folder with the name of the palette (specified by the user) and the saved palette colors
- When you click on the name or colors in the saved palette, the palette generator should show the colors of that saved palette
- The saved palette should persist in your backend database
- Delete a palette from a project folder, which removes it from the page and database
- Never need to refresh the page to see new information
- In addition to the functional requirement, on a separate dedicated git branch, go through each line of the server file and put a comment on each line that explains what that line of code is doing. Be as explicit as you can.


#### Tech Stack

Backend: build using Express, Knex, and PostgreSQL. Server-side testing should be done using mocha, chai, and chai-http. There should be one client-side route ('/'), and other endpoints should be API endpoints ('api/v1/...'). Each API endpoint should respond with JSON-formatted data.

Frontend: build using vanilla JavaScript or jQuery (you cannot use React or other libraries for this project - we want to keep the client-side code as simple as possible to reduce complexity and focus on the backend).
