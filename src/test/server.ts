import { CONFIG } from '../data/config';
export function clearRedis() {
    Sail.io.emit('test', { userId: CONFIG.user_id, func: 'delRedisCache' });
}
