# Chat Server and Clients

Quick instructions to run the chat server and clients locally (Windows PowerShell).

1. Start the chat server (Chat Server folder):

```powershell
python "c:\Users\Administrator\Desktop\cybersec py\Chat Server\server.py"
```

2. In a second terminal run any client (they now auto-send a username):

```powershell
python "c:\Users\Administrator\Desktop\cybersec py\Chat Server\client1.py"
python "c:\Users\Administrator\Desktop\cybersec py\Chat Server\client2.py"
python "c:\Users\Administrator\Desktop\cybersec py\Chat Server\client3.py"
```

3. The top-level `client.py` connects to a different server IP (`169.254.1.17:12345`). To use it with this chat server, change its `host` and `port` to `127.0.0.1` and `5000`.

4. Notes:
- Start the server before running clients.
- If a client appears to hang, check that the server is running and listening on `127.0.0.1:5000`.
