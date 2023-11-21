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
        console.log(`socks5://${username}:${password}@${host}:${port}`)
        const agent = new SocksProxyAgent(
            `socks5://${username}:${password}@${host}:${port}`
        )
        // 创建Telegram客户端实例
        this.client = new TelegramClient(
            new StringSession(string_session),
            api_id,
            api_hash,
            {
                agent: this.agent,
                connectionRetries: 5,
                deviceModel: device_model,
                systemVersion: system_version,
                appVersion: app_version,
                langCode: lang_code,
                systemLangCode: system_lang_code
            }
        );
    }

    parseProxyConfig(proxyString) {
        const [, auth, hostPort] = proxyString.split('@');
        const [username, password] = auth.split(':');
        const [host, port] = hostPort.split(':');
        return {host, port: parseInt(port, 10), username, password};
    }

    async connect() {
        try {
            return Promise.resolve(await this.client.connect())
        } catch (error) {
            if (error.message === 'AUTH_KEY_UNREGISTERED') {
                return Promise.resolve(new Error(`StringSession 已过期或无效`))
            } else {
                return Promise.reject(error)
            }
        }
    }

    async disconnect() {
        try {
            return Promise.resolve(await this.client.disconnect())
        } catch (error) {
            if (error.message === 'AUTH_KEY_UNREGISTERED') {
                return Promise.reject(new Error('StringSession 已过期或无效。'))
            } else {
                return Promise.reject(error)
            }
        }
    }

    getUpdate(callback = undefined) {
        this.client.addEventHandler((update) => {
            if (update && callback && typeof callback === "function") callback(update)
        }, new NewMessage({}));
    }

    async sendMessage(to, message) {
        await this.client.sendMessage(to, {message});
    }

    async search(params) {
        try {
            //逻辑代码
            return Promise.resolve(await this.client.invoke(new Api.contacts.Search(params)))
        } catch (e) {
            return Promise.reject(e)
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
            return Promise.resolve(await this.client.invoke(new Api.account.UpdateProfile(updateData)))
        } catch (e) {
            throw new Error(e.message)
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
            return Promise.resolve(await this.client.invoke(new Api.channels.InviteToChannel({
                channel: await this.client.getEntity(groupUsernane),
                users: userToInvite
            })))
        } catch (e) {
            return Promise.reject(e)
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
            return Promise.resolve(await this.client.invoke(new Api.channels.InviteToChannel({
                channel: await this.client.getInputEntity(groupId),
                users: userToInvite
            })))
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async joinToGroupOrChannel(channel_username_or_id) {
        try {
            //逻辑代码
            const channel = await this.client.getEntity(channel_username_or_id);
            // 加入频道
            return Promise.resolve(await this.client.invoke(new Api.channels.JoinChannel({
                channel: channel
            })))
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async updateStatus(status = false) {
        try {
            //逻辑代码
            return Promise.resolve(await this.client.invoke(new Api.account.UpdateStatus({
                offline: status
            })))
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

export default TelegramClass


