import React, { useState, useEffect } from "react"
import "./App.css"
import ListUI from "./ListUI"
import DetailsPageUI from "./DetailsPageUI"
import SplashScreen from "./SplashScreen"
import SeenUI from "./SeenUI"
import WatchlistUI from "./WatchlistUI"

/*-------------------------------------------  APP JS  ------------------------------------------------------------

--------- main component for app that displays and stores film info
		  - queries OMDB API for information
		  - stores film info as well as user info (seenStatus, watchlistStatus, and rating)

--------- renders header UI at top of page
		  - title, search bar, and buttons

--------- renders one of several UIs at the bottom of page, depending on flag
		  - ListUI: displays search results in a list form
		  - DetailsPageUI: info about specific film
		  - GridUI: displays stored movies (watchlist or seen films) in sortable grid form
		  - SplashScreen: animated home page

--------- contains methods for basic functionality
		  - submitFetch: queries API for search results
	  	  - addToSeenFilms: adds film to filmArray if not already in it, flips seen status
		  - addToWatchlist: adds film to filmArray if not already in it, flips watchlist status
		  - showDetailsPage: triggers detail page render
		  - backToList: back button from details page to list UI
		  - goToHome: triggers homepage render

------------------------------------------------------------------------------------------------------------------*/

//--------------------------------------------------------------------------------global vars-------------
let searchResultArray = [],
	movieObject,
	chosenDisplay,
	whenceItCame, //for going back to prev view from detailed page
	filmArray = []

let showListFlag = false,
	showSearchResultsFlag = false,
	showDetailsFlag = false,
	splashScreenFlag = true,
	showGridFlag = false

