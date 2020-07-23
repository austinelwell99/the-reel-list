import React from "react"
import altPoster from "./images/altPoster.png"

/*-------------------------------------------  List UI --------------------------------------------------------------

--------- renders  list of all search results
--------- displays poster, title, and year
--------- includes UX options to add to watchlist or seen films

--------------------------------------------------------------------------------------------------------------------*/

function ListUI({
	searchResultArrayIn,
	addToSeenFilms,
	addToWatchlist,
	showDetailsPage,
	filmArray
}) {
	/*      Parameters In:
                searchResultArrayIn: API array of movies from search result
                addToSeenFilms: callback function that adds to filmArray
				addToWatchlist: callback function that adds to filmArray
				showDetailsPage: callback function that renders the detailed info of selected film
				filmArray: our main array of movies we store
    */

	//------------------------------------------------------------------------------------ render ----------------
	return (
		<div>
			<div className="listContainer">
				{searchResultArrayIn.length > 0 ? (
					searchResultArrayIn.map((item, index) => (
						<div
							className="listItem"
							key={index}
							onClick={() => showDetailsPage(item.imdbID)}
						>
							<div className="searchResultItemContainer">
								{item.Poster !== "N/A" ? (
									//checking if there is a poster
									<img
										src={item.Poster}
										className="searchResultItemPoster"
										alt=""
									/>
								) : (
									//if not, render alt image
									<img
										src={altPoster}
										className="searchResultItemPoster"
										alt=""
									/>
								)}
								<div className="searchResultItemDetails">
									<div className="searchResultItemDetailsText">
										<div className="searchResultItemTitle">{item.Title}</div>
										<div className="searchResultItemYear">{item.Year}</div>
									</div>
									<div className="interactiveIcons">
										<i
											className={
												filmArray &&
												filmArray.filter(
													(movie) =>
														movie.imdbID === item.imdbID &&
														movie.seenStatus === true
												).length > 0
													? "fa fa-eye fa-2x selectedIcon"
													: "fa fa-eye fa-2x listIcons"
											}
											onClick={() => addToSeenFilms(item.imdbID)}
										></i>
										<i
											className={
												filmArray &&
												filmArray.filter(
													(movie) =>
														movie.imdbID === item.imdbID &&
														movie.watchlistStatus === true
												).length > 0
													? "fa fa-bookmark fa-2x selectedIcon"
													: "fa fa-bookmark-o fa-2x listIcons"
											}
											onClick={() => addToWatchlist(item.imdbID)}
										></i>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="noSearchResults">No Search Results</div>
				)}
			</div>
		</div>
	)
}

export default ListUI
