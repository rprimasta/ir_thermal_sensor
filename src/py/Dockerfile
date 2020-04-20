FROM python:3.7
WORKDIR /usr/src/ir_thermal_sensor
RUN pip install websockets
RUN pip install asyncio
RUN pip install Adafruit-Blinka
RUN pip install adafruit-circuitpython-mlx90614
RUN pip install adafruit-circuitpython-hcsr04
RUN apt-get install libgpiod2
COPY . .
CMD ["python","/usr/src/ir_thermal_sensor/main.py"]
