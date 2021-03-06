import io from 'socket.io-client';
import log from './log';

const socket = io.connect('');

socket.on('connect', () => {
    log.debug('socket.io: connected');
});
socket.on('error', () => {
    log.error('socket.io: error');
    socket.destroy();
});
socket.on('close', () => {
    log.debug('socket.io: closed');
});

export default socket;
