import { ROKU_API } from '@src/shared/constants/roku-endpoints.const';

export type RokuRemoteCommand =
    | 'home'
    | 'back'
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'select'
    | 'playPause'
    | 'rewind'
    | 'fastForward'
    | 'info'
    | 'volumeUp'
    | 'volumeDown'
    | 'mute'
    | 'power';

const COMMAND_ENDPOINTS: Record<RokuRemoteCommand, string> = {
    home: ROKU_API.KEY_PRESS.HOME,
    back: ROKU_API.KEY_PRESS.BACK,
    up: ROKU_API.KEY_PRESS.UP,
    down: ROKU_API.KEY_PRESS.DOWN,
    left: ROKU_API.KEY_PRESS.LEFT,
    right: ROKU_API.KEY_PRESS.RIGHT,
    select: ROKU_API.KEY_PRESS.SELECT,
    playPause: ROKU_API.KEY_PRESS.PLAY_PAUSE,
    rewind: ROKU_API.KEY_PRESS.REWIND,
    fastForward: ROKU_API.KEY_PRESS.FAST_FORWARD,
    info: ROKU_API.KEY_PRESS.INFO,
    volumeUp: ROKU_API.KEY_PRESS.VOLUME_UP,
    volumeDown: ROKU_API.KEY_PRESS.VOLUME_DOWN,
    mute: ROKU_API.KEY_PRESS.VOLUME_MUTE,
    power: ROKU_API.KEY_PRESS.POWER,
};

async function postEcp(ip: string, path: string): Promise<boolean> {
    if (!ip) return false;
    try {
        const response = await fetch(`${ROKU_API.BASE_URL(ip)}${path}`, {
            method: 'POST',
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Un carácter literal: `/keypress/Lit_<valor>` con el carácter URL-encoded (p. ej. espacio → Lit_%20).
 * @see https://developer.roku.com/docs/developer-program/dev-tools/external-control-api.md
 */
export async function sendRokuLitKey(ip: string, char: string): Promise<boolean> {
    if (!ip || char.length !== 1) return false;
    const encoded = encodeURIComponent(char);
    return postEcp(ip, `${ROKU_API.KEY_PRESS.SEND_TEXT(encoded)}`);
}

export async function sendRokuKeyBackspace(ip: string): Promise<boolean> {
    return postEcp(ip, ROKU_API.KEY_PRESS.BACKSPACE);
}

export async function sendRokuKeyEnter(ip: string): Promise<boolean> {
    return postEcp(ip, ROKU_API.KEY_PRESS.ENTER);
}

export async function sendRokuRemoteCommand(ip: string, command: RokuRemoteCommand): Promise<boolean> {
    if (!ip) return false;

    const endpoint = COMMAND_ENDPOINTS[command];
    if (!endpoint) return false;

    return postEcp(ip, endpoint);
}
