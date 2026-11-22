// Callback - Ajax
// $(`.search-button`).on(`click`, function () {
//     $.ajax({
//         url:
//             "https://www.cheapshark.com/api/1.0/deals?storeID=1&title=" +
//             $(`.input-keyword`).val(),
//         success: (results) => {
//             const games = results;
//             let cards = "";
//             games.forEach((game) => {
//                 cards += showCards(game);
//             });
//             $(".game-container").html(cards);

//             // Ketika button modal di klik
//             $(`.modal-detail-button`).on(`click`, function () {
//                 const gameId = $(this).data("gameid").toString();
//                 const game = games.find((g) => g.gameID === gameId);
//                 const detailGame = showGameDetail(game);
//                 $(".modal-body").html(detailGame);
//             });
//         },
//         error: (e) => {
//             console.log(e.responseText);
//         },
//     });
// });

// Fetch
function getGames(keyword = "") {
    fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${keyword}`)
        .then((response) => response.json())
        .then((games) => {
            let cards = "";
            games.forEach((game) => (cards += showCards(game)));
            const gameContainer = document.querySelector(".game-container");
            gameContainer.innerHTML = cards;

            // Pasang event listener untuk setiap tombol detail setelah card dirender
            const modalDetailButton = document.querySelectorAll(
                ".modal-detail-button",
            );
            modalDetailButton.forEach((btn) => {
                btn.addEventListener("click", function () {
                    const gameid = this.dataset.gameid;
                    const game = games.find((g) => g.gameID === gameid);
                    const detailGame = showGameDetail(game);
                    const modalBody = document.querySelector(".modal-body");
                    modalBody.innerHTML = detailGame;
                });
            });
        })
        .catch((err) => console.error("Gagal mengambil data:", err));
}
getGames();

const searchForm = document.querySelector('form[role="search"]');
const inputKeyword = document.querySelector(".input-keyword");

searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah halaman ter-reload
    getGames(inputKeyword.value);
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
