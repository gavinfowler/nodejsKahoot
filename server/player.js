class Players{
	constructor(){
		this.player = []
	}
	addPlayer(playerID){
		var player = this.player={playerID};
		this.player.push(player);
		return player;
	}
	removePlayer(playerID){
		var player = this.getPlayer(playerID);
		if(player){
			this.players = this.players.filter((player) => player.playerID !== playerID);
		}
		return player;
	}
	getPlayer(playerID){
		return this.players.filter(player => player.playerID === playerID)[0];
	}
	getPlayers(hostID){
		return this.players.filter((player) => player.hostID === hostID);
	}
}
module.exports = {Players};
