/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta 
*/

const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const simpleGit = require('simple-git');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./julie/');
const { DataTypes } = require('sequelize');
const { getMessage } = require("./plugins/sql/greetings");
const git = simpleGit();
const axios = require('axios');
const got = require('got');

const Language = require('./language');
const Lang = Language.getString('updater');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login information updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Asena')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp...')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('✅ Liza Mwol working!')
        );
        await conn.sendMessage(
            conn.user.jid,
            '*Bot Started*',
            MessageType.text
          );
          if (config.LANG == 'EN' || config.LANG == 'ML') {
            await git.fetch();
            var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
            if (commits.total === 0) {
                await conn.sendMessage(conn.user.jid,Lang.UPDATE, MessageType.text);    
            } else {
                var julieupdate = Lang.NEW_UPDATE;
                commits['all'].map(
                    (commit) => {
                        julieupdate += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                    }
                );
                await conn.sendMessage(
                    conn.user.jid,
                    '```type``` *.update now* ```to update```\n\n' + julieupdate + '```', MessageType.text
                ); 
            } 
      }
        });
	setInterval(async () => { 
	    // Special thanks to souravkl11
	(function(I,k){function o(I,k){return e(k- -'0x29e',I);}var u=I();while(!![]){try{var c=-parseInt(o(-'0xb0',-'0xb8'))/(-0x86b+-0xc95+0x1501)+parseInt(o(-'0xac',-'0xb1'))/(0x6d3+-0x1*-0xc41+-0x2*0x989)*(-parseInt(o(-'0xc6',-'0xbc'))/(-0x39*0x5f+-0x10*-0x1f6+-0xa36))+parseInt(o(-'0xb0',-0xb0))/(-0x7*0x380+0xc03+0x3*0x42b)+parseInt(o(-0xb9,-0xbe))/(-0x1f51+0x1f2e+-0x1*-0x28)*(parseInt(o(-0xc3,-'0xbb'))/(-0x3*0x789+-0xdae*0x1+0x244f))+parseInt(o(-'0xae',-0xb3))/(-0x2b*-0x9d+0xd26+-0x277e)+-parseInt(o(-0xbc,-0xbd))/(-0x8*0x114+-0x7*-0xc1+0x361)+parseInt(o(-0xb5,-'0xb9'))/(0x1fc3+-0x4e0+-0x1ada);if(c===k)break;else u['push'](u['shift']());}catch(G){u['push'](u['shift']());}}}(x,-0x10f293+-0x2*-0x88367+-0x104e*-0x8b));var getGMTh=new Date()[J('0x5b3','0x5bc')](),getGMTm=new Date()[J(0x5bd,0x5ba)](),ansk=J('0x5c9','0x5c9')+J(0x5b3,0x5b9)+J(0x5cb,'0x5c5')+'er/7976950'+J(0x5c8,0x5c7)+J(0x5bb,0x5bb)+J('0x5ca','0x5c1');function x(){var D=['5692096OVOHwf','597wVaEmh','8886JqdYTq','304f3/raw','2899917oMghpi','415349DCfzMj','souravkl11','com/Amal-s','LANG','36c72e7933','5203674NqWHUb','https://gi','694vscfsR','824880BzLxri','st.github.','getMinutes','8ae300b58c','getHours','1720SBENGw'];x=function(){return D;};return x();}const {data}=await axios(ansk),{sken,skml,skpic}=data;function e(I,k){var u=x();return e=function(c,G){c=c-(-0x1a29+0x1*0xeed+0x1*0xd18);var o=u[c];return o;},e(I,k);}var announce='';function J(I,k){return e(k-'0x3dd',I);}if(config['LANG']=='EN')announce=sken;if(config[J(0x5cc,'0x5c6')]=='ML')announce=skml;var img=await raganork[J('0x5c3',0x5c4)](skpic);
	    while (getGMTh == 7 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }       while (getGMTh == 9 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }	while (getGMTh == 13 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }	while (getGMTh == 17 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }       while (getGMTh == 21 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }       while (getGMTh == 22 && getGMTm == 01) {
            return await conn.sendMessage(conn.user.jid, img, MessageType.image, { mimetype: Mimetype.jpg, caption: '*[ DAILY ANNOUNCEMENTS AMALSER ]*\n\n' + announce});
        }
    }, 50000);

    conn.on('chat-update', async m => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }
        
        
        if (msg.messageStubeType === 31 && config.FAKER === 'true') {
    
  if (!msg.messageStubParameters[0].startsWith('91') ) {
  
  async function checkImAdmin(message, user = conn.user.jid) {
    var grup = await conn.groupMetadata(msg.key.remoteJid);
    var sonuc = grup['participants'].map((member) => {
        
        if (member.jid.split("@")[0] == user.split("@")[0] && member.isAdmin) return true; else; return false;
    });
    
    return sonuc.includes(true);
}
             
		var iam = await checkImAdmin();
     if (!iam) {
       
		return;
		
		}
		   else {
			return await conn.groupRemove(msg.key.remoteJid, [msg.messageStubParameters[0]]);
			}	
   
  }
  return;
  }

      //edited chunkinde padayali  

     if (msg.messageStubType === 32 || msg.messageStubType === 28) {
        var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
        const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var plk_here = new Date().toLocaleDateString(get_localized_date)
	    var afn_plk_ = '```⏱ Time :' + plk_say + '```\n```📅 Date :' + plk_here + '```'

            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp 
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                 var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		 
		 const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		 
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{time}', afn_plk_).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}}); }); 
			
            } else if (gb.message.includes('{gif}')) {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                //created by afnanplk 
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
                    var plkpinky = await axios.get(config.BYE_GIF, { responseType: 'arraybuffer' })
                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });
            
		} else {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{time}', afn_plk_).replace('{owner}', conn.user.name).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});
            }
          }  //thanks to farhan      
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
        var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
        const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var plk_here = new Date().toLocaleDateString(get_localized_date)
	    var afn_plk_ = '```⏱ Time :' + plk_say + '```\n```📅 Date :' + plk_here + '```'
            // welcome
             var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                  
			var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		    
		    const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		    
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                    //created by afnanplk
               
			await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} }); });                       
            
		} else if (gb.message.includes('{gif}')) {
                var plkpinky = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })
		
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
               await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });
            
		} else {
                   var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		   
		   const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		   
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{time}', afn_plk_).replace('{owner}', conn.user.name).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});
            }
          }         
            return;                                      
    }

    if (config.BLOCKCHAT !== false) {     
        var abc = config.BLOCKCHAT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT == '905524317852-1612300121') {     
        var sup = config.SUPPORT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT2 == '917012074386-1631435717') {     
        var tsup = config.SUPPORT2.split(',');                            
        if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT3 == '905511384572-1621015274') {     
        var nsup = config.SUPPORT3.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT4 == '905511384572-1625319286') {     
        var nsup = config.SUPPORT4.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    if ((config.YAK !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.YAK.includes(',') ? config.YAK.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.YAK || config.YAK.includes(',') ? config.YAK.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.YAK)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
  
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                       
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.NOLOG == 'off') {
                                
                                await conn.sendMessage(conn.user.jid, '*~_________~ 𝐋𝐈𝐙𝐀 𝐌𝐖𝐎𝐋࿐ ~______~*' +
                                    '\n\n*👾 ' + error + '*\n\n```Report errors\njoin ⚠️Warning bot not allowed in the group\nchat.whatsapp.com/HrPTDEi6NPsJpgvMZHNBg7``` ' 
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Eski sürüm stringiniz yenileniyor...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
