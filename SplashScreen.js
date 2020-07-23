import React from "react"
import title from "./images/title.png"
import reelImg from "./images/reel.png"

function SplashScreen() {
	return (
		<div className="splashScreenContainer">
			<img src={title} className="splashScreenTitle" alt=""></img>
			<img src={reelImg} className="splashScreenBackground" alt=""></img>
			<img
				src={reelImg}
				id="middleReel"
				className="splashScreenBackground"
				alt=""
			></img>
			<img src={reelImg} className="splashScreenBackground" alt=""></img>
		</div>
	)
}

export default SplashScreen
