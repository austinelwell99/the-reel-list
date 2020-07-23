import React, { useState } from "react"
import altPoster from "./images/altPoster.png"

/*-------------------------------------------  Seen UI --------------------------------------------------------------

--------- renders detailed info for a specific film
--------- displays poster, title, year, genre, mpaa rating, length, reviews, actors, writer, director, plot summary 
--------- has UX options to add to watchlist, seen films, or rate out of 5 stars

--------------------------------------------------------------------------------------------------------------------*/

function DetailsPageUI({
	movieObject,
	addToSeenFilms,
	addToWatchlist,
	backToList,
	filmArray
}) {
	/*      Parameters In:
                movieObject: film that current render was called for
                addToSeenFilms: callback function that adds to filmArray
				addToWatchlist: callback function that adds to filmArray
				backToList: callback function that renders prev page, whether list view or grid view
				filmArray: our main array of movies we store
    */

	//--------------------------------------------------------------- useState ----------------------
	let [state, setState] = useState([])

	filmArray = filmArray || []

	//-----------------------------------------------------------------------------------------------
	//needs to check each time it rerenders if the movie is in the film array...
	//so that if the user changes something it doesn't keep refering to the query info and can display user update

	let filmPointer
	if (filmArray === null) filmPointer = -1
	else {
		filmPointer = filmArray.findIndex((movie, index) => {
			if (movie.imdbID === movieObject.imdbID) {
				return true
			}
			return false
		})
	}

	if (filmPointer !== -1) {
		movieObject = filmArray[filmPointer]
	}

	//----------------------------------------------------------------- methods ---------------------
	//rateFilm
	//diamondHover
	//diamondUnhover

	function rateFilm(rating) {
		//checking if film is already in the array
		let filmPointer
		if (filmArray === null) filmPointer = -1
		else {
			filmPointer = filmArray.findIndex((movie, index) => {
				if (movie.imdbID === movieObject.imdbID) {
					return true
				}
				return false
			})
		}

		if (filmPointer !== -1) {
			//meaning the film is already in the array
			if (movieObject.rating === rating) {
				movieObject.rating = 0
			} else {
				movieObject.rating = rating
				movieObject.dateAdded = new Date().getTime()
				if (movieObject.watchlistStatus === true) {
					movieObject.watchlistStatus = false
				}
				if (movieObject.seenStatus === false) {
					movieObject.seenStatus = true
				}
			}
		} else {
			//meaning the film is not yet in the array
			movieObject.rating = rating
			movieObject.seenStatus = true
			movieObject.watchlistStatus = false
			movieObject.dateAdded = new Date().getTime()
			filmArray.push(movieObject)
		}
		setState([...state])
	}

	function diamondHover(id) {
		if (id === "d4") {
			document.getElementById("d3").classList.add("diamondHover")
			document.getElementById("d2").classList.add("diamondHover")
			document.getElementById("d1").classList.add("diamondHover")
			document.getElementById("d0").classList.add("diamondHover")
		}
		if (id === "d3") {
			document.getElementById("d2").classList.add("diamondHover")
			document.getElementById("d1").classList.add("diamondHover")
			document.getElementById("d0").classList.add("diamondHover")
		}
		if (id === "d2") {
			document.getElementById("d1").classList.add("diamondHover")
			document.getElementById("d0").classList.add("diamondHover")
		}
		if (id === "d1") {
			document.getElementById("d0").classList.add("diamondHover")
		}
	}

	function diamondUnhover(id) {
		if (id === "d4") {
			document.getElementById("d3").classList.remove("diamondHover")
			document.getElementById("d2").classList.remove("diamondHover")
			document.getElementById("d1").classList.remove("diamondHover")
			document.getElementById("d0").classList.remove("diamondHover")
		}
		if (id === "d3") {
			document.getElementById("d2").classList.remove("diamondHover")
			document.getElementById("d1").classList.remove("diamondHover")
			document.getElementById("d0").classList.remove("diamondHover")
		}
		if (id === "d2") {
			document.getElementById("d1").classList.remove("diamondHover")
			document.getElementById("d0").classList.remove("diamondHover")
		}
		if (id === "d1") {
			document.getElementById("d0").classList.remove("diamondHover")
		}
	}
	//--------------------------------------------------------------- render ----------------------
	return (
		<div className="detailsPageContainer">
			<div className="detailsPageHeader">
				<div className="detailsPageBackButtonAndTitle">
					<div className="detailsPagebackButtonContainer">
						<i
							className="fa fa fa-angle-left arrowIcon"
							onClick={() => {
								backToList()
							}}
						/>
					</div>
					<div className="detailsPageTitle font">{movieObject.Title}</div>
				</div>
				<div className="detailsPageInteractiveContainer">
					<div className="detailsPageRatingContainer">
						{[...Array(5)].map((n, index) => (
							<i
								id={`d${index}`}
								key={index}
								className={
									index < movieObject.rating
										? "diamond diamondSelected fa fa-diamond fa-2x"
										: "diamond diamondUnselected fa fa-diamond fa-2x"
								}
								onClick={() => rateFilm(index + 1)}
								onMouseEnter={() => diamondHover(`d${index}`)}
								onMouseLeave={() => diamondUnhover(`d${index}`)}
							/>
						))}
					</div>
					<i
						className={
							movieObject.seenStatus === true
								? "fa fa-eye fa-2x selectedIcon"
								: "fa fa-eye fa-2x listIcons"
						}
						onClick={() => addToSeenFilms(movieObject.imdbID)}
					></i>
					<i
						className={
							movieObject.watchlistStatus === true
								? "fa fa-bookmark fa-2x selectedIcon"
								: "fa fa-bookmark-o fa-2x listIcons"
						}
						onClick={() => addToWatchlist(movieObject.imdbID)}
					></i>
				</div>
			</div>
			<div className="detailsPageBody">
				<div className="detailsPagePosterAndDetailsContainer">
					{movieObject.Poster !== "N/A" ? (
						<img
							src={movieObject.Poster}
							className="detailsPagePoster"
							alt=""
						/>
					) : (
						<img src={altPoster} className="detailsPagePoster" alt="" />
					)}
					<div className="detailsPageYearRatingRuntimeContainer">
						<div className="detailsPageYearText">{movieObject.Year}</div>
						<div className="detailsPageSlashes">|</div>
						{movieObject.Rated !== "N/A" ? (
							<div className="detailsPageYearText">
								Rated {movieObject.Rated}
							</div>
						) : (
							<div className="detailsPageYearText">Not Rated</div>
						)}
						<div className="detailsPageSlashes">|</div>
						<div className="detailsPageYearText">{movieObject.Runtime}</div>
					</div>
				</div>
				<div className="detailsPageSummaryAndPeopleContainer">
					<div className="detailsPageSummaryContainer">
						<div className="detailsPageSummaryTitleText">Plot Summary:</div>
						<div className="detailsPageSummaryText">{movieObject.Plot}</div>
					</div>
					<div className="detailsPagePeopleAndReviewsContainer">
						<div className="detailsPagePeopleContainer">
							<div className="detailsPagePeopleText">
								Directed By: {movieObject.Director}
							</div>
							<div className="detailsPagePeopleText">
								Writen By: {movieObject.Writer}
							</div>
							<div className="detailsPagePeopleText">
								Starring: {movieObject.Actors}
							</div>
							<div className="detailsPagePeopleText">
								Genres: {movieObject.Genre}
							</div>
						</div>
						<div className="detailsPageReviewsContainer">
							{movieObject.Ratings[1] !== undefined ? (
								<div className="detailsPageReviewText">
									Rotten Tomatoes: {movieObject.Ratings[1].Value}
								</div>
							) : (
								""
							)}
							{movieObject.Ratings[2] !== undefined ? (
								<div className="detailsPageReviewText">
									Metacritic: {movieObject.Ratings[2].Value}
								</div>
							) : (
								""
							)}
							{movieObject.Ratings[0] !== undefined ? (
								<div className="detailsPageReviewText">
									IMDB: {movieObject.Ratings[0].Value}
								</div>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DetailsPageUI
