import { Server } from 'socket.io'

let io
const connectedSockets = new Map()

export const initIOConnection = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        const { user } = socket.handshake.auth
        connectedSockets.set(socket.id, user)
        console.log(`Connection to Socket.io established by ${user} with id: ${socket.id}`)

        socket.on('data-changed', () => {
            io.sockets.sockets.forEach((s) => {
                if (!s.data.isPaused) {
                    s.emit('update-data', { updatedBy: user })
                }
            });
        })

        socket.on('cell-to-block', (cell) => {
            console.log(cell)
            io.sockets.sockets.forEach((s) => {
                s.emit('block-cell', cell)
            });
        })

        socket.on('cell-unblock', (cell) => {
            console.log(cell)
            io.sockets.sockets.forEach((s) => {
                s.emit('unblock-cell', cell)
            })
        })

        socket.on('disconnect', () => {
            console.log(`User ${user} disconnected`)
        })
    })

    return io
}