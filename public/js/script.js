const gameContainer = document.querySelector(".game-container");
const searchForm = document.querySelector('form[role="search"]');
const inputKeyword = document.querySelector(".input-keyword");

async function getGames(keyword = "") {
    gameContainer.innerHTML = `
        <div class="col-12 text-center text-white my-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Mengambil daftar diskon game...</p>
        </div>
    `;

    try {
        const url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${encodeURIComponent(keyword)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const games = await response.json();
        if (games.length === 0) {
            gameContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center" role="alert">
                        Game dengan kata kunci "<strong>${keyword}</strong>" tidak ditemukan.
                    </div>
                </div>
            `;
            return;
        }

        let cards = "";
        games.forEach((game) => (cards += showCards(game)));
        gameContainer.innerHTML = cards;

        // 4. Event listener tombol detail modal
        const modalDetailButtons = document.querySelectorAll(
            ".modal-detail-button",
        );
        modalDetailButtons.forEach((btn) => {
            btn.addEventListener("click", function () {
                const gameid = this.dataset.gameid;
                const game = games.find((g) => g.gameID === gameid);
                if (game) {
                    document.querySelector(".modal-body").innerHTML =
                        showGameDetail(game);
                }
            });
        });
    } catch (err) {
        console.error("Gagal mengambil data:", err);
        gameContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    Terjadi kesalahan saat menghubungi server API. Silakan coba beberapa saat lagi.
                </div>
            </div>
        `;
    }
}

getGames();

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    getGames(inputKeyword.value.trim());
});

function showCards(game) {
    return `<div class="col-md-3 mb-3">
                <div class="card">
                    <img src="${game.thumb}" class="game-cover" alt="game-cover">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <div class="d-flex gap-3">
                            <span class="sale-price"><strong>$${game.salePrice}</strong></span>
                            <span class="normal-price"><s>$${game.normalPrice}</s></span>
                        </div>
                        <a href="#" class="btn modal-detail-button mt-4" data-bs-toggle="modal" data-bs-target="#gameDetailModal" data-gameid="${game.gameID}">Details</a>
                    </div>
                </div>
            </div>`;
}

function showGameDetail(game) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${game.thumb}" class="img-fluid" alt="game cover">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h6><strong>Game Title</strong>:</h6> ${game.title}</li>
                            <li class="list-group-item"><strong>Sale Price: </strong> $${game.salePrice}</li>
                            <li class="list-group-item"><strong>Retail Price: </strong> <s>$${game.normalPrice}</s></li>
                            <li class="list-group-item"><strong>Rating </strong> ${game.steamRatingText}</li>
                            <li class="list-group-item"><strong>Total Ratings: </strong> ${game.steamRatingCount}</li>                                            
                        </ul>
                    </div>
                </div>
            </div>`;
}
