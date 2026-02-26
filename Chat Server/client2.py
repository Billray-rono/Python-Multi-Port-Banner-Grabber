import socket
HOST = '127.0.0.1'
PORT = 5000
sockets = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sockets.connect((HOST, PORT))
sockets.send("Hello , how are you?".encode('utf-8'))
print(sockets.recv(1024).decode('utf-8'))

username = "client2"
sockets.send(username.encode('utf-8'))

input("Enter username: ")