
import websockets
import asyncio
import time
import ssl
import websockets
import json
import re
class ws:
    def __init__(self,port,recvCallback = None):
        self.port = port
        self.ws = {}
        self.recvCallback = recvCallback
    
    async def broadcast_message(self, msg):
        for websocket, data in self.ws.items():
            try:
                await websocket.send(json.dumps(msg))
            except:
                print('aaaaaaaaaaaa')

    async def handler_sensor(self, websocket):
        self.ws[websocket] = {}
        print ('Websocket sensor '+str(len(self.ws))+' connected')
        try:
            while True:    
                msg = await websocket.recv() 
                try:
                    msg = json.loads(msg)
                    if (self.recvCallback != None):
                        await self.recvCallback(msg); 
                except Exception as e:
                    print(e)     
        except Exception as e:
            print(e)
        finally:
            print('Websocket sensor '+str(len(self.ws))+' disconnected')
            self.ws.pop(websocket)


    async def websocket_handler(self, websocket, path):
        
        paths = re.search('([A-Za-z0-9-_]+)',path)
        if (paths == None): return
        if (paths[0] == 'sensor'):
            await self.handler_sensor(websocket)


    async def listen(self):
        #return await websockets.serve(self.websocket_handler, port= self.port)
        #return websockets.serve(self.websocket_handler, port= self.port)
        #ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        #ssl_context.load_cert_chain(certfile='apache-selfsigned.crt', keyfile='apache-selfsigned.key')
       
        input_coroutines = [

            websockets.serve(self.websocket_handler, port= self.port)
            #websockets.serve(self.websocket_handler, port= self.port, ssl=ssl_context),
            ] 
     
        while True: 
            try:
                await asyncio.sleep(0)
                # try:
                res = await asyncio.gather(*input_coroutines)

            except Exception as e:
                a = 0
            #     print('Websocket listen exception')
            #     print(e)  

  