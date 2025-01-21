let currentIndex = 0;
let allMonsters = []; // Almacena todos los monstruos para la búsqueda

async function fetchMonsters() {
    try {
        const response = await fetch("http://localhost:3000/monsters");
        allMonsters = await response.json(); // Guardamos los monstruos en una variable global
        renderCarousel(allMonsters); // Renderizamos el carrusel inicial con todos los monstruos
    } catch (error) {
        console.error("Error fetching monster data:", error);
    }
}

function renderCarousel(monsters) {
    const carousel = document.getElementById("carousel");
    carousel.innerHTML = ""; // Limpiamos el carrusel antes de renderizar

    monsters.forEach((monster, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = index;

        card.innerHTML = `
            <img src="${monster.image[0]}" alt="${monster.name[0]}">
            <h3>${monster.name[0]}</h3>
            <p>Type: ${monster.type[0]}</p>
            <p>Threat Level: ${monster.threat_level[0]}</p>
            <p>Weakness: ${monster.weakness[0]}</p>
            <p>Habitat: ${monster.habitat[0]}</p>
            <button onclick="playRoar('${monster.roar[0]}')">Play Roar</button>
        `;

        carousel.appendChild(card);
    });

    updateCarousel(monsters.length);
}

function updateCarousel(totalMonsters) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
        const offset = (index - currentIndex + totalMonsters) % totalMonsters;

        card.classList.remove("far-left", "left", "center", "right", "far-right");
        card.style.opacity = "0";
        card.style.transform = "translateX(0) scale(0.8)";

        if (offset === 0) {
            card.classList.add("center");
            card.style.opacity = "1";
            card.style.transform = "translateX(0) scale(1.2)";
        } else if (offset === totalMonsters - 1) {
            card.classList.add("left");
            card.style.opacity = "0.8";
            card.style.transform = "translateX(-150px) scale(0.9)";
        } else if (offset === 1) {
            card.classList.add("right");
            card.style.opacity = "0.8";
            card.style.transform = "translateX(150px) scale(0.9)";
        } else if (offset === totalMonsters - 2) {
            card.classList.add("far-left");
            card.style.opacity = "0.5";
            card.style.transform = "translateX(-300px) scale(0.7)";
        } else if (offset === 2) {
            card.classList.add("far-right");
            card.style.opacity = "0.5";
            card.style.transform = "translateX(300px) scale(0.7)";
        }
    });
}

function searchMonsters() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const monsterIndex = allMonsters.findIndex(monster =>
        monster.name[0].toLowerCase().includes(searchInput)
    );

    if (monsterIndex !== -1) {
        // Actualiza el índice del carrusel al del monstruo buscado
        currentIndex = monsterIndex;
        updateCarousel(allMonsters.length);
    } else {
        alert("Monster not found!");
    }
}


document.getElementById("searchButton").addEventListener("click", searchMonsters);

document.getElementById("prev").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    currentIndex = (currentIndex - 1 + totalMonsters) % totalMonsters;
    updateCarousel(totalMonsters);
});

document.getElementById("next").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    currentIndex = (currentIndex + 1) % totalMonsters;
    updateCarousel(totalMonsters);
});

function filterSearchResults() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Limpia la lista

    allMonsters.forEach((monster, index) => {
        if (monster.name[0].toLowerCase().includes(searchInput)) {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${monster.image[0]}" alt="${monster.name[0]}">
                ${monster.name[0]}
            `;
            li.addEventListener("click", () => {
                currentIndex = index;
                updateCarousel(allMonsters.length);
                searchResults.innerHTML = ""; // Limpia los resultados
                document.getElementById("searchInput").value = ""; // Limpia el input
            });
            searchResults.appendChild(li);
        }
    });
}

fetchMonsters();
