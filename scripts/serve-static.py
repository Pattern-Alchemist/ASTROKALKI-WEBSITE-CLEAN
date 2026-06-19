#!/usr/bin/env python3
"""Lightweight static file server for the AstroKalki website."""
import http.server
import socketserver
import os
import sys

os.chdir('/home/z/my-project/out')

PORT = 3000

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress logs
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(('0.0.0.0', PORT), QuietHandler) as httpd:
    print(f'Static server ready on 0.0.0.0:{PORT}', flush=True)
    httpd.serve_forever()
