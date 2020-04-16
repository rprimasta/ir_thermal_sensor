# CircuitPython IO demo #1 - General Purpose I/O
import time
import board
from digitalio import DigitalInOut, Direction, Pull
 
lamp_green = DigitalInOut(board.D23)
lamp_green.direction = Direction.OUTPUT
 
while True:
    # We could also do "led.value = not switch.value"!
    lamp_green.value = False
    time.sleep(3)  # debounce delay
    lamp_green.value = True 
    time.sleep(3)  # debounce delay
