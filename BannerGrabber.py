import socket

def grab_banner(ip, port):
    try:

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.5) 
        
        s.connect((ip, port))
        
        
        if port == 80 or port == 443:
            s.send(b"GET / HTTP/1.1\r\nHost: " + ip.encode() + b"\r\n\r\n")
            
        banner = s.recv(1024)
        return banner.decode().strip()
    except:
        return None 
    finally:
        s.close()

target = input(f"input ip address ")

common_ports = [21, 22, 23, 25, 80, 110, 443]

print(f"--- Scanning {target} ---")
for port in common_ports:
    result = grab_banner(target, port)
    if result:
        print(f"[+] Port {port}: {result}")
    else:
        print(f"[-] Port {port}: No banner/Closed")