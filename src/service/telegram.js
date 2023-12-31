import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';
import {SocksProxyAgent} from 'socks-proxy-agent';
import {NewMessage} from "telegram/events";
import {Api} from "telegram/tl";

class TelegramClass {
    client = undefined

    constructor({
                    api_id,
                    api_hash,
                    string_session,
                    proxy,
                    device_model,
                    system_version,
                    app_version,
                    lang_code,
                    system_lang_code
                }) {
        // 解析SOCKS5代理配置
        const {host, port, username, password} = this.parseProxyConfig(proxy);
        // 创建Telegram客户端实例
        this.client = new TelegramClient(
            new StringSession(string_session),
            api_id,
            api_hash,
            {
                proxy: {
                    socksType:5,
                    ip: host,
                    port: port,
                    MTProxy: false,
                    timeout: 5,
                    username: username,
                    password: password
                },
                connectionRetries: 1,
                deviceModel: device_model,
                systemVersion: system_version,
                appVersion: app_version,
                langCode: lang_code,
                systemLangCode: system_lang_code
            }
        );
    }


    parseProxyConfig(proxyString) {
        const [auth, hostPort] = proxyString.split('@');
        const [username, password] = auth.split(':');
        const [host, port] = hostPort.split(':');
        return {host, port: parseInt(port, 10), username, password};
    }

    async connect() {
        try {
            const result = await this.client.connect()
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async disconnect() {
        try {
            // await this.client.
            await this.client.disconnect()
            return Promise.resolve(true)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    getUpdate(callback = undefined) {
        this.client.addEventHandler((update) => {
            if (update && callback && typeof callback === "function") callback(update)
        }, new NewMessage({}));
    }

    async sendMessage(to, message) {
        try {
            //逻辑代码
            const result = await this.client.sendMessage(to, {message});
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async search(params) {
        try {
            //逻辑代码
            const result = await this.client.invoke(new Api.contacts.Search(params))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async updateProfile(profile) {
        try {
            let updateData = {}
            if (profile?.firstName) updateData.firstName = profile.firstName
            if (profile?.lastName) updateData.lastName = profile.lastName
            if (profile?.about) updateData.about = profile.about
            if (JSON.stringify(updateData) === "{}") return Promise.resolve(false)
            //逻辑代码
            const result = await this.client.invoke(new Api.account.UpdateProfile(updateData))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    /** 通过用户名 邀请加入群 **/
    async inviteUserNameToGroup(groupUsernane, userName) {
        try {
            //逻辑代码
            let userToInvite = [];
            if (Array.isArray(userName)) {
                for (const userNameElement of userName) {
                    userToInvite.push(await this.client.getEntity(userNameElement))
                }
            } else {
                userToInvite.push(await this.client.getEntity(userName))
            }
            const result = await this.client.invoke(new Api.channels.InviteToChannel({
                channel: await this.client.getEntity(groupUsernane),
                users: userToInvite
            }))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    /** 通过用户ID 邀请加入群 **/
    async inviteUserIdToGroup(groupId, userId) {
        try {
            //逻辑代码
            let userToInvite = [];
            if (Array.isArray(userId)) {
                for (const userIdElement of userId) {
                    userToInvite.push(await this.client.getInputEntity(userIdElement))
                }
            } else {
                userToInvite.push(await this.client.getInputEntity(userId))
            }
            const result = await this.client.invoke(new Api.channels.InviteToChannel({
                channel: await this.client.getInputEntity(groupId),
                users: userToInvite
            }))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async joinToGroupOrChannel(channel_username_or_id) {
        try {
            //逻辑代码
            const channel = await this.client.getEntity(channel_username_or_id);
            // 加入频道
            const result = await this.client.invoke(new Api.channels.JoinChannel({
                channel: channel
            }))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async updateStatus(status = false) {
        try {
            //逻辑代码
            const result = await this.client.invoke(new Api.account.UpdateStatus({
                offline: status
            }))
            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default TelegramClass


