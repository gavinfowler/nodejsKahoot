class Games{
	constructor(){
		this.games = [];
	}
	//TODO: add a game and remove a game
	getGame(hostID){
		return this.games.filter((game) => game.hostID === hostID)[0];
	}
}
module.exports = {Games};
