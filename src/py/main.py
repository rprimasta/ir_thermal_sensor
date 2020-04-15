import asyncio
from ws import ws
import random

def randrange_float(start, stop, step):
    return random.randint(0, int((stop - start) / step)) * step + start

async def task_sensor():
  
    suhu = randrange_float(34, 39, 0.1)
    jarak = randrange_float(1, 10, 0.1)
    await sock.broadcast_message({'suhu':suhu, 'jarak':jarak})




async def run_forever_task(task,sleep):
    while True:
        await task()
        await asyncio.sleep(sleep)

sock = ws(8887)

tasks = [
    asyncio.ensure_future(sock.listen()),
    asyncio.ensure_future(run_forever_task(task_sensor,0.500)), #250 ms
]

asyncio.get_event_loop().run_until_complete(asyncio.wait(tasks))