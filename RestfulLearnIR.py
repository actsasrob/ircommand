#!/usr/bin/env python3
"""
Restful web server for sending and receiving IR signals from LearnIR USB device.
Usage::
    ./RestfulLearnIR.py [<port>]
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import threading
import time

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_headers()
        self.wfile.write(bytes("<html><head><title>RestfulLearnIR</title></head>", "utf-8"))
        self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        self.wfile.write(bytes("<body>", "utf-8"))
        self.wfile.write(bytes("<p>This is an example web server.</p>", "utf-8"))
        self.wfile.write(bytes("</body></html>", "utf-8"))

    def do_POST(self):
        '''Reads post request body'''
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n", str(self.path), str(self.headers), post_data.decode('utf-8'))

        self._set_headers()
        #self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))
        self.wfile.write(bytes("received post request:<br>{}".format(post_data), "utf-8"))
    

    def do_PUT(self):
        self.do_POST()

def run(server_class=HTTPServer, handler_class=S, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

def handle_LearnIR_IO_thread(name):
    logging.info("Thread %s: starting", name)
    while True:
        time.sleep(2)
        logging.info("Thread %s: still working", name)

if __name__ == '__main__':
    from sys import argv

    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO,
                        datefmt="%H:%M:%S")

    x = threading.Thread(target=handle_LearnIR_IO_thread, args=(1,), daemon=True)
    x.start()
    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
