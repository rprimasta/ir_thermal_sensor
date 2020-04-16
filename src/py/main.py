import asyncio
from ws import ws
import random
import board
import busio as io
import adafruit_mlx90614
import time
import board
import adafruit_hcsr04
from digitalio import DigitalInOut, Direction, Pull

##lamp control output
lamp_green = DigitalInOut(board.D23)
lamp_green.direction = Direction.OUTPUT
lamp_yellow = DigitalInOut(board.D25)
lamp_yellow.direction = Direction.OUTPUT
lamp_red = DigitalInOut(board.D8)
lamp_red.direction = Direction.OUTPUT
buzzer = DigitalInOut(board.D17)
buzzer.direction = Direction.OUTPUT

sonar = adafruit_hcsr04.HCSR04(trigger_pin=board.D18, echo_pin=board.D24)
# the mlx90614 must be run at 100k [normal speed]
# i2c default mode is is 400k [full speed]
# the mlx90614 will not appear at the default 400k speed
i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
mlx = adafruit_mlx90614.MLX90614(i2c)

offs = 5.0

def regression(x):
    return (0.007780088719)*(x**2) - 0.3911205209 * x + 4.757324014

def randrange_float(start, stop, step):
    return random.randint(0, int((stop - start) / step)) * step + start

async def task_sensor():
    try:
        jarak = sonar.distance
        suhu = mlx.object_temperature + offs
        
        if jarak <= 20:
            suhu = suhu - regression(jarak)
        
        await sock.broadcast_message({'suhu':suhu, 'jarak':jarak})
    
    except RuntimeError:
        print("Retrying!")

async def recv_callback(data):
    print (data)
    if (data['flag_lamp'] == 1):
        print('idle')
        #idle
    elif (data['flag_lamp'] == 2):
        print('please wait')
	    #please wait
    elif (data['flag_lamp'] == 3):
        print('normal')
        buzzer.value=True
        await asyncio.sleep(1)
        buzzer.value=False
	    #suhu normal
    elif (data['flag_lamp'] == 4):
        print('tidak normal')
        buzzer.value=True
        await asyncio.sleep(1)
        buzzer.value=False
	    #suhu tidak normal
async def run_forever_task(task,sleep):
    while True:
        await task()
        await asyncio.sleep(sleep)

sock = ws(8887,recv_callback)

tasks = [
    asyncio.ensure_future(sock.listen()),
    asyncio.ensure_future(run_forever_task(task_sensor,0.200)), #250 ms
]

asyncio.get_event_loop().run_until_complete(asyncio.wait(tasks))
