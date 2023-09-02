var Meals = [];
var categories = [];
let mekki = true;     // boolean flag  to check if i call the function searchByName to print all the details of the meal or to print the meal only without all its details.
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


$(document).ready(function () {
    //----------------close the side navbar------------------
    function closeNavbar() {
        var offset = $(".sidparinner").outerWidth();
        console.log(offset)
        $("#sidepar").animate({ left: -offset }, 300);
        $(".open-close-icon").removeClass("fa-x close");
        $(".open-close-icon").addClass("fa-align-justify");
        $('.links-list li').each(function (index) {
            var listItem = $(this);
            setTimeout(function () {
                listItem.animate({
                    top: 300
                }, 500);
            }, index * 100);
        });
    }
    //--------------------------------------------------------------------------------------------------------------------------
    //----------------open the side navbar-------------------------
    function openNavbar() {
        $("#sidepar").animate({ left: 0 }, 300);
        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x close");
        $('.links-list li').each(function (index) {
            var listItem = $(this);
            setTimeout(function () {
                listItem.animate({
                    top: 0
                }, 500);
            }, index * 100);
        });
    }
    $(".open-close-icon").click(function () {
        if ($(this).hasClass("fa-align-justify")) {
            openNavbar();
        } else {
            closeNavbar();
        }
    });
    //----------------------------------------------------------------------------------------------------------------------------------
    //---------------to make the animation of the overlay-----------------------------
    function image_hover() {
        $(".image-container").hover(
            function () {
                $(this).find(".overlay").css({
                    top: 0, // Slide up by changing the top position to 0
                    opacity: 1 // Set opacity to 1 on hover
                });
            },
            function () {
                $(this).find(".overlay").css({
                    top: "100%", // Slide down by changing the top position back to 100%
                    opacity: 0 // Set opacity back to 0 when not hovering
                });
            }
        );
    }
    //--------------------------------------------------------------------------------------------------------------------------------------
    //--------------------function to get all meals when the page is refreshed---------------------------------------------------
    async function getmeals() {
        $("#loading").fadeIn(300); // Show the loading section 
        var response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        var data = await response.json();
        // console.log(data.meals);
        Meals = data.meals;
        // console.log(Meals);
        $("#loading").fadeOut(300, function () { // Hide the loading section
            $("body").css('overflow', 'auto');
            DisplayAll_meals(Meals.slice(0, 24));
        });
    }
    getmeals();
    //---------------------------------------------------------------------------------------------------------------------------------------------
    //------------------ function to display the meals----------------------------------
    function DisplayAll_meals(items) {
        closeNavbar();
        var cartona = "";
        for (var i = 0; i < items.length; i++) {
            cartona += `<div class="col-md-3">
                <div class="image-container rounded-2">
                    <img src="${items[i].strMealThumb}" class="w-100" alt="">
                    <div class="overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${items[i].strMeal}</h3>
                    </div>
                </div>
            </div>`;
        }
        document.getElementById("demo").innerHTML = cartona;
        image_hover();
        // Add event listeners to image-containers
        var imageContainers = document.getElementsByClassName("image-container");
        for (var j = 0; j < imageContainers.length; j++) {
            imageContainers[j].addEventListener("click", function () {
                mekki = false;
                var mealName = this.querySelector("h3").textContent;
                searchByName(mealName);
            });
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------
    //----------------------- function to search about the meal by name-------------------
    async function searchByName(name) {
        $("#loading").fadeIn(300); // Show the loading section
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        response = await response.json()
        if (mekki == false) {
            displayMealDetails(response.meals);
            mekki = true;
        }
        else {
            response.meals ? DisplayAll_meals(response.meals) : DisplayAll_meals([]);
        }
        $("#loading").fadeOut(300)
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------
    //----------------------fuction to display all details about each meal--------------------
    function displayMealDetails(meal) {
        document.getElementById('SearchInput').innerHTML = ``;
        closeNavbar();
        var ingredients = ``;
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[0][`strIngredient${i}`];
            const measure = meal[0][`strMeasure${i}`];
            if (ingredient && ingredient.trim().length > 0) {
                ingredients += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`
            }
        }
        let tags = meal[0].strTags?.split(',');
        // console.log(tags);
        if (!tags) tags = []
        let eachtag = ``
        for (let tag of tags) {
            eachtag += `<li class="alert alert-info m-2 p-1">${tag}</li>`
        }
        let cartoona = `
        <div class="col-md-4">
                    <img class="w-100 rounded-3" src="${meal[0].strMealThumb}"
                        alt="">
                        <h2>${meal[0].strMeal}</h2>
                </div>
                <div class="col-md-8">
                    <h2>Instructions</h2>
                    <p>${meal[0].strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal[0].strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal[0].strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${eachtag}
                </ul>
                    <a target="_blank" href="${meal[0].strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal[0].strYoutube}" class="btn btn-danger">Youtube</a>
                </div>`
        document.getElementById("demo").innerHTML = cartoona;
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------function to show all the forms of the search operation-------------------
    function Search() {
        let cartouna = `<div class="row py-4 ">
            <div class="col-md-6 ">
                <input id="searchByNameInput" class="form-control bg-transparent text-white inputForm" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input maxlength="1" id="searchchar" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`;
        document.getElementById('SearchInput').innerHTML = cartouna;
        $("#searchByNameInput").on("keyup", function () {
            const name = this.value; // Get the typed value
            // Call the searchByName function with the typed value
            mekki = true;
            if (name == "") {
                DisplayAll_meals(Meals);
            }
            else {
                searchByName(name);
            }
        });
        $("#searchchar").on("keyup", function () {
            let item = this.value;
            SearchByChar(item);
        })
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------function to search by the first charchter-------------------------------
    async function SearchByChar(item) {
        $("#loading").fadeIn(300); // Show the loading section
        item == "" ? (item = "a") : "";
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${item}`);
        try {
            response = await response.json();
            response.meals ? DisplayAll_meals(response.meals) : DisplayAll_meals([]);
            $("#loading").fadeOut(300);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error, e.g., show an error message or fallback to default behavior
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------function to get all categories-------------------
    async function getCategories() {
        $("#loading").fadeIn(300); // Show the loading section
        let res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        categories = await res.json();
        $("#loading").fadeOut(300, function () { // Hide the loading section
            $("body").css('overflow', 'auto');
            displayAllCat(categories.categories);
        });
        $("#loading").fadeOut(300);
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------all function of the categories page-------------------------------------------------------
    function displayAllCat(catts) {
        document.getElementById('SearchInput').innerHTML = ``;
        let cartoona = "";
        for (let i = 0; i < catts.length; i++) {
            const catmeal = catts[i].strCategory;
            cartoona += `
            <div class="col-md-3">
            <div class="image-container rounded-2 catmeal" data-category="${catmeal}">
                <img class="w-100" src="${catts[i].strCategoryThumb}" alt="" srcset="">
                <div class="overlay position-absolute text-center text-black p-2">
                <h3>${catts[i].strCategory}</h3>
                <p>${catts[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
            </div>`;
        }
        document.getElementById("demo").innerHTML = cartoona;
        image_hover();
        // Add click event listener to each category
        const catmealElements = document.getElementsByClassName("catmeal");
        for (let j = 0; j < catmealElements.length; j++) {
            const catmeal = catmealElements[j].getAttribute("data-category");
            catmealElements[j].addEventListener("click", function () {
                getAllcatmeals(catmeal);
            });
        }
    }
    async function getAllcatmeals(catmeal) {
        $("#loading").fadeIn(300); // Show the loading section
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catmeal}`);
        let cattmeals = await res.json();
        $("#loading").fadeOut(300, function () { // Hide the loading section
            $("body").css('overflow', 'auto');
            cattmeals.meals ? DisplayAll_meals(cattmeals.meals.slice(0, 20)) : DisplayAll_meals([]);
        });
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------all functions of the Area page---------------------------------------    
    async function GetAllArea() {
        $("#loading").fadeIn(300); // Show the loading section
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        respone = await respone.json()
        console.log(respone.meals);
        DisplayAllAreas(respone.meals);
        $("#loading").fadeOut(300);
    }
    function DisplayAllAreas(Areas) {
        document.getElementById('SearchInput').innerHTML = ``;
        let cartoona = "";
        for (let i = 0; i < Areas.length; i++) {
            const area = Areas[i].strArea;
            cartoona += `
        <div class="col-md-3">
        <div class="rounded-2 text-center cursor-pointer" data-area="${area}">
            <i class="fa-solid fa-house-laptop fa-4x "></i>
            <h3>${Areas[i].strArea}</h3>
        </div>
        </div>
    `;
        }
        document.getElementById("demo").innerHTML = cartoona;
        // Add event listener to each area
        const areaElements = document.querySelectorAll('.cursor-pointer[data-area]');
        areaElements.forEach(element => {
            element.addEventListener('click', function () {
                const area = element.getAttribute('data-area');
                GetALLAreaMeals(area);
            });
        });
    }
    async function GetALLAreaMeals(item) {
        $("#loading").fadeIn(300); // Show the loading section
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${item}`)
        respone = await respone.json()
        console.log(respone.meals);
        respone.meals ? DisplayAll_meals(respone.meals.slice(0, 20)) : DisplayAll_meals([]);
        $("#loading").fadeOut(300);
    }
    //----------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------all function of the Ingredients page----------------------------------
    async function GetAllIngredients() {
        $("#loading").fadeIn(300); // Show the loading section
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        response = await response.json()
        console.log(response.meals);
        response.meals ? DisplayAllIngredients(response.meals.slice(0, 20)) : DisplayAllAreas([]);
        $("#loading").fadeOut(300);
    }
    function DisplayAllIngredients(ingreds) {
        document.getElementById('SearchInput').innerHTML = ``;
        let cartouna = ``;
        for (let i = 0; i < ingreds.length; i++) {
            const ingredient = ingreds[i].strIngredient;
            cartouna += `
        <div class="col-md-3">
            <div class="rounded-2 text-center cursor-pointer" data-ingredient="${ingredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingreds[i].strIngredient}</h3>
                <p>${ingreds[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`;
        }
        document.getElementById("demo").innerHTML = cartouna;
        // Add event listener to each ingredient
        const ingredElements = document.querySelectorAll('.cursor-pointer[data-ingredient]');
        ingredElements.forEach(element => {
            element.addEventListener('click', function () {
                const ingredient = element.getAttribute('data-ingredient');
                GetAllIngredMeals(ingredient);
            });
        });
    }
    async function GetAllIngredMeals(item) {
        $("#loading").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${item}`);
        response = await response.json();
        console.log(response.meals);
        response.meals ? DisplayAll_meals(response.meals.slice(0, 20)) : DisplayAll_meals([]);
        $("#loading").fadeOut(300);
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------all cols of the elements of the sidbar------------------------
    $("#ingrditem").click(function () {
        GetAllIngredients();
        closeNavbar();
    });
    $("#AreaItem").click(function () {
        GetAllArea();
        closeNavbar();
    })
    $("#catt").click(function () {
        getCategories();
        closeNavbar();
    });
    $("#searchli").click(function () {
        document.getElementById("demo").innerHTML = ``;
        Search();
        closeNavbar();
    })
    //--------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------show allof the inputs of contact page----------------------------
    $("#contactItem").click(function () {
        showContactInputs();
        closeNavbar();
    })
    function showContactInputs() {
        document.getElementById('SearchInput').innerHTML = ``;
        document.getElementById("demo").innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput"   type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput"   type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput"   type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput"  type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
        submitBtn = document.getElementById("submitBtn")
        document.getElementById("nameInput").addEventListener("focus", () => {
            nameInputTouched = true
        })
        document.getElementById("emailInput").addEventListener("focus", () => {
            emailInputTouched = true
        })
        document.getElementById("phoneInput").addEventListener("focus", () => {
            phoneInputTouched = true
        })
        document.getElementById("ageInput").addEventListener("focus", () => {
            ageInputTouched = true
        })
        document.getElementById("passwordInput").addEventListener("focus", () => {
            passwordInputTouched = true
        })
        document.getElementById("repasswordInput").addEventListener("focus", () => {
            repasswordInputTouched = true
        })
        document.getElementById("emailInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        document.getElementById("nameInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        document.getElementById("phoneInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        document.getElementById("ageInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        document.getElementById("passwordInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        document.getElementById("repasswordInput").addEventListener("keyup", () => {
            inputsValidation();
        })
        $("#submitBtn").click(function () {
            clearInputs();
        });
    }

    function inputsValidation() {
        if (nameInputTouched) {
            if (nameValidation()) {
                document.getElementById("nameAlert").classList.replace("d-block", "d-none")

            } else {
                document.getElementById("nameAlert").classList.replace("d-none", "d-block")

            }
        }
        if (emailInputTouched) {

            if (emailValidation()) {
                document.getElementById("emailAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("emailAlert").classList.replace("d-none", "d-block")

            }
        }

        if (phoneInputTouched) {
            if (phoneValidation()) {
                document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

            }
        }

        if (ageInputTouched) {
            if (ageValidation()) {
                document.getElementById("ageAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("ageAlert").classList.replace("d-none", "d-block")

            }
        }

        if (passwordInputTouched) {
            if (passwordValidation()) {
                document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

            }
        }
        if (repasswordInputTouched) {
            if (repasswordValidation()) {
                document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

            }
        }
        if (nameValidation() &&
            emailValidation() &&
            phoneValidation() &&
            ageValidation() &&
            passwordValidation() &&
            repasswordValidation()) {
            submitBtn.removeAttribute("disabled");
        } else {
            submitBtn.setAttribute("disabled", true)
        }
    }
    function nameValidation() {
        return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
    }
    function emailValidation() {
        return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
    }
    function phoneValidation() {
        return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
    }
    function ageValidation() {
        return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
    }
    function passwordValidation() {
        return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
    }
    function repasswordValidation() {
        return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
    }
    function clearInputs() {
        // Clear the input fields
        document.getElementById("nameInput").value = "";
        document.getElementById("emailInput").value = "";
        document.getElementById("phoneInput").value = "";
        document.getElementById("ageInput").value = "";
        document.getElementById("passwordInput").value = "";
        document.getElementById("repasswordInput").value = "";

        // Hide the validation alerts
        document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");

        // Disable the submit button again
        submitBtn.setAttribute("disabled", true);
    }
});