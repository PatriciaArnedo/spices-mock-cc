// write your code here
/* See the first spice blend (the spice blend with an ID of 1), 
including its title, image, and list of ingredients, when the page loads. /X 

Update the title of the spice blend on the page when the #update-form 
is submitted, and still see that change when reloading the page 
(the new title should be persisted on the server). /X

Add a new ingredient to the spice blend when the #ingredient-form 
is submitted. The new ingredient should be displayed on the 
page (no persistence needed for now). /X
*/

//identify element to add spiceblen properties to
//make fetch request
//make render spice func

const spiceDiv = document.querySelector("#spice-blend-detail")

const updateForm = document.querySelector("#update-form") 
const ingredientForm = document.querySelector("#ingredient-form")

//debugger

fetch(`http://localhost:3000/spiceblends/1`)
.then(resp => resp.json())
.then(spiceObj => {
    console.log(spiceObj)
    renderSpice(spiceObj)
})

const renderSpice = (spice) => {
    spiceDiv.innerHTML = `
    <img class="detail-image" src=${spice.image} alt=${spice.title} />
    <h2 class="title" data-id="${spice.id}">${spice.title}</h2>
    <div class="ingredients-container">
        <h4>Ingredients:</h4>
        <ul class="ingredients-list">   
        </ul>
      </div>
    `

    spice.ingredients.forEach((ingredient) => {addIngredient(ingredient)})
    spiceDiv.dataset.id = spice.id
    const ingredientsUl = document.querySelector(".ingredients-list")
    ingredientsUl.dataset.id = spice.id
}

const addIngredient = (ingredient) => {
    const ingredientsUl = document.querySelector(".ingredients-list") 
    const ingredientLi = document.createElement('li')
    ingredientLi.dataset.id = ingredient.id
    ingredientLi.textContent = ingredient.name
    ingredientsUl.append(ingredientLi)
}

//locate element to add event listener
//add event listener
//collect user input in obj
//make patch request on form submission

updateForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const spiceTitle = document.querySelector("#spice-blend-detail h2")
    const newTitle = {
        title: event.target.title.value
    }
    spiceTitle.innerText = event.target.title.value
    const id = parseInt(spiceTitle.dataset.id)
    fetch(`http://localhost:3000/spiceblends/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newTitle)
    })
    //updating front end optimistically 
    // .then(resp => resp.json())
    // .then(updatedObj => {
    //     console.log(updatedObj)
    // })

})

ingredientForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const ingredientsUl = document.querySelector(".ingredients-list")
    const ingredientLi = document.createElement('li')
    ingredientLi.innerText = event.target.name.value
    ingredientsUl.append(ingredientLi)
    
    //-----advanced deliverable begins-----//

    ingredientForm.dataset.id = ingredientsUl.dataset.id
    const id = parseInt(ingredientForm.dataset.id)
    const newIngredient = {
        name: event.target.name.value,
        spiceblendId: id
    }
    fetch(`http://localhost:3000/ingredients`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newIngredient)
    })
    .then(resp => resp.json())
    .then(console.log)
    //debugger
})

/*
Persist new ingredients to the server when the #ingredient-form is 
submitted. Make sure to follow the format listed above to make a POST 
request to /ingredients. In the body of the request, the spiceblendId 
will need to be a number (not a string). /X

See all spice blend images in the #spice-images div when the page loads. 
Request the data from the server to get all the spice blends. Then, 
display the image for each of the spice blends using an img tag inside 
the #spice-images div. /X

Click on an image from the #spice-images div and see all the info 
about that spice blend displayed inside the #spice-blend-detail div. 
You will need to make another GET request with the spice blend's ID 
to get the information about the spice blend that was clicked. /X
*/

//target element to append to 
//make fetch request
//make render images func

const imageBar = document.querySelector("#spice-images")
const spiceImage = document.querySelector("#spice-image")

fetch(`http://localhost:3000/spiceblends`)
.then(resp => resp.json())
.then(spiceObjs => {
    console.log(spiceObjs)
    spiceObjs.forEach(spice => {addImages(spice)})
})

const addImages = (spice) => {
    const spiceImage = document.createElement("img")
    spiceImage.src = spice.image
    spiceImage.alt = spice.title
    spiceImage.dataset.id = spice.id
    spiceImage.id = "spice-image"
    imageBar.append(spiceImage)
}

imageBar.addEventListener("click", (event) => {
    if (event.target.matches("#spice-image")) {
        const id = parseInt(event.target.dataset.id)

        fetch(`http://localhost:3000/spiceblends/${id}`)
        .then(resp => resp.json())
        .then(spiceObj => {
            console.log(spiceObj)
            renderSpice(spiceObj)
        })
    }
})

