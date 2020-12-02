module.exports.run = (bot, msg, args, database) => {
    let  users = msg.guild.members.cache.map(u=>u);
    users.forEach(u => {
        if(!u.user.bot)
        {
            let user = database.getAccount(u);
            var timestamp = user.totalUptime;

            // 2
            var hours = Math.floor(timestamp / 60 / 60);
            
            // 37
            var minutes = Math.floor(timestamp / 60) - (hours * 60);
            
            // 42
            var seconds = timestamp % 60;
            let formatted = hours + ':' + minutes + ':' + seconds;
            msg.channel.send(`Пользователь: ${user.username}#${user.discriminator}\nПроведено времени: ${formatted} (ч.м.с)\n____________________`);
        }
    });
   
}