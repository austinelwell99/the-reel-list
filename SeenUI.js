import React, { useState, useEffect } from "react"
import altPoster2 from "./images/altPoster2.png"

/*-------------------------------------------  Seen UI --------------------------------------------------------------

--------- renders the grid of all films seen
--------- displays poster and rating
--------- sortable by several methods
--------- exactly like the Seen UI but also displays rating and has 'My Rating option' for sort

--------------------------------------------------------------------------------------------------------------------*/

//------------------------------------------------------------------------------- global vars --------------------
let filteredArray

function SeenUI({ filmArray, showDetailsPage }) {
	//-------------------------------------------------------------------------- useState and initial filter -----
	let [sortBy, setSortBy] = useState("default")

	filmArray = filmArray || []

	filteredArray = filmArray.filter((movie) => movie.seenStatus === true)

	//----------------------------------------------------------------------------------- local storage -----------

	useEffect(() => {
		sortBy = localStorage.getItem("sortMethodSeen") || "default"
		setSortBy(sortBy)
	}, [])

	useEffect(() => {
		localStorage.setItem("sortMethodSeen", sortBy)
	}, [sortBy])

	//----------------------------------------------------------------------------------- sorting methods ---------
	if (sortBy === "default") {
		filteredArray = filteredArray.sort((a, b) => b.dateAdded - a.dateAdded)
	}

	if (sortBy === "title") {
		filteredArray = filteredArray.sort((a, b) => {
			let x = a.Title.toLowerCase()
			let y = b.Title.toLowerCase()
			return x < y ? -1 : x > y ? 1 : 0
		})
	}

	if (sortBy === "yearReleased") {
		filteredArray = filteredArray.sort((a, b) => b.Year - a.Year)
	}

	if (sortBy === "myRating") {
		filteredArray = filteredArray.sort((a, b) => b.rating - a.rating)
	}

	if (sortBy === "imdbRating") {
		filteredArray = filteredArray.sort((a, b) => b.imdbRating - a.imdbRating)
	}

	//----------------------------------------------------------------------------------- render -------------
	return (
		<div className="gridUIContainer">
			{/*--------------------------------------------------------------- taskbar UI ------------*/}
			<div className="gridTaskbar">
				<div className="filmCount font">{filteredArray.length} films</div>
				{/*--------------------------------------------------------------- sort UI -----------*/}
				<div className="sortByContainer">
					<div className="sortByText font">Sort By:</div>
					<button
						className={
							sortBy === "default"
								? "sortMethodSelected font"
								: "sortMethod font"
						}
						onClick={() => setSortBy("default")}
					>
						Order Added
					</button>
					<button
						className={
							sortBy === "title" ? "sortMethodSelected font" : "sortMethod font"
						}
						onClick={() => setSortBy("title")}
					>
						Title A-Z
					</button>
					<button
						className={
							sortBy === "yearReleased"
								? "sortMethodSelected font"
								: "sortMethod font"
						}
						onClick={() => setSortBy("yearReleased")}
					>
						Year Released
					</button>
					<button
						className={
							sortBy === "myRating"
								? "sortMethodSelected font"
								: "sortMethod font"
						}
						onClick={() => setSortBy("myRating")}
					>
						My Rating
					</button>
					<button
						className={
							sortBy === "imdbRating"
								? "sortMethodSelected font"
								: "sortMethod font"
						}
						onClick={() => setSortBy("imdbRating")}
					>
						IMDb Rating
					</button>
				</div>
			</div>
			{/*--------------------------------------------------------------- grid UI -----------*/}
			<div className="gridAllFilmsContainer">
				{filteredArray.length > 0 ? (
					filteredArray.map((movie, index) => (
						<div
							key={index}
							className="gridFilmContainer"
							onClick={() => showDetailsPage(movie.imdbID)}
						>
							{movie.Poster !== "N/A" ? (
								//checking if there is a poster
								<img
									src={movie.Poster}
									className="gridPoster"
									alt={movie.Title}
								/>
							) : (
								//if not, render alt image
								<div className="gridPosterContainer">
									<img src={altPoster2} className="gridPoster" alt="" />
									<div className="gridNoPosterTitle font">{movie.Title}</div>
								</div>
							)}
							{/*--------------------------------------------------- rating display --------*/}
							<div className="gridFilmRatingContainer">
								{[...Array(5)].map((n, index) => (
									<i
										key={index}
										className={
											index < movie.rating
												? "diamondGridDisplay fa fa-diamond"
												: "hideRating"
										}
									/>
								))}
							</div>
						</div>
					))
				) : (
					<div className="noSearchResults">No Films Added</div>
				)}
			</div>
		</div>
	)
}

export default SeenUI
