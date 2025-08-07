
import http.server
import socketserver
import os

PORT = 7100

web_dir = os.path.join(os.path.dirname(__file__), 'src')
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever()
