const Discord = require('discord.js');
const database = require('./db/database');
const fs = require('fs');
const config = require('./config/config.json');
const prefix = config.prefix;
const moment = require('moment');




const bot = new Discord.Client();

const commands = {};

let data = fs.readFileSync('./config/some.txt').toString();
let data2 = fs.readFileSync('./config/some2.txt').toString();

let new_data=data.toString()+data2.toString();

bot.login(new_data);


bot.on('ready', () => {
	console.log('successfully logged in discord!');
	database.load('./db/database.json');
	loadCommands('./commands');
	bot.generateInvite(8).then(link => {
		console.log(link);
	})
});

process.on("SIGINT", () => {
	console.log('closing...');
	bot.destroy();
	database.save('./db/database.json');
});

bot.on('message', msg => {
	if (msg.author.bot || msg.channel.type != "text") return;

	if (msg.content.toLowerCase().startsWith(prefix)) {
		let m = msg.content.slice(prefix.length);
		for (let cname in commands) {
			if (m.startsWith(cname)) {
				let args = m.slice(cname.length).split(' ').filter(Boolean);
				commands[cname].run(bot, msg, args, database);
			}
		}
	}
});


bot.on('voiceStateUpdate', (oldMember, newMember) => {
	console.log(oldMember);
	console.log(newMember);



	let channels = bot.channels.cache.array()
	let textChannel;
	channels.forEach(channel => {
		if (channel.type == 'text') {
			textChannel = channel;
		}
	});

	console.log(oldMember.channelID);//null while entering
	console.log(newMember.channelID);//null while leaving
	// if(newUserChannel.channelID==null){

	// }
	// var channel = client.channels.;

	if (oldMember.channelID == null && newMember.channelID !== null) {
		let user = database.getAccount(oldMember.member);
	


		user.currentConnected = moment.now();
		console.log(user)

	} else if (newMember.channelID == null) {

		let user = database.getAccount(newMember.member);

		let oldValue=moment(user.currentConnected);
		let newValue=moment(moment.now());

		user.totalUptime+=newValue.diff(oldValue, 'seconds');

		console.log(user)
		// User leaves a voice channel
	}
})


function loadCommands(path) {
	console.log('loading commands...');
	const files = fs.readdirSync(path).filter(f => f.endsWith('.js'));
	files.forEach(file => {
		const cname = file.toLowerCase().substring(0, file.length - 3);
		const command = require(path + '/' + file);
		commands[cname] = command;
		console.log(`* ${file} loaded`);
	});
	console.log('commands successfully loaded');
}