function App() {
	//--------------------------------------------------------------------------------local vars----------
	let searchWantedString
	let iconClickedFlag = false //for preventing showDetailsPage when icon is clicked

	//--------------------------------------------------------------------------------useState-------------------
	let [state, setState] = useState([])

	//--------------------------------------------------------------------------------local storage--------------

	useEffect(() => {
		filmArray = JSON.parse(localStorage.getItem("filmArrayStorage"))
		if (filmArray === null) filmArray = []
	}, [])

	useEffect(() => {
		localStorage.setItem("filmArrayStorage", JSON.stringify(filmArray))
	}, [state])

	//--------------------------------------------------------------------------------methods--------------------

	function submitFetch() {
		//-----------------------queries API for search results
		showDetailsFlag = false
		splashScreenFlag = false
		showGridFlag = false
		showListFlag = true
		showSearchResultsFlag = true
		whenceItCame = "list"
		if (searchWantedString.value) {
			fetch(
				`https://www.omdbapi.com/?apikey=c25b3629&s=${searchWantedString.value}&type=movie`
			)
				.then((response) => response.json())
				.then((data) => (searchResultArray = data.Search))
				.then(() => console.log("search results:", searchResultArray))
				.then(() => setState([...state]))
		}
	}

	function submitFetchOnKeyDown(e) {
		if (e.key === "Enter") {
			submitFetch()
		}
	}

	function addToSeenFilms(imdbIDIn) {
		iconClickedFlag = true //for preventing showDetailsPage
		let filmDataObject
		//check if this film is already in filmArray
		let filmPointer
		if (filmArray === null) filmPointer = -1
		else {
			filmPointer = filmArray.findIndex((movie, index) => {
				if (movie.imdbID === imdbIDIn) {
					return true
				}
				return false
			})
		}

		if (filmPointer !== -1) {
			//meaning the film is in the array
			if (filmArray[filmPointer].seenStatus === true) {
				//meaning it was marked as already seen
				filmArray[filmPointer].seenStatus = false
			} else {
				//meaning the movie was unseen
				filmArray[filmPointer].seenStatus = true
				filmArray[filmPointer].watchlistStatus = false
				filmArray[filmPointer].dateAdded = new Date().getTime()
			}
			setState([...state])
		} else {
			// meaning this film is not in the array yet
			fetch(
				`https://www.omdbapi.com/?apikey=c25b3629&i=${imdbIDIn}&type=movie&plot=full`
			)
				.then((response) => response.json())
				.then((data) => (filmDataObject = data))
				.then(() => {
					filmDataObject.seenStatus = true
					filmDataObject.watchlistStatus = false
					filmDataObject.rating = 0
					filmDataObject.dateAdded = new Date().getTime()
				})
				.then(() => filmArray.push(filmDataObject))
				.then(() => setState([...state]))
				.then(() => console.log(filmArray))
		}
	}

	function addToWatchlist(imdbIDIn) {
		iconClickedFlag = true //for preventing showDetailsPage
		let filmDataObject
		//check if this film is already in filmArray

		//important: had to go back and replace all instances of findIndex, browser was throwing error because it was reading null value
		let filmPointer
		if (filmArray === null) filmPointer = -1
		else {
			filmPointer = filmArray.findIndex((movie, index) => {
				if (movie.imdbID === imdbIDIn) {
					return true
				}
				return false
			})
		}

		if (filmPointer !== -1) {
			//meaning the film is in the array
			if (filmArray[filmPointer].watchlistStatus === true) {
				//meaning it was marked as already on watchlist
				filmArray[filmPointer].watchlistStatus = false
			} else {
				//meaning the movie was not on watchlist
				filmArray[filmPointer].watchlistStatus = true
				filmArray[filmPointer].dateAdded = new Date().getTime()
			}
			setState([...state])
		} else {
			// meaning this film is not in the array yet
			fetch(
				`https://www.omdbapi.com/?apikey=c25b3629&i=${imdbIDIn}&type=movie&plot=full`
			)
				.then((response) => response.json())
				.then((data) => (filmDataObject = data))
				.then(() => {
					filmDataObject.seenStatus = false
					filmDataObject.watchlistStatus = true
					filmDataObject.rating = 0
					filmDataObject.dateAdded = new Date().getTime()
				})
				.then(() => filmArray.push(filmDataObject))
				.then(() => setState([...state]))
				.then(() => console.log("filmArray:", filmArray))
		}
	}

	function showDetailsPage(imdbIDIn) {
		if (!iconClickedFlag) {
			showListFlag = false
			showGridFlag = false
			showSearchResultsFlag = false
			let filmPointer

			//check if this film is already in filmArray
			if (filmArray === null) filmPointer = -1
			else {
				filmPointer = filmArray.findIndex((movie, index) => {
					if (movie.imdbID === imdbIDIn) {
						return true
					}
					return false
				})
			}

			if (filmPointer !== -1) {
				//meaning the film is in the array
				movieObject = filmArray[filmPointer]
				showDetailsFlag = true
				setState([...state])
			} else {
				fetch(
					`https://www.omdbapi.com/?apikey=c25b3629&i=${imdbIDIn}&type=movie&plot=full`
				)
					.then((response) => response.json())
					.then((data) => (movieObject = data))
					.then(() => (showDetailsFlag = true))
					.then(() => setState([...state]))
			}
		}
		iconClickedFlag = false
	}

	function backToList() {
		//--------------------goes back to list or grid view from details page
		showDetailsFlag = false

		if (whenceItCame === "list") {
			showListFlag = true
			showGridFlag = false
		}
		if (whenceItCame === "grid") {
			showListFlag = false
			showGridFlag = true
		}
		setState([...state])
	}

	function goToHome() {
		//--------------------resets view and deletes search bar text when page header is clicked
		showListFlag = false
		showDetailsFlag = false
		showGridFlag = false
		showSearchResultsFlag = false
		splashScreenFlag = true
		document.getElementById("searchBarInput").value = ""
		setState([...state])
	}

	function showGridUI(chosenDisplayIn) {
		whenceItCame = "grid"
		chosenDisplay = chosenDisplayIn
		showListFlag = false
		showSearchResultsFlag = false
		showDetailsFlag = false
		splashScreenFlag = false
		showGridFlag = true

		searchWantedString.value = ""

		setState([...state])
	}

	//--------------------------------------------------------------------------------render---------------------

	return (
		<div className="App">
			{/*--------------------------------------------------------------------header UI------------*/}
			<div className="pageHeader">
				<h1 className="pageHeadertext" onClick={goToHome}>
					The Reel List
				</h1>
				<div className="commandBarContainer">
					<div className="searchBarContainer">
						<input
							id="searchBarInput"
							className="searchBar font"
							type="text"
							ref={(input) => (searchWantedString = input)}
							placeholder="search by movie title"
							onKeyDown={submitFetchOnKeyDown}
						></input>
						<button className="searchButton font" onClick={submitFetch}>
							Search
						</button>
					</div>
					<div className="commandButtonsContainer">
						<button
							id="seenButton"
							className={
								showGridFlag && chosenDisplay === "seen"
									? "commandButtons font commandButtonSelected"
									: "commandButtons font"
							}
							onClick={() => showGridUI("seen")}
						>
							My Films
						</button>
						<button
							id="watchlistButton"
							className={
								showGridFlag && chosenDisplay === "watchlist"
									? "commandButtons font commandButtonSelected"
									: "commandButtons font"
							}
							onClick={() => showGridUI("watchlist")}
						>
							Watchlist
						</button>
					</div>
				</div>
			</div>
			{/*--------------------------------------------------------------------page content UI------------*/}
			<div className="pageContent font">
				{splashScreenFlag && <SplashScreen />}

				{showDetailsFlag && (
					<DetailsPageUI
						movieObject={movieObject}
						addToSeenFilms={addToSeenFilms}
						addToWatchlist={addToWatchlist}
						backToList={backToList}
						filmArray={filmArray}
					/>
				)}

				{showListFlag && searchResultArray !== undefined && (
					<ListUI
						searchResultArrayIn={searchResultArray}
						addToSeenFilms={addToSeenFilms}
						addToWatchlist={addToWatchlist}
						showDetailsPage={showDetailsPage}
						filmArray={filmArray}
					/>
				)}
				{showSearchResultsFlag && searchResultArray === undefined && (
					<div className="noSearchResults">No Search Results</div>
				)}

				{showGridFlag && chosenDisplay === "seen" && (
					<SeenUI filmArray={filmArray} showDetailsPage={showDetailsPage} />
				)}
				{showGridFlag && chosenDisplay === "watchlist" && (
					<WatchlistUI
						filmArray={filmArray}
						showDetailsPage={showDetailsPage}
					/>
				)}
			</div>
		</div>
	)
}

export default App
