import socket

Host='169.254.1.17'
port=12345

server=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((Host,port))
server.listen(5)

while True:
    communication_socket , address = server.accept()
    print(f"Connection from {address} has been established.")
    massage = communication_socket.recv(1024).decode('utf-8')
    print(f"Message from client: {massage}")
    communication_socket.send(f"got your message {massage}".encode ('utf-8'))
    communication_socket.close()
    print(f"Connection from {address} has been closed.")
    