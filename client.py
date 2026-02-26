import socket

host = '169.254.1.17'
port = 12345
socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.connect((host,port))
socket.send("Hello Server".encode('utf-8'))
print(socket.recv(1024).decode('utf-8'))